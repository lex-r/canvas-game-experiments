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

    var bonusClasses = [
        BonusFrequencyFire,
        BonusWeaponDamage,
        BonusWeaponCaliber,
        BonusEnemySpeed
    ];

    var classNum = getRandomInt(0, bonusClasses.length - 1);

    return new bonusClasses[classNum](bonusPos);
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
