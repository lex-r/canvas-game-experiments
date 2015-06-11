function GameClass() {
    this.canvas = undefined;
    this.context = undefined;
    this.terrainPattern = undefined;
    this.player = undefined;
    this.lastFire = Date.now();
    this.lastEnemyAdded = Date.now();
    this.timeBetweenEnemyAdded = 1000;
    this.timeBetweenFire = 100;
    this.bullets = [];
    this.enemies = [];
    this.bonuses = [];
    this.gameScore = 0;
    this.isGameOver = false;
    this.bonusTimer = undefined;
}

GameClass.prototype.start = function() {
    var self = this;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = 800;
    this.canvas.height = 600;
    document.onselectstart = function() { return false; };

    this.terrainPattern = this.context.createPattern(resources.get('img/terrain.png'), 'repeat');

    document.body.appendChild(this.canvas);

    this.player = new Player([this.canvas.width / 2 - 10, this.canvas.height / 2 - 10]);

    document.getElementById('play-again').addEventListener('click', function() {
        self.resetGame();
    });

    this.setScore(0);
    this.mainLoop();
};

GameClass.prototype.mainLoop = function() {
    var self = this;
    this.update();
    this.draw();

    requestAnimationFrame(function() {
        self.mainLoop();
    });
};

GameClass.prototype.update = function() {

    if (this.isGameOver) {
        return false;
    }

    this.handleInput();
    this.checkCollision();

    this.player.update();

    for (var i = 0; i < this.bonuses.length; i++) {
        if (this.bonuses[i].isOutdated()) {
            this.bonuses.splice(i, 1);
        }
    }

    this.addRandomEnemy();
    this.addRandomBonus();

    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].update();
    }

    for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].update();
    }
};

GameClass.prototype.draw = function() {
    this.context.fillStyle = this.terrainPattern;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.draw(this.context);
    for (var i = 0; i< this.bullets.length; i++) {
        this.bullets[i].draw(this.context);
    }

    for (var i = 0; i < this.enemies.length; i++) {
        this.enemies[i].draw(this.context);
    }

    for (var i = 0; i < this.bonuses.length; i++) {
        this.bonuses[i].draw(this.context);
    }
};

GameClass.prototype.setScore = function(score) {
    this.gameScore = score;
    document.getElementById('score').innerHTML = this.gameScore;
};

GameClass.prototype.handleInput = function() {
    if (input.isDown('DOWN') || input.isDown('s')) {
        this.player.pos[1] += this.player.speed;
    }

    if (input.isDown('UP') || input.isDown('w')) {
        this.player.pos[1] -= this.player.speed;
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        this.player.pos[0] -= this.player.speed;
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        this.player.pos[0] += this.player.speed;
    }

    if ((input.isMouseDown() || input.isDown('SPACE')) && Date.now() - this.lastFire > this.timeBetweenFire) {
        this.lastFire = Date.now();
        var x = this.player.pos[0] + this.player.radius;
        var y = this.player.pos[1] + this.player.radius;
        var vector = [MousePosition.x - x , MousePosition.y - y];
        var distance = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        var normalizedVector = [vector[0] / distance, vector[1] / distance];
        var bullet = new Bullet([x, y], 5, normalizedVector, 15);
        this.bullets.push(bullet);
        Sound.play('gun');
    }
};

GameClass.prototype.addRandomBonus = function() {
    if (Math.random() < 0.002) {
        var x = getRandomInt(0, this.canvas.width);
        var y = getRandomInt(0, this.canvas.height);
        this.bonuses.push(new Bonus([x, y]));
    }
};

