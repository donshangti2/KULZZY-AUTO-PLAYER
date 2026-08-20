/*
==================================================
KULZZY RADIO NETWORK
AUTOMATIC RANDOM AUDIO PLAYER
==================================================

REPOSITORY:
https://github.com/donshangti2/KULZZY-AUTO-PLAYER

AUDIO FOLDER:
https://github.com/donshangti2/KULZZY-AUTO-PLAYER/tree/main/audio

==================================================

FEATURES:

1. Automatically detects ALL MP3 files inside
   the GitHub /audio folder.

2. No need to manually update playlist.json.

3. Every fresh website load selects a RANDOM MP3.

4. When an MP3 finishes, another RANDOM MP3
   is selected automatically.

5. Prevents immediate repetition when possible.

6. Keeps LIVE / Caster.fm mode.

7. Keeps existing player HTML/CSS structure.

8. Falls back to config.json currentAudio
   if GitHub file discovery fails.

==================================================
*/

(function () {

    "use strict";


    /* ==================================================
       CONFIGURATION
    ================================================== */

    const CONFIG_URL =
        "config.json";


    /*
    YOUR EXACT GITHUB REPOSITORY
    */

    const GITHUB_OWNER =
        "donshangti2";

    const GITHUB_REPO =
        "KULZZY-AUTO-PLAYER";

    const GITHUB_BRANCH =
        "main";


    /*
    GitHub API used to automatically discover
    every file inside /audio
    */

    const GITHUB_AUDIO_API =
        "https://api.github.com/repos/" +
        GITHUB_OWNER +
        "/" +
        GITHUB_REPO +
        "/contents/audio?ref=" +
        GITHUB_BRANCH;


    /*
    Direct GitHub Pages audio URL
    */

    const AUDIO_BASE_URL =
        "https://" +
        GITHUB_OWNER +
        ".github.io/" +
        GITHUB_REPO +
        "/audio/";


    /* ==================================================
       PLAYER VARIABLES
    ================================================== */

    let audioPlayer = null;

    let currentMode = null;

    let currentAudio = null;

    let currentButton = null;

    let audioFiles = [];

    let lastAudio = null;

    let playerGeneration = 0;

    let currentConfig = null;

    let isBuildingAudioPlayer = false;


    /* ==================================================
       LOAD CONFIGURATION
    ================================================== */

    async function loadConfig() {

        try {

            const response =
                await fetch(
                    CONFIG_URL +
                    "?t=" +
                    Date.now()
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load config.json"
                );

            }


            const config =
                await response.json();


            currentConfig =
                config;


            applyConfig(config);

        }

        catch (error) {

            console.error(
                "Kulzzy Player: Config error:",
                error
            );

        }

    }


    /* ==================================================
       APPLY CONFIGURATION
    ================================================== */

    function applyConfig(config) {

        /*
        Your config currently uses:

        "status": "AUDIO"

        But some older versions used:

        "mode": "AUDIO"

        So we support BOTH.
        */

        const mode =
            String(
                config.mode ||
                config.status ||
                "AUDIO"
            ).toUpperCase();


        /*
        If the mode has not changed,
        DO NOT rebuild the player every 5 seconds.
        */

        if (
            mode === currentMode
        ) {

            updateText(config);

            return;

        }


        currentMode =
            mode;


        updateText(config);


        /*
        LIVE MODE
        */

        if (
            mode === "LIVE"
        ) {

            showLivePlayer(
                config
            );

        }

        /*
        AUDIO MODE
        */

        else {

            showAudioPlayer(
                config
            );

        }

    }


    /* ==================================================
       UPDATE PLAYER TEXT
    ================================================== */

    function updateText(config) {

        const title =
            document.getElementById(
                "kulzzyPlayerTitle"
            );


        const nowPlaying =
            document.getElementById(
                "kulzzyNowPlaying"
            );


        if (title) {

            title.textContent =
                config.title ||
                "KULZZY RADIO NETWORK";

        }


        /*
        Don't constantly overwrite the
        randomly selected song name.

        Only use config.nowPlaying when
        the player has no selected audio.
        */

        if (
            nowPlaying &&
            !currentAudio
        ) {

            nowPlaying.textContent =
                config.nowPlaying ||
                "Kulzzy Radio Network";

        }

    }


    /* ==================================================
       STOP CURRENT AUDIO
    ================================================== */

    function stopCurrentAudio() {

        /*
        Increase generation number.

        This invalidates any old playback
        callbacks.
        */

        playerGeneration++;


        if (audioPlayer) {

            try {

                audioPlayer.pause();

                audioPlayer.removeAttribute(
                    "src"
                );

                audioPlayer.load();

            }

            catch (error) {

                console.error(
                    "Kulzzy Player: Stop error:",
                    error
                );

            }

        }


        audioPlayer = null;

        currentButton = null;

        currentAudio = null;

    }


    /* ==================================================
       LIVE / CASTER.FM PLAYER
    ================================================== */

    function showLivePlayer(config) {

        const content =
            document.getElementById(
                "kulzzyPlayerContent"
            );


        if (!content) {

            return;

        }


        /*
        Stop automatic MP3 player.
        */

        stopCurrentAudio();


        /*
        Remove old Caster script.
        */

        const oldScript =
            document.getElementById(
                "casterScript"
            );


        if (oldScript) {

            oldScript.remove();

        }


        content.innerHTML = "";


        /*
        LIVE STATUS
        */

        const liveStatus =
            document.createElement(
                "div"
            );


        liveStatus.className =
            "kulzzyStatus live";


        liveStatus.innerHTML =
            "🔴 LIVE ON AIR";


        content.appendChild(
            liveStatus
        );


        /*
        CASTER CONTAINER
        */

        const caster =
            document.createElement(
                "div"
            );


        caster.className =
            "cstrEmbed";


        caster.setAttribute(
            "data-type",
            "newStreamPlayer"
        );


        if (
            config.caster &&
            config.caster.publicToken
        ) {

            caster.setAttribute(
                "data-publicToken",
                config.caster.publicToken
            );

        }


        caster.setAttribute(
            "data-theme",
            "dark"
        );


        caster.setAttribute(
            "data-color",
            "e81e4d"
        );


        if (
            config.caster &&
            config.caster.channelId
        ) {

            caster.setAttribute(
                "data-channelId",
                config.caster.channelId
            );

        }


        caster.setAttribute(
            "data-rendered",
            "false"
        );


        /*
        Caster fallback links.
        */

        const links = [
            "Shoutcast Hosting",
            "Stream Hosting",
            "Radio Server Hosting"
        ];


        links.forEach(
            function (text) {

                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    "https://www.caster.fm";


                link.textContent =
                    text;


                caster.appendChild(
                    link
                );

            }
        );


        content.appendChild(
            caster
        );


        loadCasterScript();

    }


    /* ==================================================
       LOAD CASTER SCRIPT
    ================================================== */

    function loadCasterScript() {

        const oldScript =
            document.getElementById(
                "casterScript"
            );


        if (oldScript) {

            oldScript.remove();

        }


        const script =
            document.createElement(
                "script"
            );


        script.id =
            "casterScript";


        script.src =
            "https://cdn.cloud.caster.fm/widgets/embed.js";


        script.async = true;


        document.body.appendChild(
            script
        );

    }


    /* ==================================================
       FIND ALL AUDIO FILES FROM GITHUB
    ================================================== */

    async function loadAllGitHubAudioFiles() {

        try {

            console.log(
                "Kulzzy Player: Checking GitHub audio folder..."
            );


            const response =
                await fetch(
                    GITHUB_AUDIO_API +
                    "&t=" +
                    Date.now()
                );


            if (!response.ok) {

                throw new Error(
                    "GitHub API returned HTTP " +
                    response.status
                );

            }


            const files =
                await response.json();


            if (
                !Array.isArray(files)
            ) {

                throw new Error(
                    "GitHub audio folder response is not an array."
                );

            }


            /*
            Only accept MP3 files.

            This means files such as:
            .jpg
            .png
            .txt
            .json

            will be ignored.
            */

            const mp3Files =
                files
                    .filter(
                        function (file) {

                            if (
                                !file ||
                                file.type !== "file"
                            ) {

                                return false;

                            }


                            const name =
                                String(
                                    file.name ||
                                    ""
                                ).toLowerCase();


                            return name.endsWith(
                                ".mp3"
                            );

                        }
                    )
                    .map(
                        function (file) {

                            return {
                                name:
                                    file.name,

                                file:
                                    AUDIO_BASE_URL +
                                    encodeURIComponent(
                                        file.name
                                    )
                            };

                        }
                    );


            /*
            Remove duplicates.
            */

            const uniqueFiles = [];


            const seen =
                new Set();


            mp3Files.forEach(
                function (item) {

                    if (
                        !seen.has(
                            item.file
                        )
                    ) {

                        seen.add(
                            item.file
                        );

                        uniqueFiles.push(
                            item
                        );

                    }

                }
            );


            audioFiles =
                uniqueFiles;


            console.log(
                "Kulzzy Player: Found " +
                audioFiles.length +
                " MP3 file(s):",
                audioFiles
            );


            return audioFiles;

        }

        catch (error) {

            console.error(
                "Kulzzy Player: Could not automatically read GitHub audio folder:",
                error
            );


            audioFiles = [];


            return [];

        }

    }


    /* ==================================================
       RANDOM AUDIO SELECTION
    ================================================== */

    function getRandomAudio() {

        if (
            audioFiles.length === 0
        ) {

            return null;

        }


        /*
        If there is only one MP3,
        use it.
        */

        if (
            audioFiles.length === 1
        ) {

            lastAudio =
                audioFiles[0].file;

            return audioFiles[0];

        }


        let selected = null;

        let attempts = 0;


        /*
        Select a random file.

        Don't immediately select the same
        file that just finished.
        */

        while (
            attempts < 50
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    audioFiles.length
                );


            selected =
                audioFiles[
                    randomIndex
                ];


            if (
                selected.file !==
                lastAudio
            ) {

                break;

            }


            attempts++;

        }


        /*
        Remember this audio.
        */

        lastAudio =
            selected.file;


        return selected;

    }


    /* ==================================================
       UPDATE NOW PLAYING
    ================================================== */

    function updateNowPlaying(
        audioItem
    ) {

        const nowPlaying =
            document.getElementById(
                "kulzzyNowPlaying"
            );


        if (!nowPlaying) {

            return;

        }


        if (
            audioItem &&
            audioItem.name
        ) {

            /*
            Remove .mp3 from display.
            */

            const cleanName =
                audioItem.name
                    .replace(
                        /\.mp3$/i,
                        ""
                    )
                    .replace(
                        /[_-]+/g,
                        " "
                    );


            nowPlaying.textContent =
                cleanName;

        }

        else {

            nowPlaying.textContent =
                "Kulzzy Radio Network";

        }

    }


    /* ==================================================
       CREATE AUDIO PLAYER
    ================================================== */

    async function showAudioPlayer(
        config
    ) {

        /*
        Prevent duplicate builds.
        */

        if (
            isBuildingAudioPlayer
        ) {

            return;

        }


        isBuildingAudioPlayer =
            true;


        const content =
            document.getElementById(
                "kulzzyPlayerContent"
            );


        if (!content) {

            isBuildingAudioPlayer =
                false;

            return;

        }


        /*
        Remove Caster script.
        */

        const casterScript =
            document.getElementById(
                "casterScript"
            );


        if (casterScript) {

            casterScript.remove();

        }


        /*
        Stop old player.
        */

        stopCurrentAudio();


        /*
        Clear player.
        */

        content.innerHTML = "";


        /*
        AUDIO STATUS
        */

        const status =
            document.createElement(
                "div"
            );


        status.className =
            "kulzzyStatus audio";


        status.innerHTML =
            "🎵 AUTOMATIC AUDIO";


        content.appendChild(
            status
        );


        /*
        PLAYER WRAPPER
        */

        const player =
            document.createElement(
                "div"
            );


        player.className =
            "audioPlayer";


        /*
        PLAY BUTTON
        */

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "kulzzyPlayButton";


        button.innerHTML =
            "▶";


        currentButton =
            button;


        /*
        AUDIO ELEMENT
        */

        audioPlayer =
            document.createElement(
                "audio"
            );


        audioPlayer.preload =
            "auto";


        audioPlayer.setAttribute(
            "playsinline",
            ""
        );


        audioPlayer.volume =
            typeof config.volume === "number"
                ? config.volume
                : 1;


        /*
        Add elements.
        */

        player.appendChild(
            button
        );


        player.appendChild(
            audioPlayer
        );


        content.appendChild(
            player
        );


        /*
        ================================================
        FIND ALL YOUR MP3 FILES
        ================================================
        */

        await loadAllGitHubAudioFiles();


        /*
        If GitHub API finds nothing,
        use config.currentAudio as fallback.
        */

        if (
            audioFiles.length === 0 &&
            config.currentAudio
        ) {

            audioFiles = [
                {
                    name:
                        String(
                            config.currentAudio
                        )
                        .split("/")
                        .pop(),

                    file:
                        config.currentAudio
                }
            ];


            console.log(
                "Kulzzy Player: Using config.currentAudio fallback:",
                config.currentAudio
            );

        }


        /*
        Select a RANDOM audio immediately.
        */

        const selected =
            getRandomAudio();


        if (!selected) {

            console.error(
                "Kulzzy Player: No MP3 files were found."
            );


            isBuildingAudioPlayer =
                false;

            return;

        }


        /*
        Play selected random audio.
        */

        playAudio(
            selected,
            config
        );


        /*
        ================================================
        PLAY / PAUSE BUTTON
        ================================================
        */

        button.addEventListener(
            "click",
            function () {

                if (
                    !audioPlayer
                ) {

                    return;

                }


                if (
                    audioPlayer.paused
                ) {

                    audioPlayer.play()

                        .then(
                            function () {

                                button.innerHTML =
                                    "❚❚";

                            }
                        )

                        .catch(
                            function (error) {

                                console.error(
                                    "Kulzzy Player: Play error:",
                                    error
                                );

                            }
                        );

                }

                else {

                    audioPlayer.pause();


                    button.innerHTML =
                        "▶";

                }

            }
        );


        /*
        ================================================
        PLAY EVENT
        ================================================
        */

        audioPlayer.addEventListener(
            "play",
            function () {

                if (
                    button
                ) {

                    button.innerHTML =
                        "❚❚";

                }

            }
        );


        /*
        ================================================
        PAUSE EVENT
        ================================================
        */

        audioPlayer.addEventListener(
            "pause",
            function () {

                if (
                    button
                ) {

                    button.innerHTML =
                        "▶";

                }

            }
        );


        /*
        ================================================
        AUDIO ERROR
        ================================================
        */

        audioPlayer.addEventListener(
            "error",
            function () {

                console.error(
                    "Kulzzy Player: Audio error:",
                    audioPlayer.error
                );


                /*
                If one MP3 fails,
                automatically try another one.
                */

                setTimeout(
                    function () {

                        if (
                            currentMode ===
                            "AUDIO"
                        ) {

                            playNextRandomAudio(
                                config
                            );

                        }

                    },
                    1000
                );

            }
        );


        /*
        ================================================
        AUDIO FINISHED
        ================================================

        THIS IS THE MAIN RANDOM PLAYBACK FUNCTION.

        When an MP3 finishes:

        OLD:
        Same MP3 starts again.

        NEW:
        Another random MP3 is selected.
        ================================================
        */

        audioPlayer.addEventListener(
            "ended",
            function () {

                console.log(
                    "Kulzzy Player: Audio finished."
                );


                if (
                    currentMode !==
                    "AUDIO"
                ) {

                    return;

                }


                playNextRandomAudio(
                    config
                );

            }
        );


        isBuildingAudioPlayer =
            false;

    }


    /* ==================================================
       PLAY AN AUDIO FILE
    ================================================== */

    function playAudio(
        audioItem,
        config
    ) {

        if (
            !audioPlayer ||
            !audioItem
        ) {

            return;

        }


        /*
        Create a new generation ID.
        */

        playerGeneration++;


        const generation =
            playerGeneration;


        currentAudio =
            audioItem.file;


        /*
        Update display.
        */

        updateNowPlaying(
            audioItem
        );


        console.log(
            "Kulzzy Player: RANDOM AUDIO SELECTED:",
            audioItem.name
        );


        console.log(
            "Kulzzy Player: URL:",
            audioItem.file
        );


        /*
        Set audio source.
        */

        audioPlayer.src =
            audioItem.file;


        audioPlayer.currentTime =
            0;


        audioPlayer.load();


        /*
        Wait until browser has enough
        information to begin playback.
        */

        const attemptPlay =
            function () {

                if (
                    !audioPlayer
                ) {

                    return;

                }


                if (
                    generation !==
                    playerGeneration
                ) {

                    return;

                }


                audioPlayer.play()

                    .then(
                        function () {

                            if (
                                currentButton
                            ) {

                                currentButton.innerHTML =
                                    "❚❚";

                            }


                            console.log(
                                "Kulzzy Player: Playing:",
                                audioItem.name
                            );

                        }
                    )

                    .catch(
                        function (error) {

                            /*
                            Browser autoplay may be blocked.

                            The random audio has still been
                            selected correctly.

                            Visitor can press PLAY.
                            */

                            console.log(
                                "Kulzzy Player: Browser blocked autoplay. Press PLAY.",
                                error
                            );


                            if (
                                currentButton
                            ) {

                                currentButton.innerHTML =
                                    "▶";

                            }

                        }
                    );

            };


        /*
        Try once audio can play.
        */

        audioPlayer.addEventListener(
            "canplay",
            attemptPlay,
            {
                once: true
            }
        );


        /*
        Safety check for cached files.
        */

        if (
            audioPlayer.readyState >= 3
        ) {

            setTimeout(
                attemptPlay,
                100
            );

        }

    }


    /* ==================================================
       PLAY NEXT RANDOM AUDIO
    ================================================== */

    function playNextRandomAudio(
        config
    ) {

        if (
            currentMode !==
            "AUDIO"
        ) {

            return;

        }


        if (
            !audioPlayer
        ) {

            return;

        }


        /*
        Get another random MP3.
        */

        const nextAudio =
            getRandomAudio();


        if (!nextAudio) {

            console.error(
                "Kulzzy Player: No next audio available."
            );


            return;

        }


        console.log(
            "Kulzzy Player: NEXT RANDOM AUDIO:",
            nextAudio.name
        );


        /*
        Play it.
        */

        playAudio(
            nextAudio,
            config
        );

    }


    /* ==================================================
       START PLAYER
    ================================================== */

    loadConfig();


    /* ==================================================
       CHECK CONFIG EVERY 5 SECONDS
    ==================================================

    This checks for LIVE/AUDIO changes.

    IMPORTANT:

    It does NOT restart the current random song
    every 5 seconds.

    The random song continues playing normally.
    */

    setInterval(
        loadConfig,
        5000
    );


})();
