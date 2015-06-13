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
    var x = this.player.pos[0] + this.player.radius;
    var y = this.player.pos[1] + this.player.radius;
    var vector = [MousePosition.x - x , MousePosition.y - y];
    var distance = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    var normalizedVector = [vector[0] / distance, vector[1] / distance];
    var bullet = new Bullet([x, y], 5, this.damage, normalizedVector, 15);
    Game.world.bullets.push(bullet);
    Sound.play('gun');
};
