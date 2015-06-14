function Weapon(player, timeBetweenFire) {
    this.player = player;
    this.lastFire = Date.now();
    this.timeBetweenFire = timeBetweenFire || 100;
    this.damage = 1;
}

Weapon.prototype.isReadyToFire = function() {
    return this.lastFire + this.timeBetweenFire <= Date.now();
};

Weapon.prototype.fire = function() {
    this.lastFire = Date.now();
    var playerPosCenter = this.player.posCenter();
    var directionToPlayer = MousePosition.diff(playerPosCenter);
    var bulletDirection = directionToPlayer.normalize();

    var bullet = new Bullet(playerPosCenter, 5, this.damage, bulletDirection, 15);
    Game.world.bullets.push(bullet);
    Sound.play('gun');
};
