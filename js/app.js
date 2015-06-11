MousePosition = {x: 0, y: 0};

Sound.load('sound/cg1.wav', 'gun');
Sound.load('sound/zombie1.wav', 'zombie1');
Sound.load('sound/zombie2.wav', 'zombie2');

resources.load('img/smile.png');
resources.load('img/terrain.png');
console.log(Game);
resources.onReady(function() {
    Game.start('gameCanvas', 800, 600);
});

document.addEventListener('mousemove', function (event) {
    var rect = Game.canvas.getBoundingClientRect();
    MousePosition.x = Math.round(event.pageX - rect.left);
    MousePosition.y = Math.round(event.pageY - rect.top);
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
