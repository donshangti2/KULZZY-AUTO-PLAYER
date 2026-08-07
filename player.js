const audio = document.getElementById("liveAudio");
const playBtn = document.getElementById("playBtn");
const title = document.querySelector(".title");
const nowPlaying = document.querySelector(".nowPlaying");

let currentAudio = "";

async function loadConfig(){

try{

const response=await fetch(
"config.json?t="+Date.now()
);

const config=await response.json();

title.textContent=config.title;

nowPlaying.innerHTML=
"🎵 NOW PLAYING<br><b>"+
config.nowPlaying+
"</b>";

audio.volume=config.volume||1;

if(config.currentAudio!==currentAudio){

currentAudio=config.currentAudio;

const wasPlaying=!audio.paused;

audio.src=currentAudio+"?t="+Date.now();

audio.load();

await audio.play();

playBtn.innerHTML="❚❚";

}

}

}catch(error){

console.log(error);

}

setTimeout(loadConfig,200);

}
audio.onended=function(){

playBtn.innerHTML="▶";

};

playBtn.onclick=async function(){

if(audio.paused){

try{

await audio.play();

playBtn.innerHTML="❚❚";

}catch(error){

alert(error.message);

}

}else{

audio.pause();

playBtn.innerHTML="▶";

}

};

audio.onplay=function(){

playBtn.innerHTML="❚❚";

};

audio.onpause=function(){

playBtn.innerHTML="▶";

};

audio.onerror=function(){

console.log("Audio failed to load.");

};

loadConfig();
