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

document.getElementById("updateNowPlaying").onclick = () => {

    const text =
    document.getElementById("studioNowPlaying").value;

    if(text.trim()==""){

        alert("Enter Now Playing text.");

        return;

    }

    localStorage.setItem("kulzzyNowPlaying",text);

    alert("Now Playing Updated!");

};
const cart = new Audio();

document.getElementById("jingle1").onclick = () => {

    cart.src = "jingles/birthday.mp3";
    cart.play();

};

document.getElementById("jingle2").onclick = () => {

    cart.src = "jingles/business.mp3";
    cart.play();

};

document.getElementById("jingle3").onclick = () => {

    cart.src = "jingles/stationid.mp3";
    cart.play();

};
