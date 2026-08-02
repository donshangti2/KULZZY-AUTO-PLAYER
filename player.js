const audio = document.getElementById("liveAudio");
const playBtn = document.getElementById("playBtn");
const title = document.querySelector(".title");

let currentAudio = "";

async function loadConfig() {
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/donshangti2/KULZZY-AUTO-PLAYER/main/config.json?t=" + Date.now()
        );

        const config = await response.json();

        title.textContent = config.title;
        audio.volume = config.volume;

        if (config.currentAudio !== currentAudio) {

            currentAudio = config.currentAudio;

            const wasPlaying = !audio.paused;

            audio.src =
                "https://donshangti2.github.io/KULZZY-AUTO-PLAYER/" +
                encodeURIComponent(currentAudio) +
                "?t=" + Date.now();

            audio.load();

            if (wasPlaying) {
                await audio.play();
            }
        }

        setTimeout(loadConfig, config.refresh * 1000);

    } catch (err) {
        console.error(err);
        setTimeout(loadConfig, 5000);
    }
}

loadConfig();

playBtn.onclick = async function () {

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
