(function(window) {
    const speechLines = {
        "terse": {
            "roshanMovingNW": "Roshan moving northwest",
            "roshanMovingSE": "Roshan moving southeast",
            "lotus": "Lotus",
            "wisdomRune": "Wisdom",
            "powerRune": "Power",
            "bountyRune": "Bounty",
            "tormentorFirst": "Tormentor",
            "neutrals1": "Neutrals",
            "neutrals2": "Neutrals",
            "neutrals3": "Neutrals",
            "neutrals4": "Neutrals",
            "neutrals5": "Neutrals",
            "stack": "Stack",
            "pull": "Pull",
            "tormentorRespawn": "Tormentor",
            "roshanMinimum": "Roshan minimum",
            "roshanMaximum": "Roshan alive",
            "aegisExpiring": "Aegis expired",
        },
        "descriptive": {
            "roshanMovingNW": "Roshan is moving to the northwest",
            "roshanMovingSE": "Roshan is moving to the southeast",
            "lotus": "Lotus spawning in pool",
            "wisdomRune": "Wisdom rune spawning",
            "powerRune": "Power rune spawning",
            "bountyRune": "Bounty rune spawning",
            "tormentorFirst": "Tormentor spawning",
            "neutrals1": "Tier 1 Neutrals available",
            "neutrals2": "Tier 2 Neutrals available",
            "neutrals3": "Tier 3 Neutrals available",
            "neutrals4": "Tier 4 Neutrals available",
            "neutrals5": "Tier 5 Neutrals available",
            "stack": "Stack",
            "pull": "Pull",
            "tormentorRespawn": "Tormentor respawning",
            "roshanMinimum": "Roshan is eligible to respawn",
            "roshanMaximum": "Roshan has certainly respawned",
            "aegisExpiring": "Aegis is expiring",
        }
    }

    let gameStart = 0;
    let loopId = -1;

    let timingList = [{
        time: 0,
        voiceLine: "example"
    }];

    let timeEventList = [];

    let isPaused = false;
    let lastProcessTime = 0;

    let roshanLocation = "se";

    let savedSettings = {
        enableSpeech: false,
        ttsVolume: 0.5,
        ttsPreWarningTime: 15,
        speechLength: "terse",
        enableRoshanMoving: false,
        enableLotusPool: false,
        lotusPoolLimit: 5,
        enableWisdomRunes: false,
        enableBountyRunes: false,
        enablePowerRunes: false,
        enableTormentor: false,
        enableNeutrals: false,
        enableStackTiming: false,
        enablePullTiming: false,
        enableRoshanLocation: false
    }

    function setup() {
        $("#go").on("click", goClicked);
        $("#stop").on("click", stopClicked);
        $("#enableSpeech").on("change", ttsEnableClicked);
        $("#testTTS").on("click", testTTS);
        $("#roshanDied").on("click", roshanDied);
        $("#tormentorDied").on("click", tormentorDied);
        $("#pause").on("click", pause);

        if (window.speechSynthesis) {
            populateVoiceList();
            if (window.speechSynthesis.onvoiceschanged) {
                window.speechSynthesis.onvoiceschanged(populateVoiceList);
            }
        }

        pullSettingsFromLocalStorage();
        ttsEnableClicked();
    }

    function populateVoiceList() {
        var synthSelect = $("#speechSynthesizer")
        var currVal = synthSelect.val();
        synthSelect.html("");
        var voices = window.speechSynthesis.getVoices();

        voices.forEach((voice) => {
            synthSelect.append(`<option value="${voice.name}">${voice.name}</option>`);
        });

        synthSelect.val(currVal);
    }

    function ttsEnableClicked() {
        var value = $("#enableSpeech").prop("checked");

        $("#speechSynthesizer").prop("disabled", !value);
        $("#ttsVolume").prop("disabled", !value);
        $("#speechLength").prop("disabled", !value);
        $("#testTTS").prop("disabled", !value);
    }

    function testTTS() {
        let utterance = new SpeechSynthesisUtterance("This is a test of the text to speech.");

        var voice = $("#speechSynthesizer").val();
        if (voice) {
            utterance.voice = window.speechSynthesis.getVoices().find((val) => val.name === voice);
        }

        utterance.volume = $("#ttsVolume").val();

        window.speechSynthesis.speak(utterance);
    }

    function goClicked() {
        gameStart = Date.now() + $("#timerStartTime").val() * -1000;

        savedSettings = pullSettings();
        saveSettingsToLocalStorage(savedSettings);
        timeEventList = createTimeList(savedSettings);
        loopId = window.setInterval(timerLoop, 500, timeEventList);
    }

    function pullSettings() {
        return {
            enableSpeech: $("#enableSpeech").prop("checked"),
            ttsVolume: $("#ttsVolume").val(),
            speechLength: $("#speechLength").val(),
            preWarningTime: $("#preWarningTime").val(),
            enableRoshanMoving: $("#enableRoshanMoving").prop("checked"),
            enableLotusPool: $("#enableLotusPool").prop("checked"),
            lotusPoolLimit: $("#lotusPoolLimit").prop("checked"),
            enableWisdomRunes: $("#enableWisdomRunes").prop("checked"),
            enableBountyRunes: $("#enableBountyRunes").prop("checked"),
            enablePowerRunes: $("#enablePowerRunes").prop("checked"),
            enableTormentor: $("#enableTormentor").prop("checked"),
            enableNeutrals: $("#enableNeutrals").prop("checked"),
            enableStackTiming: $("#enableStackTiming").prop("checked"),
            stackTimingLimit: $("#stackTimingLimit").val(),
            enablePullTiming: $("#enablePullTiming").prop("checked"),
            pullWarningLimit: $("#pullWarningLimit").val(),
            enableRoshanLocation: $("#enableRoshanLocation").prop("checked"),
        }
    }

    function saveSettingsToLocalStorage(settings) {
        window.localStorage.setItem("enableSpeech", settings.enableSpeech);
        window.localStorage.setItem("ttsVolume", settings.ttsVolume);
        window.localStorage.setItem("speechLength", settings.speechLength);
        window.localStorage.setItem("preWarningTime", settings.preWarningTime);
        window.localStorage.setItem("speechLength", settings.speechLength);
        window.localStorage.setItem("enableRoshanMoving", settings.enableRoshanMoving);
        window.localStorage.setItem("enableLotusPool", settings.enableLotusPool);
        window.localStorage.setItem("lotusPoolLimit", settings.lotusPoolLimit);
        window.localStorage.setItem("enableWisdomRunes", settings.enableWisdomRunes);
        window.localStorage.setItem("enableBountyRunes", settings.enableBountyRunes);
        window.localStorage.setItem("enablePowerRunes", settings.enablePowerRunes);
        window.localStorage.setItem("enableTormentor", settings.enableTormentor);
        window.localStorage.setItem("enableNeutrals", settings.enableNeutrals);
        window.localStorage.setItem("enableStackTiming", settings.enableStackTiming);
        window.localStorage.setItem("stackTimingLimit", settings.stackTimingLimit);
        window.localStorage.setItem("enablePullTiming", settings.enablePullTiming);
        window.localStorage.setItem("pullWarningLimit", settings.pullWarningLimit);
        window.localStorage.setItem("enableRoshanLocation", settings.enableRoshanLocation);
    }

    //doesn't work, idk why
    function pullSettingsFromLocalStorage() {
        if (window.localStorage.getItem("enableSpeech") !== undefined) {
            $("#enableSpeech").prop("checked", window.localStorage.getItem("enableSpeech"));
            $("#ttsVolume").val(window.localStorage.getItem("ttsVolume"));
            $("#speechLength").val(window.localStorage.getItem("speechLength"));
            $("#preWarningTime").val(window.localStorage.getItem("preWarningTime"));
            $("#enableRoshanMoving").prop("checked", window.localStorage.getItem("enableRoshanMoving"));
            $("#enableLotusPool").prop("checked", window.localStorage.getItem("enableLotusPool"));
            $("#lotusPoolLimit").prop("checked", window.localStorage.getItem("lotusPoolLimit"));
            $("#enableWisdomRunes").prop("checked", window.localStorage.getItem("enableWisdomRunes"));
            $("#enableBountyRunes").prop("checked", window.localStorage.getItem("enableBountyRunes"));
            $("#enablePowerRunes").prop("checked", window.localStorage.getItem("enablePowerRunes"));
            $("#enableTormentor").prop("checked", window.localStorage.getItem("enableTormentor"));
            $("#enableNeutrals").prop("checked", window.localStorage.getItem("enableNeutrals"));
            $("#enableStackTiming").prop("checked", window.localStorage.getItem("enableStackTiming"));
            $("#stackTimingLimit").val(window.localStorage.getItem("stackTimingLimit"));
            $("#enablePullTiming").prop("checked", window.localStorage.getItem("enablePullTiming"));
            $("#pullWarningLimit").val(window.localStorage.getItem("pullWarningLimit"));
            $("#enableRoshanLocation").prop("checked", window.localStorage.getItem("enableRoshanLocation"));
        }
    }

    function createTimeList(settings) {
        timingList = []
        let preWarning = $("#preWarningTime").val() * -1000;

        if (settings.enableRoshanMoving) {
            addToTimingList("roshanMovingNW", 10 * 60 * 1000, 20, -5 * 60 * 1000 + preWarning);
            addToTimingList("roshanMovingSE", 10 * 60 * 1000, 20, 0 + preWarning);
        }

        if (settings.enableLotusPool) {
            var instances = $("#lotusPoolLimit").val();

            addToTimingList("lotus", 3 * 60 * 1000, instances, preWarning);
        }

        if (settings.enableWisdomRunes) {
            addToTimingList("wisdomRune", 7 * 60 * 1000, 20, preWarning);
        }

        if (settings.enablePowerRunes) {
            addToTimingList("powerRune", 2 * 60 * 1000, 60, preWarning);
        }

        if (settings.enableBountyRunes) {
            addToTimingList("bountyRune", 3 * 60 * 1000, 60, preWarning);
        }

        if (settings.enableTormentor) {
            addToTimingList("tormentorFirst", 20 * 60 * 1000, 1, preWarning);
        }

        if (settings.enableNeutrals) {
            addToTimingList("neutrals1", 7 * 60 * 1000, 1);
            addToTimingList("neutrals2", 17 * 60 * 1000, 1);
            addToTimingList("neutrals3", 27 * 60 * 1000, 1);
            addToTimingList("neutrals4", 37 * 60 * 1000, 1);
            addToTimingList("neutrals5", 60 * 60 * 1000, 1);
        }

        if (settings.enableStackTiming) {
            var instances = $("#stackWarningLimit").val();

            addToTimingList("stack", 1 * 60 * 1000, instances, -5 * 1000);
        }

        if (settings.enablePullTiming) {
            var instances = $("#pullWarningLimit").val();

            addToTimingList("pull", 30 * 1000, instances, -16 * 1000);
        }
        timingList.sort((item1, item2) => item1.time - item2.time);
        return timingList;
    }

    function roshanDied() {
        addToLiveTimingList("roshanMinimum", 8 * 60 * 1000);
        addToLiveTimingList("roshanMaximum", 11 * 60 * 1000);
        addToLiveTimingList("aegisExpiring", 5 * 60 * 1000);
    }

    function tormentorDied() {
        addToLiveTimingList("tormentorRespawn", 10 * 60 * 1000);
    }

    /**
     * 
     * @param {string} key SpeechLine key for the event
     * @param {number} period Milliseconds that this event reoccurs. First instance is at offset + period.
     * @param {number} instances Number of times to run this event.
     * @param {number} offset Milliseconds this event should be offset by.
     */
    function addToTimingList(key, period, instances = 20, offset = 0) {
        var time = offset + period;

        for (let i = 0; i < instances; i++) {
            timingList.push({
                time,
                voiceLine: key
            })

            time += period;
        }
    }

    /**
     * Adds to live timing list and sorts it. Use when adding things after initial startup.
     * @param {string} key SpeechLine key for the event
     * @param {number} timeFromNow Milliseconds from now to add the event.
     */
    function addToLiveTimingList(key, timeFromNow) {
        var currentTime = Date.now() - gameStart;
        timeEventList.push({
            time: currentTime + timeFromNow,
            voiceLine: key
        });

        timeEventList.sort((item1, item2) => item1.time - item2.time);
    }

    function stopClicked() {
        window.clearInterval(loopId);
        loopId = -1;
    }

    function pause() {
        if (isPaused) {
            isPaused = false;
            $("#pause").text("Pause");
        } else {
            isPaused = true;
            $("#pause").text("Unpause");
        }
    }

    function timerLoop() {
        let now = Date.now()

        if (isPaused) {
            let loopDelay = now - lastProcessTime;
            lastProcessTime = now;
            gameStart += loopDelay;
            return;
        } else {
            lastProcessTime = now;
        }

        var milliseconds = now - gameStart;
        var seconds = Math.floor((milliseconds / 1000)) % 60;
        var minutes = Math.floor(Math.floor((milliseconds / 1000)) / 60);
        var timerString = "";
        if (seconds < 0 && minutes < 0) {
            minutes += 1;
            minutes = Math.abs(minutes);
            seconds = Math.abs(seconds)
            timerString = `-0${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        } else {
            timerString = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        }

        updateTimer(timerString);
        
        let allMessagesSent = false;

        while (!allMessagesSent) {
            if (timingList.length <= 0) {
                break;
            }

            if (timingList[0].time < milliseconds) {
                postMessage(timerString, speechLines[savedSettings.speechLength][timingList[0].voiceLine], savedSettings.enableSpeech);
                
                console.log(timingList[0].voiceLine);
                if (timingList[0].voiceLine === "roshanMovingNW" || timingList[0].voiceLine === "roshanMovingSE") {
                    roshanMove();
                }

                timingList.splice(0, 1);
            }
            else {
                allMessagesSent = true;
            }
        }
    }

    function postMessage(timerString, message, voice = false) {
        $("#output").prepend(`<div class='line'>[${timerString}] ${message}</div>`)

        if (voice) {
            thisIsAnExampleOfSpeex(message);
        }
    }

    function roshanMove() {
        if (roshanLocation === "nw") {
            roshanLocation = "se";
            $("#roshanLocationIndicator").text("↘");
        } else {
            roshanLocation = "nw";
            $("#roshanLocationIndicator").text("↖");
        }
    }

    function thisIsAnExampleOfSpeex(message) {
        let utterance = new SpeechSynthesisUtterance(message);

        var voice = $("#speechSynthesizer").val();
        if (voice) {
            utterance.voice = window.speechSynthesis.getVoices().find((val) => val.name === voice);
        }

        utterance.volume = $("#ttsVolume").val();

        window.speechSynthesis.speak(utterance);
    }

    function updateTimer(timerString) {
        $("#timer").text(timerString);
    }

    setup();
})(window);