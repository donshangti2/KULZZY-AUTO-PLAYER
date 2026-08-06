const uploadBtn = document.getElementById("uploadBtn");
const status = document.getElementById("status");
const progressBar = document.getElementById("progressBar");

uploadBtn.onclick = async function () {

const token = localStorage.getItem("githubToken");

if (!token) {
status.innerHTML = "❌ GitHub Token not found.";
return;
}

const fileInput = document.getElementById("file");

if (fileInput.files.length === 0) {
status.innerHTML = "❌ Please choose a file.";
return;
}

const file = fileInput.files[0];
const folder = document.getElementById("folder").value;

status.innerHTML = "Uploading...";
progressBar.style.width = "10%";

const reader = new FileReader();

reader.onload = async function () {

try {

progressBar.style.width = "40%";

const base64 = reader.result.split(",")[1];

const response = await fetch(
`https://api.github.com/repos/donshangti2/KULZZY-AUTO-PLAYER/contents/${folder}/${file.name}`,
{
method: "PUT",
headers: {
Authorization: "Bearer " + token,
"Content-Type": "application/json"
},
body: JSON.stringify({
message: "Upload " + file.name,
content: base64
})
}
);

if (response.ok) {

progressBar.style.width = "100%";
status.innerHTML = "✅ Upload Successful";

} else {

const err = await response.json();
progressBar.style.width = "0%";
status.innerHTML = "❌ " + err.message;

}

} catch (e) {

progressBar.style.width = "0%";
status.innerHTML = "❌ " + e.message;

}

};

reader.readAsDataURL(file);

};
