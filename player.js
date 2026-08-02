const audio = document.getElementById("liveAudio");
const playBtn = document.getElementById("playBtn");
const title = document.querySelector(".title");
const nowPlaying = document.querySelector(".nowPlaying");

let currentAudio = "";
let refreshTime = 5;

async function loadConfig() {
    try {
        const response = await fetch("config.json?t=" + Date.now());
        const config = await response.json();

        title.textContent = config.title;
        refreshTime = config.refresh || 5;
        audio.volume = config.volume ?? 1;

        if (config.currentAudio !== currentAudio) {
            currentAudio = config.currentAudio;

            nowPlaying.textContent =
                "Now Playing: " + currentAudio.replace("audio/", "");

            const wasPlaying = !audio.paused;

            audio.src = currentAudio + "?t=" + Date.now();
            audio.load();

            if (wasPlaying) {
                await audio.play();
                playBtn.innerHTML = "❚❚";
            }
        }

    } catch (err) {
        console.error(err);
    }

    setTimeout(loadConfig, refreshTime * 1000);
}

playBtn.onclick = async () => {

    if (audio.paused) {

        try {
            await audio.play();
            playBtn.innerHTML = "❚❚";
        } catch (err) {
            alert("Unable to play audio.");
        }

    } else {

        audio.pause();
        playBtn.innerHTML = "▶";

    }

};

audio.onended = function () {
    playBtn.innerHTML = "▶";
};

audio.onerror = function () {
    console.log("Audio error... retrying...");
    setTimeout(() => {
        audio.load();
    }, 3000);
};

loadConfig();
