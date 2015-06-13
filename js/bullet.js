function Bullet(pos, radius, damage, vector, velocity) {
    this.pos = pos;
    this.radius = radius;
    this.damage = damage;
    this.vector = vector;
    this.velocity = [this.vector[0] * velocity, this.vector[1] * velocity];
}

Bullet.prototype.draw = function (context) {
    var x = this.pos[0] + this.radius;
    var y = this.pos[1] + this.radius;
    context.beginPath();
    context.arc(x, y, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = "red";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "#993399";
    context.stroke();
};

Bullet.prototype.update = function () {
    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];
};
