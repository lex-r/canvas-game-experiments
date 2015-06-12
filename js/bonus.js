function Bonus(pos) {
    this.pos = pos;
    this.radius = 10;
    this.addedAt = Date.now();
}

Bonus.prototype.draw = function (context) {
    var x = this.pos[0] + this.radius,
        y = this.pos[1] + this.radius;

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
    Game.world.timeBetweenFire = 40;

    if (Game.world.bonusTimer != undefined) {
        clearTimeout(Game.world.bonusTimer);
    }

    Game.world.bonusTimer = setTimeout(function() {
        Game.world.timeBetweenFire = 100;
    }, 10000);
};
