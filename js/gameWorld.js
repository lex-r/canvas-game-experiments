function GameWorld(context) {
    this.context = context;
    this.terrainPattern = this.context.createPattern(resources.get('img/terrain.png'), 'repeat');
    this.player = new Player([Game.size.x / 2 - 10, Game.size.y / 2 - 10]);
    this.bullets = [];
    this.enemies = [];
    this.bonuses = [];
    this.gameScore = 0;
    this.isGameOver = false;
    this.lastFire = Date.now();
    this.lastEnemyAdded = Date.now();
    this.timeBetweenEnemyAdded = 1000;
    this.timeBetweenFire = 100;
    this.bonusTimer = undefined;
}

GameWorld.prototype.update = function() {
    if (!this.isGameOver) {
        this.handleInput();
        this.player.update();

        for (var i = 0; i < this.bonuses.length; i++) {
            if (this.bonuses[i].isOutdated()) {
                this.bonuses.splice(i, 1);
            }
        }

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
        }

        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update();
        }

        this.checkCollision();
        this.addRandomEnemy();
        this.addRandomBonus();
    }
};

GameWorld.prototype.draw = function() {
    this.context.fillStyle = this.terrainPattern;
    this.context.fillRect(0, 0, Game.size.x, Game.size.y);

    document.getElementById('score').innerHTML = this.gameScore;

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

GameWorld.prototype.checkCollision = function() {
    if (this.player.pos[0] < 0) {
        this.player.pos[0] = 0;
    } else if (this.player.pos[0] + this.player.radius * 2 >= Game.size.x) {
        this.player.pos[0] = Game.size.x - this.player.radius * 2;
    }

    if (this.player.pos[1] < 0) {
        this.player.pos[1] = 0;
    } else if (this.player.pos[1] + this.player.radius * 2 >= Game.size.y) {
        this.player.pos[1] = Game.size.y - this.player.radius * 2;
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
                this.addScore(1);
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

GameWorld.prototype.handleInput = function() {
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

GameWorld.prototype.addRandomEnemy = function() {
    if (Date.now() - this.lastEnemyAdded < this.timeBetweenEnemyAdded) {
        return false;
    }

    // выбор стороны, где появится враг
    var rand = Math.random();

    var x, y;

    if (rand < 0.25) { // left
        x = -20;
        y = getRandomInt(0, Game.size.y);
    } else if (rand < 0.5) { // right
        x = Game.size.x + 20;
        y = getRandomInt(0, Game.size.y);
    } else if (rand < 0.75) { // top
        x = getRandomInt(0, Game.size.x);
        y = -20;
    } else { // bottom
        x = getRandomInt(0, Game.size.x);
        y = Game.size.y + 20;
    }

    this.enemies.push(new Enemy([x, y], 20, 2));

    this.lastEnemyAdded = Date.now();

    if (this.timeBetweenEnemyAdded > 100) {
        this.timeBetweenEnemyAdded *= 0.97;
    }
};

GameWorld.prototype.addRandomBonus = function() {
    if (Math.random() < 0.002) {
        var x = getRandomInt(0, Game.size.x);
        var y = getRandomInt(0, Game.size.y);
        this.bonuses.push(new Bonus([x, y]));
    }
};

GameWorld.prototype.checkWorldOut = function(pos, radius) {
    if (pos[0] < 0) {
        return true;
    } else if (pos[0] + radius * 2 > Game.size.x) {
        return true;
    }

    if (pos[1] < 0) {
        return true;
    } else if (pos[1] + radius * 2 > Game.size.y) {
        return true;
    }

    return false;
};

GameWorld.prototype.checkRoundCollides = function(pos1, radius1, pos2, radius2) {
    var center1 = [pos1[0] + radius1, pos1[1] + radius1];
    var center2 = [pos2[0] + radius2, pos2[1] + radius2];
    var dist = [Math.abs(center1[0] - center2[0]), Math.abs(center1[1] - center2[1])];
    var length = Math.sqrt(dist[0] * dist[0] + dist[1] * dist[1]);

    if (length < radius1 + radius2) {
        return true;
    }

    return false;
};

GameWorld.prototype.addScore = function(score) {
    this.gameScore += score;
};

GameWorld.prototype.reset = function() {
    this.player.pos = [Game.size.x / 2 - 10, Game.size.y / 2 - 10];
    this.bullets = [];
    this.enemies = [];
    this.bonuses = [];

    this.lastFire = Date.now();
    this.lastEnemyAdded = Date.now();
    this.timeBetweenEnemyAdded = 1000;
    this.timeBetweenFire = 100;
    this.gameScore = 0;
    this.isGameOver = false;

    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';

    clearTimeout(this.bonusTimer);
};

GameWorld.prototype.gameOver = function() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    this.isGameOver = true;
};
