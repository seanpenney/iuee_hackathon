/*	The following disables scrolling through page with keys.
	Useful so user doesn't scroll through page when playing game*/
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

/* setup canvas and context */
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var string="Welcome to our game, click here to start"; // welcome text

context.font = '40pt Calibri';
context.fillStyle = 'blue';
context.textAlign = 'center';
context.fillText(string, (canvas.width/2), (canvas.height/2)); // write welcome

// Load images
// Background Images
var bgReady1 = false;
var bgImage1 = new Image();
bgImage1.onload = function(){
	bgReady1=true;
}
bgImage1.src="img/background1.jpg";

var bgReady2 = false;
var bgImage2 = new Image();
bgImage2.onload = function(){
	bgReady2=true;
}
bgImage2.src="img/background2.jpg";

var bgReady3 = false;
var bgImage3 = new Image();
bgImage3.onload = function(){
	bgReady3=true;
}
bgImage3.src="img/background3.jpg";

// Trivia Background Image
var wheatReady = false;
var wheatImage = new Image();
wheatImage.onload = function(){
	wheatReady=true;
}
wheatImage.src="img/wheatbackground.png";
	
// cow Image
var cowReady = false;
var cowImage = new Image();
cowImage.onload = function(){
	cowReady = true;
}
cowImage.src="img/cowsprite.png";
cowStep = 0;
cowMax = 2;

// evil farmer Image
var evilReady = false;
var evilImage = new Image();
evilImage.onload = function(){
	evilReady = true;
}
evilImage.src="img/evilfarmersprite.png";
evilStep = 0;
evilMax = 1;

// zombie cow Image
var zombieReady = false;
var zombieImage = new Image();
zombieImage.onload = function(){
	zombieReady = true;
}
zombieImage.src="img/zombiecowsprite.png";
zombieStep = 0;
zombieMax = 2;

// mud terrain Image
var mudReady = false;
var mudImage = new Image();
mudImage.onload = function(){
	mudReady = true;
}
mudImage.src="img/mudpatch.png";

// tire terrain Image
var tireReady = false;
var tireImage = new Image();
tireImage.onload = function(){
	tireReady = true;
}
tireImage.src="img/tire.png";

// Trivia esponse Images
var aReady = false;
var aImage = new Image();
aImage.onload = function(){
	aReady=true;
}
aImage.src="img/answerA.png";

var bReady = false;
var bImage = new Image();
bImage.onload = function(){
	bReady=true;
}
bImage.src="img/answerB.png";

var cReady = false;
var cImage = new Image();
cImage.onload = function(){
	cReady=true;
}
cImage.src="img/answerC.png";
	
// Game objects
var cow = {
	speed: 192, // pixels per second
	x: 0, // x coord
	y: 0 // y coord
};

var evil = { // evil farmer
	speed: 40, // pixels per second
	x: 0,
	y: 0
};

var zombie = {
	speed: 40, // pixels per second
	x: 0,
	y: 0
};

var terrain1 ={
	x: 300,
	y: 250
}

var terrain2 = {
	x: 550,
	y: 50
}

var responseA = {
	x:	800,
	y: 25
}
var responseB = {
	x:	800,
	y: 150
}
var responseC = {
	x:	800,
	y: 275
}

var keysDown = {}; // array to determine which keys are pressed
var then; // variable for game, used to calculate time
var refreshIntervalId; // variable for game, used for interval functions
var refreshIntervalIdTrivia; // interval for trivia part
var levelNum = 1; // current level
var username;

canvas.addEventListener('mousedown',startGame); // when mouse clicked, goto startGame

function startGame() {
	this.removeEventListener('mousedown',arguments.callee,false); // remove eventlistener
	clearCanvas(); // clear everything on canvas
	setupGame(); // load game
}

function clearCanvas() {
	// Store the current transformation matrix
	context.save();

	// Use the identity matrix while clearing the canvas
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Restore the transform
	context.restore();
}

function setupGame() {
	//Keyboard controls
	addEventListener("keydown", function(e){
		keysDown[e.keyCode]=true;
	}, false);

	addEventListener("keyup", function(e){
		delete keysDown[e.keyCode];
	}, false);
	
	play();
}

