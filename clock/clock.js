"use strict"

function getNewCard(deck) {
	var cardNumber = -1;
	
	while (deck[cardNumber] === 0 || cardNumber === -1) {
		cardNumber = Math.floor(Math.random() * 13);
	}
	
	return cardNumber;
}

function setUpNewGame() {
	var deck = [];

	for (var i = 0; i < 13; i++) {
		deck[i] = 4; //four cards of each rank
	}

	var piles = [[],[],[],[],[],[],[],[],[],[],[],[],[]];

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 13; j++) {
			var cardNumber = getNewCard(deck);
			deck[cardNumber]--;
			piles[j].push(cardNumber);
		}
	}
	
	return piles;
}

function simulateGame() {
	var piles = setUpNewGame();
	var unalteredPiles = JSON.parse(JSON.stringify(piles));
	
	var cardsFlipped = 0;
	var nextCard = 12; //0 indexed, J = 10, Q = 11, K = 12
	var gameOver = false;
	var chain = "12";
	
	while (!gameOver) {
		if (piles[nextCard].length === 0) {
			gameOver = true;
			chain += " END";
		}
		else {
			cardsFlipped++;
			nextCard = piles[nextCard].pop();
			chain += " -> " + nextCard;
		}
	}
	
	return {
		gameWon: cardsFlipped === 52,
		cardsFlipped: cardsFlipped,
		piles: unalteredPiles,
		chain: chain
	}
}

function runTrials(trials) {
	var cardsFlipped = 0;
	var gamesWon = 0;
	var minCardsFlipped = 53;
	var maxCardsFlipped = 0;
	
	var minimumGame = "";
	var worstChain = "";
	
	for (var i = 0; i < trials; i++) {
		var result = simulateGame();
		cardsFlipped += result.cardsFlipped;
		
		if (result.cardsFlipped < minCardsFlipped) {
			minCardsFlipped = result.cardsFlipped;
			minimumGame = JSON.parse(JSON.stringify(result.piles));
			worstChain = result.chain;
		}
		
		if (result.cardsFlipped > maxCardsFlipped) {
			maxCardsFlipped = result.cardsFlipped;
		}
		
		if (result.gameWon) {
			gamesWon++;
		}
	}
	
	console.log("Trials run: " + trials);
	console.log("Games won: " + gamesWon);
	console.log("Average cards flipped: " + cardsFlipped/trials);
	console.log("Minimum cards flipped: " + minCardsFlipped);
	console.log("Maximum cards flipped: " + maxCardsFlipped);
	console.log("Worst Game Chain: " + worstChain);
	
	return minimumGame;
}

console.log("Run with runTrials(trials)");
console.log("Sample run:");
runTrials(1000);
