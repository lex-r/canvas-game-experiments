
var canvas;
var context;

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
var bullets = [];
var enemies = [];

resources.load('img/smile.png');
resources.onReady(start);

function start() {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d")
    canvas.width = 600;
    canvas.height = 400;

    document.body.appendChild(canvas);

    player = new Player([0,0]);

    enemies.push(new Player([200,200]));
    enemies.push(new Player([240,240]));
    enemies.push(new Player([300,240]));
    enemies.push(new Player([400,140]));
    enemies.push(new Player([120,140]));
    enemies.push(new Player([100,50]));

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
    handleInput();
    checkCollision();
    var opposite = MousePosition.y - player.pos[1];
    var adjacent = MousePosition.x - player.pos[0];
    player.rotation = Math.atan2(opposite, adjacent);
    player.rotation += Math.atan2(1, 0);

    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        bullet.update();
    }
}

function draw() {
    player.draw(context);
    for (var i = 0; i< bullets.length; i++) {
        bullets[i].draw(context);
    }

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw(context);
    }
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
                break;
            }
        }
    }

}

function checkRoundCollides(pos1, radius1, pos2, radius2) {
    var dist = [Math.abs(pos1[0] - pos2[0]), Math.abs(pos1[1] - pos2[1])];
    var length = Math.sqrt(dist[0] * dist[0] + dist[1] * dist[1]);

    if (length < radius1 + radius2) {
        return true;
    }

    return false;
}

function checkWorldOut(pos, radius) {
    if (pos[0] - radius < 0) {
        return true;
    } else if (pos[0] + radius >= canvas.width) {
        return true;
    }

    if (pos[1] - radius < 0) {
        return true;
    } else if (pos[1] + radius > canvas.height) {
        return true;
    }

    return false;
}