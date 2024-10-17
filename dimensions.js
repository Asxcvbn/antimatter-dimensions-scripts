// Define a new function that combines autoClickElement and autoClickSacrifice and runs them repeatedly
function autoClickElements(stage=0) {

    const Stages = {

        Entry:0,
        Infinity:1,
        InfinityBreak:2,
        InfinityBreak2:3,
    }


    // Configurations
    const boostNames = ["dimensional boost", "dimensional galaxy"];
    // set boost limits if needed. these values need to be tuned based on current stage
    // const boostLimit = [14, 2]; 
    const boostLimit = [4, 0];
    // const boostLimit = [8, 1];

    const sacrificeUse = true;
    const sacrificeThreshold = 2.5;
    const runInterval = 20;// 20ms
    const runSlowInterval = 1000;// 1s

    const brokenInfinityResetThreshold = 0.6; // 2/3 of the peak IP rate   
    
    const LogLevel = {
        DEBUG: 0,
        INFO: 1,
        MaxAll: 2,
        Sacrifice: 3,
        Boost: 4,
        BigCrunch: 5,
        BigCrunchBrokenInfinity: 6,    
        WARNING: 10,
        ERROR: 11,
        ONCE:99,
    };
    const logLevel1 = LogLevel.BigCrunchBrokenInfinity;
    const scientificNotationMatch = /[\d.]+(?:[eE][+-]?\d+)?/g;

    // Function to get the current boost value
    function getCurrentBoost(i) {
        var boosts = document.getElementsByClassName('resets-container')[0].children[i].children[0].textContent
        var boost = boosts.match(scientificNotationMatch)
        if (boost === null) {
            return 0;
        }
        boost = parseInt(boost[0]);
        return boost
    }

    // Function to auto click the element with class 'o-primary-btn o-primary-btn--new o-primary-btn--dimension-reset' and not disabled with 'o-primary-btn--disabled'
    function autoClickBoost() {
        var elements = document.getElementsByClassName("o-primary-btn o-primary-btn--new o-primary-btn--dimension-reset");
        if (elements) {
            for (var i = elements.length - 1; i >= 0; i--) {

                var element = elements[i];
                if (element.classList.contains("o-primary-btn--disabled")) {
                    continue;
                }

                if (getCurrentBoost(i) >= boostLimit[i]) {
                    continue;
                }
                element.click();
                
                (logLevel1<=LogLevel.Boost) && console.log("clicked " + boostNames[i]);
                
            }
            return true;
        } else {
            return false;
        }
    }

    // Function to auto click the element with class 'o-primary-btn o-primary-btn--sacrifice' if multiplier is above the threshold
    function autoClickSacrifice() {
        var element = document.getElementsByClassName("o-primary-btn o-primary-btn--sacrifice")[0];
        if (element && sacrificeUse) {
            var textContentMatch = element.textContent.match(scientificNotationMatch);
            if (textContentMatch === null) {
                return false;
            }
            var multiplier = parseFloat(textContentMatch[0]);

            if (multiplier > sacrificeThreshold) {
                element.click();
                (logLevel1<=LogLevel.Sacrifice) &&  console.log("clicked dimensional sacrifice with multiplier " + multiplier);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    function autoBigCrunch() {
        var element = document.getElementsByClassName('btn-big-crunch')[0];
        if (element) {
            element.click();
            (logLevel1<=LogLevel.BigCrunch) && console.log("clicked big crunch");
            return true;
        } else {
            return false;
        }
    }
    function autoMaxAll() {
        var element = document.getElementsByClassName('o-primary-btn l-button-container')[1];
        if (element) {
            element.click();
            (logLevel1<=LogLevel.MaxAll) && console.log("clicked max all");
            return true;
        } else {
            return false;
        }
    }
    function autoBigCrunchBrokenInfinity() {
        // o-prestige-button o-infinity-button
        var element = document.getElementsByClassName('o-prestige-button o-infinity-button')[1];
        if (!element) {
            (logLevel1<=LogLevel.INFO) && console.log("no big crunch button");
            return false;
        }
        //innerText: "Big Crunch for 1.63e3 IP\nCurrent: 4.76e3 IP/min\nPeak: 5.46e3 IP/min\nat 163 IP"
        // we want to extract all the numbers. the number might be scientific notation or normal notation
        var text = element.innerText;

        var numbers = text.match(scientificNotationMatch);

        // var numbers = text.match(/\d+\.\d+e\d+/g);
        if (!numbers || !numbers[3]) {
            (logLevel1<=LogLevel.INFO) && console.log("no numbers or too many numbers");
            return false;
        }
        var currentIP = parseFloat(numbers[0]);
        var currentIPRate = parseFloat(numbers[1]);
        var peakIPRate = parseFloat(numbers[2]);
        var peakIP = parseFloat(numbers[3]);

        (logLevel1<=LogLevel.INFO) && console.log("currentIP: " + currentIP + " currentIPRate: " + currentIPRate + " peakIPRate: " + peakIPRate + " peakIP: " + peakIP);

        if (currentIPRate < peakIPRate * brokenInfinityResetThreshold) {
            element.click();
            // we want scientific notation
            (logLevel1<=LogLevel.BigCrunchBrokenInfinity) && console.log("clicked big crunch for " + currentIP.toExponential(2) + " IP at " + currentIPRate.toExponential(2) + " IP/min while peak is " + peakIPRate.toExponential(2) + " IP/min at " + peakIP.toExponential(2) + " IP");
            return true;
        } else {
            (logLevel1<=LogLevel.INFO) && console.log("ip rate is fine");
            return false;
        }

    }
    if (stage === Stages.Entry) {
        // Set an interval to run both functions every 1 second (you can adjust the interval as needed)
        setInterval(function () {
            autoClickBoost();
            autoClickSacrifice();
            buyMaxTickSpeed();
            autoMaxAll();
            // autoBigCrunch();
        }, runInterval);
        (logLevel1<=LogLevel.ONCE) && console.log("autoClickElements stage: Entry");
    }
    else if (stage === Stages.Infinity) {
        // Set an interval to run both functions every 1 second (you can adjust the interval as needed)
        setInterval(function () {
            autoClickBoost();
            autoClickSacrifice();
            buyMaxTickSpeed();
            autoMaxAll();
            autoBigCrunch();
        }, runInterval);

        (logLevel1<=LogLevel.ONCE) && console.log("autoClickElements stage: Infinity");
    }

    else if (stage === Stages.InfinityBreak) {
        // Set an interval to run both functions every 1 second (you can adjust the interval as needed)
        setInterval(function () {
            autoClickBoost();
            autoClickSacrifice();
            buyMaxTickSpeed();
            autoMaxAll();
            //autoBigCrunch();
        }, runInterval);

        setInterval(function () {
            autoBigCrunchBrokenInfinity();
        }, runSlowInterval);
        (logLevel1<=LogLevel.ONCE) && console.log("autoClickElements stage: InfinityBreak");
    }
    else if (stage === Stages.InfinityBreak2) {
        
        setInterval(function () {
            autoClickSacrifice();
            buyMaxTickSpeed();
            autoMaxAll();
        }, runInterval);

        (logLevel1<=LogLevel.ONCE) && console.log("autoClickElements stage: InfinityBreak2");
    }
    else {
        (logLevel1<=LogLevel.ONCE) && console.log("autoClickElements stage: unknown. exiting");
    }
}

// Call the autoClickElements function to start the auto-click functionality
autoClickElements();
