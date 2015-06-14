function Vector2 (x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector2.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;

    return this;
};

Vector2.prototype.addScalar = function(scalar) {
    this.x += scalar;
    this.y += scalar;

    return this;
};

Vector2.prototype.sum = function (vector) {
    var sum = this.clone();
    return sum.add(vector);
};

Vector2.prototype.sumScalar = function (scalar) {
    var sum = this.clone();
    return sum.addScalar(scalar);
};

Vector2.prototype.subtract = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
};

Vector2.prototype.subtractScalar = function(scalar) {
    this.x -= scalar;
    this.y -= scalar;

    return this;
};

Vector2.prototype.diff = function(vector) {
    var diff = this.clone();
    return diff.subtract(vector);
};

Vector2.prototype.diffScalar = function(scalar) {
    var diff = this.clone();
    return diff.diffScalar(scalar);
};

Vector2.prototype.multiply = function(vector) {
    this.x *= vector.x;
    this.y *= vector.y;

    return this;
};

Vector2.prototype.multiplyScalar = function (scalar) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
};

Vector2.prototype.multiplication = function(vector) {
    var mult = this.clone();
    return mult.multiply(vector);
};

Vector2.prototype.multiplicationScalar = function(scalar) {
    var mult = this.clone();
    return mult.multiplyScalar(scalar);
};

Vector2.prototype.clone = function () {
    return new Vector2(this.x, this.y);
};

Vector2.prototype.distance = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector2.prototype.distanceTo = function(vector) {
    var diff = this.diff(vector);
    return diff.distance();
};

Vector2.prototype.normalize = function () {
    var distance = this.distance();
    this.x /= distance;
    this.y /= distance;

    return this;
};