//Draw
function render() {
	// adjust coords if character goes off canvas
	if ((cow.x > 880) || (cow.x < 0) || (cow.y > 380) || (cow.y) < 0) {
		adjustCharacter(cow);
	}
	if ((evil.x > 880) || (evil.x < 0) || (evil.y > 380) || (evil.y < 0)) {
		adjustCharacter(evil);
	}
	if ((zombie.x > 880) || (zombie.x < 0) || (zombie.y > 380) || (zombie.y < 0)) {
		adjustCharacter(zombie);
	}
	
	if (levelNum == 1) { // determine which background to use, based off the level
		if(bgReady1){
			context.drawImage(bgImage1,0,0);
		}
	}
	else if (levelNum == 2) {
		if(bgReady2){
			context.drawImage(bgImage2,0,0);
		}
	}
	else {
		if(bgReady3){
			context.drawImage(bgImage3,0,0);
		}
	}
	
	if (levelNum < 3) { // determine whether to use mud or tire obstacles
		if(mudReady){
			context.drawImage(mudImage,terrain1.x,terrain1.y);
			context.drawImage(mudImage,terrain2.x,terrain2.y);
		}
	} else {
		if(tireReady) {
			context.drawImage(tireImage,terrain1.x,terrain1.y);
			context.drawImage(tireImage,terrain2.x,terrain2.y);
		}
	}
	
	if(cowReady){
		/* parameters for sprite images: handle, xsprite, ysprite, spritewidth, spriteheight,
		xpos, ypos, scalewidth, scaleheight*/
		context.drawImage(cowImage, 80 * cowStep, 0, 80, 80, cow.x,cow.y, 80, 80);
	}
	if(evilReady){
		context.drawImage(evilImage, 80 * evilStep, 0, 80, 80, evil.x,evil.y, 80, 80);
	}
	if(zombieReady){
		context.drawImage(zombieImage, 80 * zombieStep, 0, 80, 80, zombie.x,zombie.y, 80, 80);
	}
		
	// Display level
	context.fillStyle = "rgb(250, 250,250)";
	context.font = "24px Helvetica";
	context.textAlign = "left";
	context.textBaseline = "top"
	context.fillText("Level: " + levelNum, 150,50);
}
 /* reset coords for characters */	
function reset() {
	cow.x = 0;
	cow.y = 0;

	evil.x = 80 + (Math.random() * (canvas.width -160)); // random, make sure to not overlap with cow
	evil.y = 80 + (Math.random() * (canvas.height -160));
	
	zombie.x = 80 + (Math.random() * (canvas.width -160));
	zombie.y = 80 + (Math.random() * (canvas.height -160));
}

function updateCow(modifier, notTrivia) {
	var inTerrain = false;
	var terrainModifier = 1;
	
	if (notTrivia) {
		// lower speed if on obstacle
		if (checkCollisionCowObject(cow, terrain1)) {
			inTerrain = true;
		}
		else if (checkCollisionCowObject(cow, terrain2)) {
			inTerrain = true;
		}
	}
	if (inTerrain) {
		terrainModifier = 2;
	}
	
	if (38 in keysDown) { //up key
		cow.y -= (cow.speed / terrainModifier) * modifier;
	}
	if (40 in keysDown){
		//down key
		cow.y += (cow.speed / terrainModifier) * modifier;
	}
	if (37 in keysDown) {
		//left key
		cow.x -= (cow.speed / terrainModifier) * modifier;
	}
	if (39 in keysDown) {
		//right key
		cow.x += (cow.speed / terrainModifier) * modifier;
	}
	
	//update sprite for cow
	cowStep += 1;
	if (cowStep > cowMax) {
		cowStep = 0;
	}
}
	
function main() {
	var now = Date.now();
	var delta = now - then; // time difference
	
	render();
	
	then = now;
	
	moveEnemies((delta / 1000), evil); // update enemy coords
	moveEnemies((delta / 1000), zombie); // update enemy coords
	
	// update enemy sprites
	evilStep += 1;
	if (evilStep > evilMax) {
		evilStep = 0;
	}
	zombieStep += 1;
	if (zombieStep > zombieMax) {
		zombieStep = 0;
	}
	
	updateCow((delta / 1000), true); // update cow coords/sprite
	
	checkWinner();
	
	if(checkCollisionCowObject(cow, evil)){
		lostGame();
	}
	if(checkCollisionCowObject(cow, zombie)){
		lostGame();
	}
}
	
function play() {
	reset();
	then = Date.now();
	refreshIntervalId = setInterval(main, 45);
}
 /* setup trivia mode to let user redeem themselves */	
function lostGame() {
	document.getElementById("cow_moo").play();
	clearInterval(refreshIntervalId);
	clearCanvas();
	alert("collision with enemy, health quiz time!");
	delete keysDown[37];
	delete keysDown[38];
	delete keysDown[39];
	delete keysDown[40];
	reset();
	
	// questions to ask in trivia game
	var question1 = {
		q: "What is a GMO?",
		a: "A: General Mark Operations",
		b: "B: Genetically Modified Organism",
		c: "C: stage in the rain Cycle",
		answer: "b"
	}
	var question2 = {
		q: "What percent of processed foods contain GMOs?",
		a: "A: 20",
		b: "B: 50",
		c: "C: 80",
		answer: "c"
	}
	var question3 = {
		q: "How many countries have banned GMOs?",
		a: "A: 12",
		b: "B: 37",
		c: "C: 61",
		answer: "c"
	}
	var question4 = {
		q: "What sort of pesticides exist in GMO crops and plants?",
		a: "A: Freezing",
		b: "B: Super",
		c: "C: Toxic",
		answer: "c"
	}
	var question5 = {
		q: "Is it possible for GMOs to mutate bugs?",
		a: "A: Yes",
		b: "B: No",
		c: "C: Don't know",
		answer: "a"
	}
	// setup which health question user will be asked
	var randomNum = Math.floor(1 + (Math.random() * 5)); // random num 1 through 5
	then = Date.now();
	if (randomNum == 1) {
		refreshIntervalIdTrivia = setInterval(function() {runTrivia(question1);}, 45);
	}
	else if (randomNum == 2) {
		refreshIntervalIdTrivia = setInterval(function() {runTrivia(question2);}, 45);
	}
	else if (randomNum == 3) {
		refreshIntervalIdTrivia = setInterval(function() {runTrivia(question3);}, 45);
	}
	else if (randomNum == 4) {
		refreshIntervalIdTrivia = setInterval(function() {runTrivia(question4);}, 45);
	}
	else if (randomNum == 5) {
		refreshIntervalIdTrivia = setInterval(function() {runTrivia(question5);}, 45);
	}
}

