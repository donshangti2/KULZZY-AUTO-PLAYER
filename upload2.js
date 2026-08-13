const uploadBtn = document.getElementById("uploadBtn");
const status = document.getElementById("status");
const progressBar = document.getElementById("progressBar");

const TOKEN_KEY = "KULZZY_RADIO_GITHUB_TOKEN";

const GITHUB_USERNAME = "donshangti2";
const REPOSITORY = "KULZZY-AUTO-PLAYER";


uploadBtn.onclick = async function () {

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {

        status.innerHTML =
            "❌ GitHub Token not found.<br>" +
            "<small>Open Kulzzy Radio Admin and save your GitHub token first.</small>";

        return;
    }


    const fileInput =
        document.getElementById("file");


    if (fileInput.files.length === 0) {

        status.innerHTML =
            "❌ Please choose a file.";

        return;
    }


    const file =
        fileInput.files[0];


    const folder =
        document.getElementById("folder").value;


    const filePath =
        folder + "/" + file.name;


    status.innerHTML =
        "Preparing upload...";


    progressBar.style.width =
        "10%";


    const reader =
        new FileReader();


    reader.onload =
        async function () {

            try {

                progressBar.style.width =
                    "25%";


                const base64 =
                    reader.result.split(",")[1];


                /*
                 * CHECK IF FILE ALREADY EXISTS
                 */

                status.innerHTML =
                    "Checking GitHub...";


                const checkURL =
                    "https://api.github.com/repos/" +
                    GITHUB_USERNAME +
                    "/" +
                    REPOSITORY +
                    "/contents/" +
                    encodeURIComponent(folder) +
                    "/" +
                    encodeURIComponent(file.name);


                const checkResponse =
                    await fetch(
                        checkURL,
                        {
                            method: "GET",

                            headers: {

                                "Authorization":
                                    "Bearer " + token,

                                "Accept":
                                    "application/vnd.github+json"

                            },

                            cache:
                                "no-store"

                        }
                    );


                let existingSHA =
                    null;


                if (checkResponse.ok) {

                    const existingFile =
                        await checkResponse.json();

                    existingSHA =
                        existingFile.sha;

                }


                progressBar.style.width =
                    "45%";


                status.innerHTML =
                    "Uploading " +
                    file.name +
                    "...";


                /*
                 * UPLOAD DATA
                 */

                const uploadData = {

                    message:
                        "Upload " + file.name,

                    content:
                        base64

                };


                /*
                 * IF FILE ALREADY EXISTS,
                 * INCLUDE ITS SHA
                 */

                if (existingSHA) {

                    uploadData.sha =
                        existingSHA;

                }


                /*
                 * SEND TO GITHUB
                 */

                const uploadResponse =
                    await fetch(
                        checkURL,
                        {
                            method: "PUT",

                            headers: {

                                "Authorization":
                                    "Bearer " + token,

                                "Accept":
                                    "application/vnd.github+json",

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    uploadData
                                )

                        }
                    );


                /*
                 * SUCCESS
                 */

                if (
                    uploadResponse.ok
                ) {

                    progressBar.style.width =
                        "100%";


                    status.innerHTML =
                        "✅ Upload Successful<br>" +
                        "<small>" +
                        file.name +
                        "</small>";


                    /*
                     * CLEAR FILE INPUT
                     */

                    fileInput.value = "";


                    /*
                     * RESET PROGRESS
                     * AFTER A SHORT DELAY
                     */

                    setTimeout(
                        function () {

                            progressBar.style.width =
                                "0%";

                        },
                        1500
                    );

                    return;

                }


                /*
                 * GITHUB ERROR
                 */

                const error =
                    await uploadResponse.json();


                progressBar.style.width =
                    "0%";


                if (
                    uploadResponse.status ===
                    401
                ) {

                    status.innerHTML =
                        "❌ GitHub authorization failed.<br>" +
                        "<small>Please open Kulzzy Radio Admin and save your token again.</small>";

                    return;

                }


                status.innerHTML =
                    "❌ " +
                    (
                        error.message ||
                        "GitHub upload failed."
                    );

            }

            catch (error) {

                console.error(error);


                progressBar.style.width =
                    "0%";


                status.innerHTML =
                    "❌ " +
                    error.message;

            }

        };


    reader.onerror =
        function () {

            progressBar.style.width =
                "0%";


            status.innerHTML =
                "❌ Unable to read the selected file.";

        };


    reader.readAsDataURL(file);

};
