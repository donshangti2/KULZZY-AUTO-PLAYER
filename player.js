const audio = document.getElementById("liveAudio");
const playBtn = document.getElementById("playBtn");

let started = false;

// Read current.txt from GitHub
async function loadAudio() {
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/donshangti2/KULZZY-AUTO-PLAYER/main/current.txt?t=" + Date.now()
        );

        const filename = (await response.text()).trim();

        audio.src =
            "https://raw.githubusercontent.com/donshangti2/KULZZY-AUTO-PLAYER/main/" +
            encodeURIComponent(filename) +
            "?t=" +
            Date.now();

        audio.load();

    } catch (err) {
        console.log("Error loading audio:", err);
    }
}

// Load the current audio
loadAudio();

// Play / Pause button
playBtn.onclick = async function () {
    if (audio.paused) {
        try {
            await audio.play();
            started = true;
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