function wonLevel() {
	clearInterval(refreshIntervalId);
	clearCanvas();
	levelNum++
	delete keysDown[37];
	delete keysDown[38];
	delete keysDown[39];
	delete keysDown[40];
	play();
}

// if character went off canvas
function adjustCharacter(character) {
	if (character.x > 880) {
		character.x = 880;
	}
	if (character.x < 0) {
		character.x = 0;
	}
	if (character.y > 380) {
		character.y = 380;
	}
	if (character.y < 0) {
		character.y = 0;
	}
}

function moveEnemies(modifier, enemy) {
	// move enemies
	if (cow.x < enemy.x) {
		enemy.x -= (enemy.speed + (levelNum * 3)) * modifier;
	}
	if (cow.x > enemy.x) {
		enemy.x += (enemy.speed + (levelNum * 3)) * modifier;
	}
	if (cow.y > enemy.y) {
		enemy.y += (enemy.speed + (levelNum * 3)) * modifier;
	}
	if(cow.y < enemy.y) {
		enemy.y -= (enemy.speed + (levelNum * 3)) * modifier;
	}
}

function checkCollisionCowObject(cow, object) {
	if(
		cow.x <= (object.x +60)
		&& object.x <= (cow.x+60)
		&& cow.y <= (object.y +60)
		&& object.y <= (cow.y + 60)
		){
			return true;
		}
		return false;
}

function checkWinner() {
	// check for winner
	if (cow.x >= 880 && cow.x <= 960) {
		wonLevel();
	}
}

function runTrivia(question) {
	var now = Date.now();
	var delta = now - then;

	renderTrivia(question);
	then = now;
	updateCow((delta / 1000), false); // update cow coords
	if (checkCollisionCowObject(cow, responseA)) {
		clearInterval(refreshIntervalIdTrivia);
		clearCanvas();
		delete keysDown[37];
		delete keysDown[38];
		delete keysDown[39];
		delete keysDown[40];
		if (question.answer == 'a') {
			alert("Correct! Resuming on current level");
			play();
		}
		else {
			username = prompt("Wrong answer, enter your name to record score", "name");
			updateHiscore();
			levelNum = 1;
			play();
		}
	}
	else if (checkCollisionCowObject(cow, responseB)) {
		clearInterval(refreshIntervalIdTrivia);
		clearCanvas();
		delete keysDown[37];
		delete keysDown[38];
		delete keysDown[39];
		delete keysDown[40];
		if (question.answer == 'b') {
			alert("Correct! Resuming on current level");
			play();
		}
		else {
			username = prompt("Wrong answer, enter your name to record score", "name");
			updateHiscore();
			levelNum = 1;
			play();
		}
	}
	else if (checkCollisionCowObject(cow, responseC)) {
		clearInterval(refreshIntervalIdTrivia);
		clearCanvas();
		delete keysDown[37];
		delete keysDown[38];
		delete keysDown[39];
		delete keysDown[40];
		if (question.answer == 'c') {
			alert("Correct! Resuming on current level");
			play();
		}
		else {
			username = prompt("Wrong answer, enter your name to record score", "name");
			updateHiscore();
			levelNum = 1;
			play();
		}
	}
}

//Draw for trivia game
function renderTrivia(question) {
	// adjust coords if image goes off canvas
	if ((cow.x > 880) || (cow.x < 0) || (cow.y > 380) || (cow.y) < 0) {
		adjustCharacter(cow);
	}
	
	if(wheatReady){
		context.drawImage(wheatImage,0,0);
	}
	if(aReady){
		context.drawImage(aImage,responseA.x,responseA.y);
	}
	if(bReady){
		context.drawImage(bImage,responseB.x,responseB.y);
	}
	if(cReady){
		context.drawImage(cImage,responseC.x,responseC.y);
	}
	if(cowReady){
		context.drawImage(cowImage, 80 * cowStep, 0, 80, 80, cow.x,cow.y, 80, 80);
	}
	
	// Display question + answers
	context.fillStyle = "rgb(000, 000,000)";
	context.font = "900 26px Arial";
	context.textAlign = "left";
	context.textBaseline = "top"
	context.fillText(question.q, 150,50);
	context.fillText(question.a, 150, 100);
	context.fillText(question.b, 150, 150);
	context.fillText(question.c, 150, 200);
}

/* jquery to set hi scores after user looses */
function updateHiscore() {
	$.post(
			"updatescore.php",
			{score: levelNum,
			username: username,
			});
}