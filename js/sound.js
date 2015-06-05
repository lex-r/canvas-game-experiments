Sound = {
    sounds: {},
    pools: {}
}

Sound.load = function(url, name) {
    var audio = new Audio();
    audio.src = url;
    audio.load();
    Sound.sounds[name] = url;
    Sound.pools[name] = [];
    Sound.pools[name].push(audio);

};

Sound.play = function(name) {
    var played = false;
    for (var i = 0; i < Sound.pools[name].length; i++) {
        if (Sound.pools[name][i].ended || Sound.pools[name][i].currentTime == 0/*Sound.pools[name][i].played.length == 0*/) {
            Sound.pools[name][i].play();
            played = true;
            break;
        }
    }

    if (played == false) {
        var clonedAudio = Sound.pools[name][0].cloneNode(true);
        Sound.pools[name].push(clonedAudio);
        Sound.pools[name][Sound.pools[name].length - 1].play();
    }
};
