function GameClass() {
    this.size    = {x: 0, y: 0};
    this.canvas  = undefined;
    this.context = undefined;
    this.world   = undefined;
}

GameClass.prototype.start = function(canvasName, x, y) {
    var self           = this;
    this.canvas        = document.getElementById(canvasName);
    this.context       = this.canvas.getContext("2d");
    this.canvas.width  = x;
    this.canvas.height = y;
    this.size.x        = x;
    this.size.y        = y;

    document.onselectstart = function() { return false; };

    document.body.appendChild(this.canvas);

    this.world = new GameWorld(this.context);

    document.getElementById('play-again').addEventListener('click', function() {
        self.world.reset();
    });

    this.mainLoop();
};

GameClass.prototype.mainLoop = function() {
    var self = this;

    this.world.update();
    this.world.draw();

    requestAnimationFrame(function() {
        self.mainLoop();
    });
};

var Game = new GameClass();
