let givers = ['Josh', 'Savannah', 'Joe', 'Abby', 'David', 'Jackie', 'Steven', 'Jennifer', 'John', 'Jason'];
let recievers = ['Josh', 'Savannah', 'Joe', 'Abby', 'David', 'Jackie', 'Steven', 'Jennifer', 'John', 'Jason'];

let bannedCombinations = [
    //married
    ['David', 'Jackie'],
    ['Steven', 'Jennifer'],
    ['Josh', 'Savannah'],
    ['Joe', 'Abby'],

    //biological
    ['David', 'Steven'],
    ['Josh', 'Abby'],

    //legal
    ['David', 'Jennifer'],
    ['Jackie', 'Jennifer'],
    ['Jackie', 'Steven'],
    ['Josh', 'Joe'],
    ['Joe', 'Savannah'],
    ['Savannah', 'Abby']
];

function generatePairs() {
    let valid = false;
    let counts = 0;

    while (!valid) {
        givers = _.shuffle(givers);
        recievers = _.shuffle(recievers);
        valid = validatePairs(givers, recievers);
        counts++;
    }

    console.log("Tries to get good draw: " + counts);
    for (let i = 0; i < givers.length; i++) {
        $("#log").append(givers[i] + " buys for " + recievers[i] + "<br/>")
    }
}

function validatePairs(givers, recievers) {
    for (let i = 0; i < givers.length; i++) {
        if (givers[i] === recievers[i]) {
            return false;
        }

        for (let j = 0; j < bannedCombinations.length; j++) {
            if (givers[i] === bannedCombinations[j][0] && recievers[i] === bannedCombinations[j][1]) {
                return false;
            }
            if (givers[i] === bannedCombinations[j][1] && recievers[i] === bannedCombinations[j][0]) {
                return false;
            }
        }
    }
    return true;
}

$(document).ready(function() {
    generatePairs();
});