GameClass.prototype.addRandomEnemy = function() {
    if (Date.now() - this.lastEnemyAdded < this.timeBetweenEnemyAdded) {
        return false;
    }

    // выбор стороны, где появится враг
    var rand = Math.random();

    var x, y;

    if (rand < 0.25) { // left
        x = -20;
        y = getRandomInt(0, this.canvas.height);
    } else if (rand < 0.5) { // right
        x = this.canvas.width + 20;
        y = getRandomInt(0, this.canvas.height);
    } else if (rand < 0.75) { // top
        x = getRandomInt(0, this.canvas.width);
        y = -20;
    } else { // bottom
        x = getRandomInt(0, this.canvas.width);
        y = this.canvas.height + 20;
    }

    this.enemies.push(new Enemy([x, y], 20, 2));

    this.lastEnemyAdded = Date.now();

    if (this.timeBetweenEnemyAdded > 100) {
        this.timeBetweenEnemyAdded *= 0.97;
    }
};

GameClass.prototype.checkCollision = function() {
    if (this.player.pos[0] < 0) {
        this.player.pos[0] = 0;
    } else if (this.player.pos[0] + this.player.radius * 2 >= this.canvas.width) {
        this.player.pos[0] = this.canvas.width - this.player.radius * 2;
    }

    if (this.player.pos[1] < 0) {
        this.player.pos[1] = 0;
    } else if (this.player.pos[1] + this.player.radius * 2 >= this.canvas.height) {
        this.player.pos[1] = this.canvas.height - this.player.radius * 2;
    }

    for (var i = 0; i < this.bullets.length; i++) {
        if (this.checkWorldOut(this.bullets[i].pos, this.bullets[i].radius)) {
            this.bullets.splice(i, 1);
            i++;
        }
    }

    for (var i = 0; i < this.enemies.length; i++) {
        var pos = this.enemies[i].pos;
        var radius = this.enemies[i].radius;

        for (var j = 0; j < this.bullets.length; j++) {
            var bpos = this.bullets[j].pos;
            var bradius = this.bullets[j].radius;

            if (this.checkRoundCollides(pos, radius, bpos, bradius)) {
                this.enemies.splice(i, 1);
                this.bullets.splice(j, 1);
                i++;
                this.setScore(this.gameScore + 1);
                if (Math.random() < 0.5) {
                    Sound.play('zombie1');
                } else {
                    Sound.play('zombie2');
                }
                break;
            }
        }
    }

    for (var i = 0; i < this.bonuses.length; i++) {
        var bonus = this.bonuses[i];
        if (this.checkRoundCollides(this.player.pos, this.player.radius, bonus.pos, bonus.radius)) {
            bonus.applyTo(this.player);
            this.bonuses.splice(i, 1);
            i++;
        }
    }

    for (var i = 0; i < this.enemies.length; i++) {
        var enemy = this.enemies[i];
        if (this.checkRoundCollides(enemy.pos, enemy.radius, this.player.pos, this.player.radius)) {
            this.gameOver();
        }
    }
};

GameClass.prototype.checkRoundCollides = function(pos1, radius1, pos2, radius2) {
    var center1 = [pos1[0] + radius1, pos1[1] + radius1];
    var center2 = [pos2[0] + radius2, pos2[1] + radius2];
    var dist = [Math.abs(center1[0] - center2[0]), Math.abs(center1[1] - center2[1])];
    var length = Math.sqrt(dist[0] * dist[0] + dist[1] * dist[1]);

    if (length < radius1 + radius2) {
        return true;
    }

    return false;
};

GameClass.prototype.checkWorldOut = function(pos, radius) {
    if (pos[0] < 0) {
        return true;
    } else if (pos[0] + radius * 2 > this.canvas.width) {
        return true;
    }

    if (pos[1] < 0) {
        return true;
    } else if (pos[1] + radius * 2 > this.canvas.height) {
        return true;
    }

    return false;
};

GameClass.prototype.gameOver = function() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    this.isGameOver = true;
};

GameClass.prototype.resetGame = function() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    this.isGameOver = false;
    clearTimeout(this.bonusTimer);
    this.timeBetweenFire = 100;

    this.bullets = [];
    this.enemies = [];
    this.bonuses = [];

    this.setScore(0);
    this.timeBetweenEnemyAdded = 1000;

    this.player.pos = [this.canvas.width / 2 + this.player.radius, this.canvas.height / 2 + this.player.radius];
};

var Game = new GameClass();
