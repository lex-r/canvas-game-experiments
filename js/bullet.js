function Bullet(pos, radius, damage, direction, velocity) {
    this.pos = pos;
    this.radius = radius;
    this.damage = damage;
    this.direction = direction;
    this.velocity = this.direction.multiplicationScalar(velocity);
}

Bullet.prototype.draw = function (context) {
    var x = this.pos.x + this.radius;
    var y = this.pos.y + this.radius;
    context.beginPath();
    context.arc(x, y, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = "red";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "#993399";
    context.stroke();
};

Bullet.prototype.update = function () {
    this.pos.add(this.velocity);
};
