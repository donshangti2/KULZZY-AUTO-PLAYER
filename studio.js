const status = document.getElementById("status");

const goLive = document.getElementById("goLive");
const stopLive = document.getElementById("stopLive");
const playlist = document.getElementById("playlist");

goLive.onclick = () => {

    status.innerHTML = "🔴 LIVE ON AIR";
    status.style.color = "#ff0000";

    localStorage.setItem("kulzzyMode","live");

    alert("Live Mode Activated");

};

stopLive.onclick = () => {

    status.innerHTML = "🟢 OFF AIR";
    status.style.color = "#00ff66";

    localStorage.setItem("kulzzyMode","off");

    alert("Live Stopped");

};

playlist.onclick = () => {

    status.innerHTML = "🎵 PLAYLIST MODE";
    status.style.color = "#FFD700";

    localStorage.setItem("kulzzyMode","playlist");

    alert("Playlist Mode Activated");

};

window.onload = () => {

    const mode = localStorage.getItem("kulzzyMode");

    if(mode === "live"){

        status.innerHTML = "🔴 LIVE ON AIR";
        status.style.color = "#ff0000";

    }else if(mode === "playlist"){

        status.innerHTML = "🎵 PLAYLIST MODE";
        status.style.color = "#FFD700";

    }else{

        status.innerHTML = "🟢 OFF AIR";
        status.style.color = "#00ff66";

    }

};
