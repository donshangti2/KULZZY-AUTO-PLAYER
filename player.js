const audio = document.getElementById("liveAudio");
const playBtn = document.getElementById("playBtn");
const title = document.querySelector(".title");
const nowPlaying = document.querySelector(".nowPlaying");

let currentAudio = "";
let playlist = [];
let currentIndex = 0;
let playlistMode = false;
async function loadConfig() {

    try {

        const response = await fetch(
            "config.json?t=" + Date.now()
        );

        const config = await response.json();
        playlistMode = config.playlistMode || false;

playlist = config.playlist || [];

        title.textContent = config.title;

        nowPlaying.innerHTML =
            "🎵 NOW PLAYING<br><b>" +
            config.nowPlaying +
            "</b>";

        audio.volume = config.volume;

        if (config.currentAudio !== currentAudio) {

    const wasPlaying = !audio.paused;

    if (wasPlaying) {

        audio.style.opacity = "0.5";

    }

    currentAudio = config.currentAudio;

    audio.src = currentAudio + "?t=" + Date.now();

    audio.load();

    audio.oncanplay = async () => {

        audio.volume = config.volume;

        if (wasPlaying) {

            await audio.play();

        }

        audio.style.opacity = "1";

    };

}

        setTimeout(loadConfig, 1000);

    } catch (e) {

        console.log(e);

        setTimeout(loadConfig, 1000);

    }

}

loadConfig();

playBtn.onclick = async () => {

    if (audio.paused) {

        try {

            await audio.play();

            playBtn.innerHTML = "❚❚";

        } catch {

            alert("Unable to play audio.");

        }

    } else {

        audio.pause();

        playBtn.innerHTML = "▶";

    }

};
