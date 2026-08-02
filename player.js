const audio = document.getElementById("liveAudio");
const playBtn = document.getElementById("playBtn");

let currentFile = "";

// Load the current audio
async function loadAudio() {
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/donshangti2/KULZZY-AUTO-PLAYER/main/current.txt?" + Date.now()
        );

        currentFile = (await response.text()).trim();

        audio.src =
            "https://raw.githubusercontent.com/donshangti2/KULZZY-AUTO-PLAYER/main/" +
            encodeURIComponent(currentFile) +
            "?" +
            Date.now();

        console.log("Loaded:", currentFile);

    } catch (e) {
        console.error(e);
    }
}

loadAudio();

playBtn.onclick = async function () {

    if (audio.paused) {

        try {

            await audio.play();

            playBtn.innerHTML = "❚❚";

        } catch (err) {

            alert(err.message);

        }

    } else {

        audio.pause();

        playBtn.innerHTML = "▶";

    }

};

audio.onended = function () {
    playBtn.innerHTML = "▶";
};
