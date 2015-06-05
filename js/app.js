
var canvas;
var context;
var terrainPattern;

MousePosition = {x: 0, y: 0};

function Player(pos, radius, speed) {
    this.pos = pos;
    this.radius = radius || 20;
    this.speed = speed || 10;
    this.rotation = 0;
}

Player.prototype.draw = function (context) {
    context.save();
    context.translate(this.pos[0] + this.radius, this.pos[1] + this.radius);
    context.rotate(this.rotation);
    context.drawImage(
        resources.get('img/smile.png'), 0, 0,
        this.radius * 2, this.radius * 2,
        -this.radius, -this.radius,
        this.radius * 2, this.radius * 2
    );
    context.restore();
};

Player.prototype.update = function () {
    var opposite = MousePosition.y - this.pos[1];
    var adjacent = MousePosition.x - this.pos[0];
    this.rotation = Math.atan2(opposite, adjacent);
    this.rotation += Math.atan2(1, 0);
};

function Enemy(pos, radius, speed) {
    this.pos = pos;
    this.radius = radius || 20;
    this.speed = speed || 10;
    this.rotation = 0;
}

Enemy.prototype.draw = function (context) {
    context.save();
    context.translate(this.pos[0] + this.radius, this.pos[1] + this.radius);
    context.rotate(this.rotation);
    context.drawImage(
        resources.get('img/smile.png'), 0, 0,
        this.radius * 2, this.radius * 2,
        -this.radius, -this.radius,
        this.radius * 2, this.radius * 2
    );
    context.restore();
};

Enemy.prototype.update = function () {
    var opposite = player.pos[1] + player.radius - this.pos[1];
    var adjacent = player.pos[0] + player.radius - this.pos[0];
    this.rotation = Math.atan2(opposite, adjacent);
    this.rotation += Math.atan2(1, 0);

    // расчет направления движения в сторону игрока
    var x = player.pos[0] + player.radius;
    var y = player.pos[1] + player.radius;
    var vector = [this.pos[0] - x , this.pos[1] - y];
    var distance = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    var velocity = [vector[0] / distance, vector[1] / distance];

    this.pos[0] -= velocity[0];
    this.pos[1] -= velocity[1];
};

Enemy.prototype.die = function () {

};

function Bullet(pos, radius, vector, velocity) {
    this.pos = pos;
    this.radius = radius;
    this.vector = vector;
    this.velocity = [this.vector[0] * velocity, this.vector[1] * velocity];
}

Bullet.prototype.draw = function (context) {
    var x = this.pos[0] + this.radius;
    var y = this.pos[1] + this.radius;
    context.beginPath();
    context.arc(x, y, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = "red";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "#993399";
    context.stroke();
};

Bullet.prototype.update = function () {
    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];
};

var player = undefined;
var lastFire = Date.now();
var lastEnemyAdded = Date.now();
var timeBetweenEnemyAdded = 1000;
var bullets = [];
var enemies = [];
var gameScore = 0;
var isGameOver = false;

Sound.load('sound/cg1.wav', 'gun');
Sound.load('sound/zombie1.wav', 'zombie1');
Sound.load('sound/zombie2.wav', 'zombie2');

resources.load('img/smile.png');
resources.load('img/terrain.png');
resources.onReady(start);

function start() {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 400;

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
    context.fillStyle = "blue";
    context.fillRect(0, 0, canvas.width, canvas.height);


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

    addRandomEnemy();

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

    if (input.isDown('SPACE') && Date.now() - lastFire > 100) {
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

    if (timeBetweenEnemyAdded > 500) {
        timeBetweenEnemyAdded *= 0.95;
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

    bullets = [];
    enemies = [];

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