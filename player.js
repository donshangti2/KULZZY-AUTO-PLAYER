const audio = document.getElementById("liveAudio");
const playBtn = document.getElementById("playBtn");
const title = document.querySelector(".title");
const nowPlaying = document.querySelector(".nowPlaying");

let playlist = [];
let currentIndex = 0;
let currentAudio = "";
let playlistMode = false;

async function loadConfig() {

    try {

        const response = await fetch("config.json?t=" + Date.now());
        const config = await response.json();
        title.textContent = config.title;
        nowPlaying.innerHTML =
            "🎵 NOW PLAYING<br><b>" + config.nowPlaying + "</b>";

        audio.volume = config.volume || 1;

        playlistMode = config.playlistMode || false;
        playlist = config.playlist || [];

        if (playlistMode) {

            if (playlist.length > 0 && currentAudio === "") {

                currentIndex = 0;
                currentAudio = playlist[currentIndex];

                audio.src = currentAudio + "?t=" + Date.now();
                audio.load();

            }

        } else {

            if (config.currentAudio !== currentAudio) {

                currentAudio = config.currentAudio;

                audio.src = currentAudio + "?t=" + Date.now();
                audio.load();

            }

        }

    } catch (e) {

        console.log(e);

    }

    setTimeout(loadConfig, 1000);

}

audio.onended = function () {

    if (!playlistMode) return;

    currentIndex++;

    if (currentIndex >= playlist.length) {

        currentIndex = 0;

    }

    currentAudio = playlist[currentIndex];

    audio.src = currentAudio + "?t=" + Date.now();

    audio.play();

};

playBtn.onclick = async function () {

    if (audio.paused) {

        try {

            await audio.play();
            playBtn.innerHTML = "❚❚";

        } catch (e) {

            alert(e.message);

        }

    } else {

        audio.pause();
        playBtn.innerHTML = "▶";

    }

};

loadConfig();
