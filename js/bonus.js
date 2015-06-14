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

function BonusManager() {
    this.bonuses = [];
}

BonusManager.prototype.add = function(bonus) {
    this.bonuses.push(bonus);
};

BonusManager.prototype.isTimeToBonus = function() {
    return Math.random() < 0.002;
};

BonusManager.prototype.update = function(world) {
    if (this.bonuses.length == 0) {
        return false;
    }

    if (!this.bonuses[0].isApplied()) {
        this.bonuses[0].applyTo(world.player);
    } else if (this.bonuses[0].isOutdated()) {
        this.bonuses[0].disable();
        this.bonuses.splice(0, 1);
    }
};

BonusManager.prototype.getRandomBonus = function() {
    var x = getRandomInt(0, Game.size.x);
    var y = getRandomInt(0, Game.size.y);
    var bonusPos = new Vector2(x, y);
    return new Bonus(bonusPos);
};

BonusManager.prototype.reset = function() {
    if (this.bonuses.length == 0) {
        return true;
    }

    if (this.bonuses[0].isApplied()) {
        this.bonuses[0].disable();
    }

    this.bonuses = [];
};