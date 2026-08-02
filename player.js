const audio = document.getElementById("liveAudio");
const playBtn = document.getElementById("playBtn");
const title = document.querySelector(".title");

let currentAudio = "";

// Load configuration
async function loadConfig() {
    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/donshangti2/KULZZY-AUTO-PLAYER/main/config.json?t=" + Date.now()
        );

        const config = await response.json();

        // Update title
        title.textContent = config.title;

        // Set volume
        audio.volume = config.volume;

        // Switch audio only if it changed
        if (config.currentAudio !== currentAudio) {
            currentAudio = config.currentAudio;

            const wasPlaying = !audio.paused;

            audio.src =
                "https://raw.githubusercontent.com/donshangti2/KULZZY-AUTO-PLAYER/main/" +
                encodeURIComponent(currentAudio) +
                "?t=" + Date.now();

            audio.load();

            if (wasPlaying) {
                audio.play().catch(console.error);
                playBtn.innerHTML = "❚❚";
            }
        }

        // Check again after the configured number of seconds
        clearTimeout(window.playerRefreshTimer);
        window.playerRefreshTimer = setTimeout(loadConfig, config.refresh * 1000);

    } catch (err) {
        console.error("Config error:", err);

        // Retry after 5 seconds if something goes wrong
        clearTimeout(window.playerRefreshTimer);
        window.playerRefreshTimer = setTimeout(loadConfig, 5000);
    }
}

// Initial load
loadConfig();

// Play / Pause
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
