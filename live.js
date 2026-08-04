const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const audio = document.getElementById("audio");

let stream = null;

startBtn.onclick = async () => {

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        audio.srcObject = stream;

        alert("🎙 Microphone connected successfully!");

    } catch (e) {

        alert("Microphone access denied.");

    }

};

stopBtn.onclick = () => {

    if (stream) {

        stream.getTracks().forEach(track => track.stop());

        audio.srcObject = null;

        alert("⛔ Live stopped.");

    }

};
