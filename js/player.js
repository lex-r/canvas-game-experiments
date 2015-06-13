function Player(pos, radius, speed) {
    this.pos = pos;
    this.radius = radius || 20;
    this.speed = speed || 4;
    this.rotation = 0;
    this.bonuses = [];
    this.weapon = undefined;
}

Player.prototype.draw = function (context) {
    context.save();
    context.translate(this.pos[0] + this.radius, this.pos[1] + this.radius);
    context.rotate(this.rotation);
    context.drawImage(
        resources.get('img/smile.png'), 0, 0,
        this.radius * 2, this.radius * 2,
        -this.radius, -this.radius,
        this.radius * 2, this.radius * 2
    );
    context.restore();
};

Player.prototype.update = function () {

    this.handleInput();

    var opposite = MousePosition.y - this.pos[1];
    var adjacent = MousePosition.x - this.pos[0];
    this.rotation = Math.atan2(opposite, adjacent);
    this.rotation += Math.atan2(1, 0);
};

Player.prototype.handleInput = function() {
    if (input.isDown('DOWN') || input.isDown('s')) {
        this.pos[1] += this.speed;
    }

    if (input.isDown('UP') || input.isDown('w')) {
        this.pos[1] -= this.speed;
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        this.pos[0] -= this.speed;
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        this.pos[0] += this.speed;
    }

    if ((input.isMouseDown() || input.isDown('SPACE')) && this.weapon.isReadyToFire()) {
        this.weapon.fire();
    }
};
