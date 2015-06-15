function AbstractBonus(pos) {
    this.pos = pos;
    this.radius = 10;
    this.addedAt = Date.now();
    this.applied = false;
    this.color = "#fff";

    this.draw = function (context) {
        var x = this.pos.x + this.radius,
            y = this.pos.y + this.radius;

        context.beginPath();
        context.arc(x, y, this.radius, 0, Math.PI*2, true);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
        context.fill();
    };

    this.isOutdated = function () {
        if (Date.now() - this.addedAt > 10000) {
            return true;
        }

        return false;
    };

    this.isApplied = function() {
        return this.applied;
    };

    this.applyTo = function(){};
    this.disable = function(){};
}

function BonusFrequesncyFire(pos) {
    AbstractBonus.apply(this, arguments);
    this.color = "#33bb66";

    this.applyTo = function (player) {
        player.weapon.timeBetweenFire = 40;
        this.applied = true;
    };

    this.disable = function() {
        Game.world.player.weapon.timeBetweenFire = 100;
    };
}
