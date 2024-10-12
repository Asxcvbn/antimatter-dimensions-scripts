// Define a new function that combines autoClickElement and autoClickSacrifice and runs them repeatedly
function autoClickElements() {
    // Configurations
    const boostNames = ["dimensional boost", "dimensional galaxy"];
    const boostUse = [true, true];
    // const boostLimit = [14, 1];
    const boostLimit = [14, 0];
    // const boostLimit = [8, 1];

    const sacrificeUse = true;
    const sacrificeThreshold = 2.5;
    const runInterval = 20;// 20ms

    // Function to get the current boost value
    function getCurrentBoost(i){
        var boosts = document.getElementsByClassName('resets-container')[0].children[i].children[0].textContent
        var boost = boosts.match(/\d+/)
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
                if (!boostUse[i]) {
                    continue;
                }
                var element = elements[i];
                if (element.classList.contains("o-primary-btn--disabled")) {
                    continue;
                }

                if (getCurrentBoost(i) >= boostLimit[i]){
                    continue;
                }
                element.click();
                console.log("clicked " + boostNames[i]);
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
            var textContentMatch = element.textContent.match(/\d+\.\d+/);
            if (textContentMatch === null) {
                return false;
            }
            var multiplier = parseFloat(textContentMatch[0]);

            if (multiplier > sacrificeThreshold) {
                element.click();
                console.log("clicked dimensional sacrifice with multiplier " + multiplier);
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
            console.log("clicked big crunch");
            return true;
        } else {
            return false;
        }
    }
    function autoMaxAll() {
        var element=document.getElementsByClassName('o-primary-btn l-button-container')[1];
        if (element) {
            element.click();
            // console.log("clicked max all");
            return true;
        } else {
            return false;
        }
    }
    
    // Set an interval to run both functions every 1 second (you can adjust the interval as needed)
    setInterval(function () {
        autoClickBoost();
        autoClickSacrifice();
        buyMaxTickSpeed();
        autoMaxAll();
        autoBigCrunch();
    }, runInterval);
}

// Call the autoClickElements function to start the auto-click functionality
autoClickElements();
