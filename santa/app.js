let givers = ['Josh', 'Savannah', 'Joe', 'Abby', 'David', 'Jackie', 'Steven', 'Jennifer', 'Jason'];
let recievers = ['Josh', 'Savannah', 'Joe', 'Abby', 'David', 'Jackie', 'Steven', 'Jennifer', 'Jason'];

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

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

// Takes any integer
function seed(i) {
    m_w = i;
    m_z = 987654321;
}

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
var realRandom = Math.random;
Math.random = function() {
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + m_w) & mask;
    result /= 4294967296;
    return result + 0.5;
}

function generatePairs() {
    seed(42069);
    let valid = false;
    let found = false;

    while (!valid) {
        givers = _.shuffle(givers);
        recievers = _.shuffle(recievers);
        valid = validatePairs(givers, recievers);
    }

    var input = $("#in")[0].value;
    for (let i = 0; i < givers.length; i++) {
        if (givers[i] == input) {
            $("#log").append(givers[i] + " buys for " + recievers[i] + "<br/>")
            found = true;
        }
    }
    $("#submit").attr("disabled", true);

    if (!found) {
	$("#log").append("Name '" + input + "' was not found. <br/>" +
			 "You need to refresh the page to try again, sorry.");
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
	function getRandom(min, max) {
		return realRandom() * (max - min) + min;
	}

	(function letItSnow(){
	var snowflakes = document.querySelectorAll('.snow');
		for (var i = 0; i < snowflakes.length; i++) {
			var snowflake = snowflakes[i];
			snowflake.setAttribute('cx', getRandom(1,100) + '%');
			snowflake.setAttribute('cy', '-' + getRandom(1,400));
			snowflake.setAttribute('r', getRandom(1,3));
		}
	})();
});
