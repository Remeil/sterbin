let possibilities = ["N", "S", "E", "W", "C", "F", "O", "D"];
let queue = [];

function increaseMaxLength() {
    addToQueue();
}

function addToQueue() {
    possibilities = _.shuffle(possibilities);
    queue[queue.length] = possibilities[0];
    possibilities.splice(0, 1);
    updateUI();
}

function popFromQueue() {
    let removed = queue[0];
    queue.splice(0, 1);
    appendToLog("Fired off " + removed);
    addToQueue();
    possibilities[possibilities.length] = removed;
    updateUI();
}

function updateUI() {
    let possString = "";

    for (let i = 0; i < possibilities.length; i++) {
        possString += possibilities[i] + " ";
    }

    $("#possibilities").text("possibilities: " + possString);

    let queueString = "";

    for (let i = 0; i < queue.length; i++) {
        queueString += queue[i] + " ";
    }

    $("#queue").text("queue: " + queueString);
}

function appendToLog(message) {
    $("#log").append("<p>" + message + "</p>")
}
