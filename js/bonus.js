function Bonus(pos) {
    this.pos = pos;
    this.radius = 10;
    this.addedAt = Date.now();
    this.applied = false;
}

Bonus.prototype.draw = function (context) {
    var x = this.pos.x + this.radius,
        y = this.pos.y + this.radius;

    context.beginPath();
    context.arc(x, y, this.radius, 0, Math.PI*2, true);
    context.fillStyle = "#33bb66";
    context.fill();
    context.closePath();
    context.fill();
};

Bonus.prototype.isOutdated = function () {
    if (Date.now() - this.addedAt > 10000) {
        return true;
    }

    return false;
};

Bonus.prototype.applyTo = function (player) {
    player.weapon.timeBetweenFire = 40;
    this.applied = true;
};

Bonus.prototype.disable = function() {
    Game.world.player.weapon.timeBetweenFire = 100;
};

Bonus.prototype.isApplied = function() {
    return this.applied;
};
