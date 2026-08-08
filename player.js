/*
==================================================
KULZZY RADIO NETWORK
PLAYER ENGINE
==================================================

LIVE MODE:
Caster.fm player

AUDIO MODE:
GitHub MP3 player

==================================================
*/

(function () {

    "use strict";


    const CONFIG_URL =
        "config.json";


    let audioPlayer = null;

    let currentMode = null;

    let currentAudio = null;


    /*
    ================================================
    LOAD CONFIGURATION
    ================================================
    */

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


            applyConfig(config);

        }

        catch (error) {

            console.error(
                "Kulzzy Player:",
                error
            );

        }

    }


    /*
    ================================================
    APPLY CONFIG
    ================================================
    */

    function applyConfig(config) {

        const mode =
            config.mode || "AUDIO";


        /*
        If nothing changed,
        don't rebuild the player.
        */

        if (
            mode === currentMode &&
            (
                mode === "LIVE" ||
                config.currentAudio === currentAudio
            )
        ) {

            updateText(config);

            return;

        }


        currentMode = mode;

        currentAudio =
            config.currentAudio || "";


        updateText(config);


        if (mode === "LIVE") {

            showLivePlayer(config);

        }

        else {

            showAudioPlayer(config);

        }

    }


    /*
    ================================================
    UPDATE BRANDING / TEXT
    ================================================
    */

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


        if (nowPlaying) {

            nowPlaying.textContent =
                config.nowPlaying ||
                "Kulzzy Radio Network";

        }

    }


    /*
    ================================================
    CASTER LIVE PLAYER
    ================================================
    */

    function showLivePlayer(config) {

        const content =
            document.getElementById(
                "kulzzyPlayerContent"
            );


        if (!content) return;


        /*
        Destroy previous audio
        */

        if (audioPlayer) {

            try {

                audioPlayer.pause();

            }

            catch {}

            audioPlayer = null;

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


        caster.setAttribute(
            "data-publicToken",
            config.caster.publicToken
        );


        caster.setAttribute(
            "data-theme",
            "dark"
        );


        caster.setAttribute(
            "data-color",
            "e81e4d"
        );


        caster.setAttribute(
            "data-channelId",
            config.caster.channelId
        );


        caster.setAttribute(
            "data-rendered",
            "false"
        );


        const links =
            [

                "Shoutcast Hosting",

                "Stream Hosting",

                "Radio Server Hosting"

            ];


        links.forEach(function (text) {

            const link =
                document.createElement("a");

            link.href =
                "https://www.caster.fm";

            link.textContent =
                text;

            caster.appendChild(link);

        });


        content.appendChild(
            caster
        );


        /*
        Load Caster script
        */

        loadCasterScript();

    }


    /*
    ================================================
    CASTER SCRIPT
    ================================================
    */

    function loadCasterScript() {

        /*
        Remove old Caster script
        */

        const old =
            document.getElementById(
                "casterScript"
            );


        if (old) {

            old.remove();

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


    /*
    ================================================
    AUTOMATIC AUDIO PLAYER
    ================================================
    */

    function showAudioPlayer(config) {

        const content =
            document.getElementById(
                "kulzzyPlayerContent"
            );


        if (!content) return;


        /*
        Remove Caster
        */

        const casterScript =
            document.getElementById(
                "casterScript"
            );


        if (casterScript) {

            casterScript.remove();

        }


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


        /*
        AUDIO ELEMENT
        */

        audioPlayer =
            document.createElement(
                "audio"
            );


        audioPlayer.src =
            config.currentAudio;


        audioPlayer.preload =
            "auto";


        audioPlayer.volume =
            typeof config.volume === "number"
                ? config.volume
                : 1;


        audioPlayer.setAttribute(
            "playsinline",
            ""
        );


        /*
        PLAY / PAUSE
        */

        button.addEventListener(
            "click",
            function () {

                if (
                    audioPlayer.paused
                ) {

                    audioPlayer.play()
                        .then(function () {

                            button.innerHTML =
                                "❚❚";

                        })
                        .catch(function (error) {

                            console.error(
                                error
                            );

                        });

                }

                else {

                    audioPlayer.pause();

                    button.innerHTML =
                        "▶";

                }

            }
        );


        audioPlayer.addEventListener(
            "play",
            function () {

                button.innerHTML =
                    "❚❚";

            }
        );


        audioPlayer.addEventListener(
            "pause",
            function () {

                button.innerHTML =
                    "▶";

            }
        );


        /*
        CONTINUOUS PLAY

        When one MP3 finishes,
        start it again.

        */

        audioPlayer.addEventListener(
            "ended",
            function () {

                audioPlayer.currentTime =
                    0;

                audioPlayer.play()
                    .catch(function () {

                        button.innerHTML =
                            "▶";

                    });

            }
        );


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
        Attempt automatic playback.

        Browser may block this until
        the visitor has interacted
        with the page.
        */

        audioPlayer.play()
            .then(function () {

                button.innerHTML =
                    "❚❚";

            })
            .catch(function () {

                button.innerHTML =
                    "▶";

            });

    }


    /*
    ================================================
    START
    ================================================
    */

    loadConfig();


    /*
    Check GitHub configuration
    every 5 seconds.
    */

    setInterval(
        loadConfig,
        5000
    );


})();
