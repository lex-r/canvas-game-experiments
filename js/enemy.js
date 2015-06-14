function Enemy(pos, radius, direction, velocity) {
    this.pos = pos;
    this.radius = radius || 20;
    this.direction = direction;
    this.velocity = velocity || 1;
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
    this.direction = this.pos.diff(playerPosCenter);
    this.direction.normalize();

    this.rotation = Math.atan2(-this.direction.y, -this.direction.x);
    this.rotation += Math.atan2(1, 0);

    this.pos.subtract(this.direction.multiplicationScalar(this.velocity));
};

Enemy.prototype.bump = function(damage) {
    this.health -= damage;
};

Enemy.prototype.isDead = function() {
    return this.health <= 0;
};
