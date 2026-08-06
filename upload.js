const uploadBtn = document.getElementById("uploadBtn");
const status = document.getElementById("status");

uploadBtn.onclick = async () => {

const token = localStorage.getItem("githubToken");

if(!token){
alert("Please save your GitHub Token in Admin first.");
return;
}

const fileInput = document.getElementById("file");

if(fileInput.files.length===0){
alert("Please choose a file.");
return;
}

const file=fileInput.files[0];

const folder=document.getElementById("folder").value;

status.innerHTML="Uploading...";

const reader=new FileReader();

reader.onload=async function(){

const base64=reader.result.split(",")[1];

const url=`https://api.github.com/repos/donshangti2/KULZZY-AUTO-PLAYER/contents/${folder}/${file.name}`;

const response=await fetch(url,{
method:"PUT",
headers:{
Authorization:"Bearer "+token,
"Content-Type":"application/json"
},
body:JSON.stringify({
message:"Uploaded "+file.name,
content:base64
})
});

if(response.ok){

status.innerHTML="✅ Upload Successful";

}else{

const err=await response.json();

status.innerHTML="❌ "+err.message;

}

};

reader.readAsDataURL(file);

};
