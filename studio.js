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
const cart = new Audio();

const carts = {
cart1:"jingles/birthday.mp3",
cart2:"jingles/business.mp3",
cart3:"jingles/stationid.mp3",
cart4:"jingles/news.mp3",
cart5:"jingles/breaking.mp3",
cart6:"jingles/sports.mp3",
cart7:"jingles/gospel.mp3",
cart8:"jingles/djdrop.mp3",
cart9:"jingles/advertbed.mp3",
cart10:"jingles/phonering.mp3",
cart11:"jingles/applause.mp3",
cart12:"jingles/airhorn.mp3"
};

Object.keys(carts).forEach(id=>{

document.getElementById(id).onclick=()=>{

cart.pause();

cart.currentTime=0;

cart.src=carts[id];

cart.play();

};

});
