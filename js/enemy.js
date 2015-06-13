function Enemy(pos, radius, speed) {
    this.pos = pos;
    this.radius = radius || 20;
    this.speed = speed || 10;
    this.rotation = 0;
    this.health = 1;
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
    var opposite = Game.world.player.pos[1] + Game.world.player.radius - this.pos[1];
    var adjacent = Game.world.player.pos[0] + Game.world.player.radius - this.pos[0];
    this.rotation = Math.atan2(opposite, adjacent);
    this.rotation += Math.atan2(1, 0);

    // расчет направления движения в сторону игрока
    var x = Game.world.player.pos[0] + Game.world.player.radius;
    var y = Game.world.player.pos[1] + Game.world.player.radius;
    var vector = [this.pos[0] - x , this.pos[1] - y];
    var distance = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    var velocity = [vector[0] / distance, vector[1] / distance];

    this.pos[0] -= velocity[0];
    this.pos[1] -= velocity[1];
};

Enemy.prototype.bump = function(damage) {
    this.health -= damage;
};

Enemy.prototype.isDead = function() {
    return this.health <= 0;
};
