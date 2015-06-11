var canvas;
var context;
var terrainPattern;

MousePosition = {x: 0, y: 0};

var player = undefined;
var lastFire = Date.now();
var lastEnemyAdded = Date.now();
var timeBetweenEnemyAdded = 1000;
var timeBetweenFire = 100;
var bullets = [];
var enemies = [];
var bonuses = [];
var gameScore = 0;
var isGameOver = false;
var bonusTimer = undefined;

Sound.load('sound/cg1.wav', 'gun');
Sound.load('sound/zombie1.wav', 'zombie1');
Sound.load('sound/zombie2.wav', 'zombie2');

resources.load('img/smile.png');
resources.load('img/terrain.png');
resources.onReady(start);

function start() {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;
    document.onselectstart = function() { return false; };

    terrainPattern = context.createPattern(resources.get('img/terrain.png'), 'repeat');

    document.body.appendChild(canvas);

    player = new Player([canvas.width / 2 - 10, canvas.height / 2 - 10]);

    document.getElementById('play-again').addEventListener('click', function() {
        resetGame();
    });

    setScore(0);
    mainLoop();
}

document.addEventListener('mousemove', function (event) {
    var rect = canvas.getBoundingClientRect();
    MousePosition.x = Math.round(event.pageX - rect.left);
    MousePosition.y = Math.round(event.pageY - rect.top);
});

function mainLoop() {
    update();
    draw();

    requestAnimationFrame(mainLoop);
}

function update() {

    if (isGameOver) {
        return false;
    }

    handleInput();
    checkCollision();

    player.update();

    for (var i = 0; i < bonuses.length; i++) {
        if (bonuses[i].isOutdated()) {
            bonuses.splice(i, 1);
        }
    }

    addRandomEnemy();
    addRandomBonus();

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update();
    }

    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        bullet.update();
    }
}

function draw() {
    context.fillStyle = terrainPattern;
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    player.draw(context);
    for (var i = 0; i< bullets.length; i++) {
        bullets[i].draw(context);
    }

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw(context);
    }

    for (var i = 0; i < bonuses.length; i++) {
        bonuses[i].draw(context);
    }
}

function setScore(score) {
    gameScore = score;
    document.getElementById('score').innerHTML = score;
}

function handleInput() {
    if (input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += player.speed;
    }

    if (input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= player.speed;
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= player.speed;
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += player.speed;
    }

    if ((input.isMouseDown() || input.isDown('SPACE')) && Date.now() - lastFire > timeBetweenFire) {
        lastFire = Date.now();
        var x = player.pos[0] + player.radius;
        var y = player.pos[1] + player.radius;
        var vector = [MousePosition.x - x , MousePosition.y - y];
        var distance = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        var normalizedVector = [vector[0] / distance, vector[1] / distance];
        var bullet = new Bullet([x, y], 5, normalizedVector, 15);
        bullets.push(bullet);
        Sound.play('gun');
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addRandomBonus() {
    if (Math.random() < 0.002) {
        var x = getRandomInt(0, canvas.width);
        var y = getRandomInt(0, canvas.height);
        bonuses.push(new Bonus([x, y]));
    }
}

function addRandomEnemy() {
    if (Date.now() - lastEnemyAdded < timeBetweenEnemyAdded) {
        return false;
    }

    // выбор стороны, где появится враг
    var rand = Math.random();

    var x, y;

    if (rand < 0.25) { // left
        x = -20;
        y = getRandomInt(0, canvas.height);
    } else if (rand < 0.5) { // right
        x = canvas.width + 20;
        y = getRandomInt(0, canvas.height);
    } else if (rand < 0.75) { // top
        x = getRandomInt(0, canvas.width);
        y = -20;
    } else { // bottom
        x = getRandomInt(0, canvas.width);
        y = canvas.height + 20;
    }

    enemies.push(new Enemy([x, y], 20, 2));

    lastEnemyAdded = Date.now();

    if (timeBetweenEnemyAdded > 100) {
        timeBetweenEnemyAdded *= 0.97;
    }
}

function checkCollision() {
    if (player.pos[0] < 0) {
        player.pos[0] = 0;
    } else if (player.pos[0] + player.radius * 2 >= canvas.width) {
        player.pos[0] = canvas.width - player.radius * 2;
    }

    if (player.pos[1] < 0) {
        player.pos[1] = 0;
    } else if (player.pos[1] + player.radius * 2 >= canvas.height) {
        player.pos[1] = canvas.height - player.radius * 2;
    }

    for (var i = 0; i < bullets.length; i++) {
        if (checkWorldOut(bullets[i].pos, bullets[i].radius)) {
            bullets.splice(i, 1);
            i++;
        }
    }

    for (var i = 0; i < enemies.length; i++) {
        var pos = enemies[i].pos;
        var radius = enemies[i].radius;

        for (var j = 0; j < bullets.length; j++) {
            var bpos = bullets[j].pos;
            var bradius = bullets[j].radius;

            if (checkRoundCollides(pos, radius, bpos, bradius)) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                i++;
                setScore(gameScore + 1);
                if (Math.random() < 0.5) {
                    Sound.play('zombie1');
                } else {
                    Sound.play('zombie2');
                }
                break;
            }
        }
    }

    for (var i = 0; i < bonuses.length; i++) {
        var bonus = bonuses[i];
        if (checkRoundCollides(player.pos, player.radius, bonus.pos, bonus.radius)) {
            bonus.applyTo(player);
            bonuses.splice(i, 1);
            i++;
        }
    }

    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (checkRoundCollides(enemy.pos, enemy.radius, player.pos, player.radius)) {
            gameOver();
        }
    }

}

function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
}

function resetGame() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    clearTimeout(bonusTimer);
    timeBetweenFire = 100;

    bullets = [];
    enemies = [];
    bonuses = [];

    setScore(0);
    timeBetweenEnemyAdded = 1000;

    player.pos = [canvas.width / 2 + player.radius, canvas.height / 2 + player.radius];
}

function checkRoundCollides(pos1, radius1, pos2, radius2) {
    var center1 = [pos1[0] + radius1, pos1[1] + radius1];
    var center2 = [pos2[0] + radius2, pos2[1] + radius2];
    var dist = [Math.abs(center1[0] - center2[0]), Math.abs(center1[1] - center2[1])];
    var length = Math.sqrt(dist[0] * dist[0] + dist[1] * dist[1]);

    if (length < radius1 + radius2) {
        return true;
    }

    return false;
}

function checkWorldOut(pos, radius) {
    if (pos[0] < 0) {
        return true;
    } else if (pos[0] + radius * 2 > canvas.width) {
        return true;
    }

    if (pos[1] < 0) {
        return true;
    } else if (pos[1] + radius * 2 > canvas.height) {
        return true;
    }

    return false;
}
