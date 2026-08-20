/*
========================================================
KULZZY RADIO NETWORK
KULZZY AUTO PLAYER
========================================================

BEHAVIOUR:

ONE AUDIO FILE ONLY

Every time the player/page is loaded:
- The configured audio file is loaded
- A random position is selected
- Playback starts from that random position

Example:

Audio = 3:06

Refresh 1 → 1:03
Refresh 2 → 2:17
Refresh 3 → 0:41
Refresh 4 → 1:52

The player DOES NOT randomly change MP3 files.

========================================================
*/


(function () {

    "use strict";


    /* ==================================================
       CONFIG
    ================================================== */

    const CONFIG_URL = "config.json";


    /* ==================================================
       PLAYER VARIABLES
    ================================================== */

    let audioPlayer = null;

    let currentMode = null;

    let currentAudio = null;

    let currentButton = null;

    let randomPositionSet = false;


    /* ==================================================
       LOAD CONFIG
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
                    "Could not load config.json"
                );

            }


            const config =
                await response.json();


            applyConfig(config);

        }

        catch (error) {

            console.error(
                "Kulzzy Player: Config error",
                error
            );

        }

    }


    /* ==================================================
       APPLY CONFIG
    ================================================== */

    function applyConfig(config) {

        /*
        Support both:

        status: "AUDIO"

        and

        mode: "AUDIO"
        */

        const mode =
            String(
                config.mode ||
                config.status ||
                "AUDIO"
            ).toUpperCase();


        /*
        If mode hasn't changed,
        don't rebuild the player.

        This is important because config.json
        is checked repeatedly.
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

            showLivePlayer(config);

            return;

        }


        /*
        AUDIO MODE
        */

        showAudioPlayer(config);

    }


    /* ==================================================
       UPDATE TEXT
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
        Only display config.nowPlaying
        if we haven't selected an audio yet.
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
       STOP AUDIO
    ================================================== */

    function stopAudio() {

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
                    "Kulzzy Player: Stop error",
                    error
                );

            }

        }


        audioPlayer = null;

        currentButton = null;

        currentAudio = null;

        randomPositionSet = false;

    }


    /* ==================================================
       LIVE PLAYER
    ================================================== */

    function showLivePlayer(config) {

        const content =
            document.getElementById(
                "kulzzyPlayerContent"
            );


        if (!content) {

            return;

        }


        stopAudio();


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
        CASTER PLAYER
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
        Fallback links
        */

        const link1 =
            document.createElement(
                "a"
            );


        link1.href =
            "https://www.caster.fm";


        link1.textContent =
            "Shoutcast Hosting";


        caster.appendChild(
            link1
        );


        const link2 =
            document.createElement(
                "a"
            );


        link2.href =
            "https://www.caster.fm";


        link2.textContent =
            "Stream Hosting";


        caster.appendChild(
            link2
        );


        const link3 =
            document.createElement(
                "a"
            );


        link3.href =
            "https://www.caster.fm";


        link3.textContent =
            "Radio Server Hosting";


        caster.appendChild(
            link3
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


        script.async =
            true;


        document.body.appendChild(
            script
        );

    }


    /* ==================================================
       AUDIO PLAYER
    ================================================== */

    function showAudioPlayer(config) {

        const content =
            document.getElementById(
                "kulzzyPlayerContent"
            );


        if (!content) {

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
        Stop old audio.
        */

        stopAudio();


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


        /*
        Volume
        */

        if (
            typeof config.volume ===
            "number"
        ) {

            audioPlayer.volume =
                config.volume;

        }

        else {

            audioPlayer.volume =
                1;

        }


        /*
        Add player elements.
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
        ==================================================
        IMPORTANT
        ==================================================

        USE THE SAME AUDIO FILE FROM CONFIG.JSON.

        We do NOT use playlist.json.
        We do NOT search GitHub.
        We do NOT change audio files.
        */

        let audioFile =
            config.currentAudio;


        /*
        Safety fallback.

        If currentAudio isn't available,
        try current audio field.
        */

        if (
            !audioFile
        ) {

            audioFile =
                config.audio ||
                config.audioFile ||
                "";

        }


        if (
            !audioFile
        ) {

            console.error(
                "Kulzzy Player: No audio file found in config.json."
            );

            return;

        }


        /*
        Save current audio.
        */

        currentAudio =
            audioFile;


        /*
        Set audio source.
        */

        audioPlayer.src =
            audioFile;


        audioPlayer.load();


        /*
        ==================================================
        RANDOM START POSITION
        ==================================================

        This is the main feature.

        Once the browser knows the duration,
        we choose a random position between:

        0 seconds

        and

        the full audio duration.
        */

        audioPlayer.addEventListener(
            "loadedmetadata",
            function () {

                /*
                Make sure we only select
                the random position ONCE.
                */

                if (
                    randomPositionSet
                ) {

                    return;

                }


                /*
                Make sure duration is valid.
                */

                if (
                    !audioPlayer.duration ||
                    !isFinite(
                        audioPlayer.duration
                    )
                ) {

                    return;

                }


                /*
                Generate random position.

                Example:

                Duration = 186 seconds

                Math.random() gives:
                0.0000 → 0.9999

                Result:
                0 → 185.99 seconds
                */

                const randomPosition =
                    Math.random() *
                    audioPlayer.duration;


                /*
                Set random position.
                */

                try {

                    audioPlayer.currentTime =
                        randomPosition;

                    randomPositionSet =
                        true;


                    console.log(
                        "Kulzzy Player: Random start:",
                        formatTime(
                            randomPosition
                        ),
                        "of",
                        formatTime(
                            audioPlayer.duration
                        )
                    );

                }

                catch (error) {

                    console.error(
                        "Kulzzy Player: Could not set random position:",
                        error
                    );

                }

            }
        );


        /*
        ==================================================
        PLAY BUTTON
        ==================================================
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
        ==================================================
        PLAY EVENT
        ==================================================
        */

        audioPlayer.addEventListener(
            "play",
            function () {

                if (
                    currentButton
                ) {

                    currentButton.innerHTML =
                        "❚❚";

                }

            }
        );


        /*
        ==================================================
        PAUSE EVENT
        ==================================================
        */

        audioPlayer.addEventListener(
            "pause",
            function () {

                if (
                    currentButton
                ) {

                    currentButton.innerHTML =
                        "▶";

                }

            }
        );


        /*
        ==================================================
        AUDIO ERROR
        ==================================================
        */

        audioPlayer.addEventListener(
            "error",
            function () {

                console.error(
                    "Kulzzy Player: Audio loading error:",
                    audioPlayer.error
                );

            }
        );


        /*
        ==================================================
        AUDIO ENDED
        ==================================================

        IMPORTANT:

        When the audio reaches the END,
        it starts again from the beginning.

        The RANDOM position happens again
        only when the page/player is recreated.

        This keeps ONE AUDIO FILE playing.
        */

        audioPlayer.addEventListener(
            "ended",
            function () {

                /*
                Reset random flag.
                */

                randomPositionSet =
                    false;


                /*
                Start the same audio again.

                The next random position will
                be selected after metadata loads.
                */

                audioPlayer.currentTime =
                    0;


                audioPlayer.load();

            }
        );

    }


    /* ==================================================
       FORMAT TIME
    ================================================== */

    function formatTime(seconds) {

        if (
            !isFinite(seconds)
        ) {

            return "0:00";

        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        const remainingSeconds =
            Math.floor(
                seconds % 60
            );


        return (
            minutes +
            ":" +
            String(
                remainingSeconds
            ).padStart(
                2,
                "0"
            )
        );

    }


    /* ==================================================
       START PLAYER
    ================================================== */

    loadConfig();


    /* ==================================================
       CHECK CONFIG EVERY 5 SECONDS
    ==================================================

    This does NOT restart the audio.

    It only checks whether you changed
    LIVE/AUDIO configuration.
    */

    setInterval(
        loadConfig,
        5000
    );


})();
