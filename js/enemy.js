function Enemy(pos, radius, speed) {
    this.pos = pos;
    this.radius = radius || 20;
    this.speed = speed || 10;
    this.rotation = 0;
    this.health = 1;
}

Enemy.prototype.draw = function (context) {
    context.save();
    context.translate(this.pos.x + this.radius, this.pos.y + this.radius);
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
    var playerPosCenter = Game.world.player.posCenter();
    var direction = playerPosCenter.diff(this.pos);

    this.rotation = Math.atan2(direction.y, direction.x);
    this.rotation += Math.atan2(1, 0);

    // расчет направления движения в сторону игрока
    var distance = this.pos.diff(playerPosCenter);
    var velocity = distance.normalize();

    this.pos.subtract(velocity);
};

Enemy.prototype.bump = function(damage) {
    this.health -= damage;
};

Enemy.prototype.isDead = function() {
    return this.health <= 0;
};
