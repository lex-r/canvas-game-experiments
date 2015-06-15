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

function BonusFrequencyFire(pos) {
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

function BonusWeaponDamage(pos) {
    AbstractBonus.apply(this, arguments);
    this.color = "#3333cc";

    var oldWeaponDamage = 0;

    this.applyTo = function(player) {
        oldWeaponDamage = player.weapon.damage;
        player.weapon.damage *= 3;
        this.applied = true;
    };

    this.disable = function() {
        Game.world.player.weapon.damage = oldWeaponDamage;
    };
}

function BonusWeaponCaliber(pos) {
    AbstractBonus.apply(this, arguments);
    this.color = "#cccc33";

    var oldCaliber = 0;

    this.applyTo = function(player) {
        oldCaliber = player.weapon.caliber;
        player.weapon.caliber = Math.round(player.weapon.caliber * 1.5);
        this.applied = true;
    };

    this.disable = function() {
        Game.world.player.weapon.caliber = oldCaliber;
    };
}

function BonusEnemySpeed(pos) {
    AbstractBonus.apply(this, arguments);
    this.color = "#33cccc";

    var oldSpeedFactor = 1;

    this.applyTo = function(player) {
        oldSpeedFactor = Game.world.enemySpeedFactor;
        Game.world.enemySpeedFactor *= 0.5;
        this.applied = true;
    };

    this.disable = function() {
        Game.world.enemySpeedFactor = oldSpeedFactor;
    };
}