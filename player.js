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

            catch (error) {

                console.error(
                    "Kulzzy Player:",
                    error
                );

            }

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


        const links =
            [
                "Shoutcast Hosting",
                "Stream Hosting",
                "Radio Server Hosting"
            ];


        links.forEach(function (text) {

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


        /*
        Stop previous audio
        */

        if (audioPlayer) {

            try {

                audioPlayer.pause();

            }

            catch (error) {

                console.error(
                    "Kulzzy Player:",
                    error
                );

            }

            audioPlayer = null;

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
        ================================================
        RANDOM START POSITION
        ================================================

        IMPORTANT:

        The player waits until the MP3 metadata is
        completely available.

        Then it calculates the real duration.

        Then it selects a random position.

        Then it sets currentTime.

        ONLY AFTER THAT does it try to play.

        This prevents the browser from starting
        the MP3 at 00:00 before the random position
        has been applied.

        The random position can be:

        - Near the beginning
        - Somewhere in the middle
        - Near the end

        The same audio file remains selected.

        ================================================
        */

        let randomPositionSet = false;

        let initialPlaybackStarted = false;


        function setRandomStartPosition() {

            if (randomPositionSet) {

                return true;

            }


            const duration =
                audioPlayer.duration;


            /*
            Make sure the browser has a valid
            duration before calculating a position.
            */

            if (
                !isFinite(duration) ||
                duration <= 0
            ) {

                return false;

            }


            /*
            Keep a small amount of audio available
            at the end so we don't randomly land
            exactly on the final frame.
            */

            const safeEnd =
                Math.max(
                    0,
                    duration - 0.25
                );


            /*
            Generate random position.

            Math.random() returns a number between:

            0 and 1

            Therefore this produces a random
            position anywhere through the song.
            */

            const randomPosition =
                Math.random() *
                safeEnd;


            try {

                audioPlayer.currentTime =
                    randomPosition;

                randomPositionSet =
                    true;


                console.log(
                    "Kulzzy Player: Random start position:",
                    randomPosition.toFixed(2),
                    "seconds of",
                    duration.toFixed(2),
                    "seconds"
                );


                return true;

            }

            catch (error) {

                console.error(
                    "Kulzzy Player: Unable to set random position.",
                    error
                );

                return false;

            }

        }


        /*
        ================================================
        START AUDIO AFTER RANDOM POSITION IS READY
        ================================================
        */

        function startInitialPlayback() {

            if (initialPlaybackStarted) {

                return;

            }


            /*
            Try setting the random position first.
            */

            const ready =
                setRandomStartPosition();


            if (!ready) {

                /*
                Metadata may not be ready yet.
                The loadedmetadata event will
                try again.
                */

                return;

            }


            initialPlaybackStarted = true;


            /*
            Give the browser a moment to apply
            currentTime before calling play().
            */

            const playAudio =
                function () {

                    if (!audioPlayer) {

                        return;

                    }


                    audioPlayer.play()

                        .then(function () {

                            button.innerHTML =
                                "❚❚";


                            console.log(
                                "Kulzzy Player: Playing from random position."
                            );

                        })

                        .catch(function (error) {

                            /*
                            Browser autoplay restriction.

                            The audio is still correctly positioned.
                            The visitor can press the play button.
                            */

                            console.log(
                                "Kulzzy Player: Autoplay blocked.",
                                error
                            );


                            button.innerHTML =
                                "▶";

                        });

                };


            /*
            requestAnimationFrame gives the browser
            time to apply the currentTime change.
            */

            if (
                typeof requestAnimationFrame ===
                "function"
            ) {

                requestAnimationFrame(
                    playAudio
                );

            }

            else {

                setTimeout(
                    playAudio,
                    0
                );

            }

        }


        /*
        ================================================
        METADATA READY
        ================================================
        */

        audioPlayer.addEventListener(
            "loadedmetadata",
            function () {

                console.log(
                    "Kulzzy Player: Audio metadata loaded."
                );


                startInitialPlayback();

            }
        );


        /*
        Some browsers may already have metadata
        available before the event listener is
        processed.

        Check it as an additional safety measure.
        */

        if (
            audioPlayer.readyState >= 1
        ) {

            startInitialPlayback();

        }


        /*
        ================================================
        PLAY / PAUSE BUTTON
        ================================================
        */

        button.addEventListener(
            "click",
            function () {

                if (!audioPlayer) {

                    return;

                }


                if (
                    audioPlayer.paused
                ) {

                    /*
                    If random position somehow hasn't
                    been set yet, try to set it now.
                    */

                    if (
                        !randomPositionSet
                    ) {

                        setRandomStartPosition();

                    }


                    audioPlayer.play()

                        .then(function () {

                            button.innerHTML =
                                "❚❚";

                        })

                        .catch(function (error) {

                            console.error(
                                "Kulzzy Player:",
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


        /*
        ================================================
        PLAY EVENT
        ================================================
        */

        audioPlayer.addEventListener(
            "play",
            function () {

                button.innerHTML =
                    "❚❚";

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

                button.innerHTML =
                    "▶";

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
                    "Kulzzy Player: Audio could not be loaded.",
                    audioPlayer.error
                );


                button.innerHTML =
                    "▶";

            }
        );


        /*
        ================================================
        CONTINUOUS PLAY
        ================================================

        When the MP3 finishes, start the SAME MP3
        again from the beginning.

        IMPORTANT:

        Random playback happens only when the
        website/player is initially created.

        When the song ends, it starts from 00:00.

        ================================================
        */

        audioPlayer.addEventListener(
            "ended",
            function () {

                if (!audioPlayer) {

                    return;

                }


                audioPlayer.currentTime =
                    0;


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
        );


        /*
        ================================================
        BUILD PLAYER
        ================================================
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
        LOAD AUDIO
        ================================================
        */

        /*
        Calling load() ensures the browser starts
        loading the newly selected MP3.
        */

        audioPlayer.load();


        /*
        ================================================
        INITIAL AUTOPLAY

        We DO NOT call audioPlayer.play() here.

        Instead, playback begins inside
        startInitialPlayback() AFTER:

        1. Metadata loads
        2. Duration is known
        3. Random position is selected
        4. currentTime is set

        This is the important fix.
        ================================================
        */

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
