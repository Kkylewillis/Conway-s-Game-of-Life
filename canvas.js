let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext('2d');
let isPaused = false;

//conway's game of life
const onValue = 0; 
const boxSize = 10;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const boardWidth = Math.floor(window.innerWidth/boxSize);
const boardHeight = Math.floor(window.innerHeight/boxSize);
console.log("The boardWidth is " + boardWidth + ".");
console.log("The boardHeight is " + boardHeight + ".");
console.log(Math.floor(3/2));

function setInitialCondition1(){
let aliveCords = [];
c.fillRect(0,0,boxSize,boxSize);
aliveCords.push([0,0]);
c.fillRect(0,10,boxSize,boxSize);
aliveCords.push([0,10]);
c.fillRect(10,10,boxSize,boxSize);
aliveCords.push([10,10]);
c.fillRect(10,0,boxSize,boxSize);
aliveCords.push([10,0]);
return aliveCords;
}

function glider(x,y){
	let glider = [[20+x,0+y],[20+x,10+y],[20+x,20+y],[10+x,20+y],[0+x,10+y]];
	return glider;
}

function square(x,y){
return [[0+x,0+y],[0+x,10+y],[10+x,0+y],[10+x,10+y]];
}

function doubleArrow(x,y){
return [[10+x,0+y],[20+x,0+y],[0+x,10+y],[20+x,10+y],[0+x,20+y],[10+x,20+y]];
}

function upsideDownGlider(x,y){
	return [[0+x,0+y],[10+x,0+y],[0+x,10+y],[20+x,10+y],[0+x,20+y]];
}

function sidewaysGlider(x,y){
	return [[0+x,0+y],[10+x,0+y],[20+x,0+y],[0+x,10+y],[10+x,20+y]];
}

function failedGliderGunButAwesome(x,y){
	let gliderGun = square(0+x,20+y).concat(doubleArrow(80+x,20+y)).concat(upsideDownGlider(160+x,40+y)).concat(doubleArrow(220+x,0+y)).concat(sidewaysGlider(240+x,120+y)).concat(square(340+x,0+y)).concat(upsideDownGlider(350+x,80+y));
	return gliderGun;
}

function GliderGun(x,y){
	let gliderGun = square(0+x,20+y).concat(doubleArrow(80+x,20+y)).concat(upsideDownGlider(160+x,40+y)).concat(doubleArrow(220+x,0+y)).concat(sidewaysGlider(240+x,120+y)).concat(square(340+x,0+y)).concat(upsideDownGlider(350+x,70+y));
	return gliderGun;
}

function drawBoard (cords){
let aliveCords = [];
for (i =0; i<cords.length; i +=1){
	x = cords[i][0];
	y = cords[i][1];
	c.fillRect(x,y,boxSize,boxSize);
	aliveCords.push([x,y]);
}
return aliveCords;
}

function clearBoard () {
	c.fillStyle = 'rgba(255,255,255,1)'
	for (x=0; x<windowWidth;x += boxSize){
		for (y=0; y<windowHeight; y += boxSize){
			c.fillRect(x,y,boxSize,boxSize)
		}
	}
	c.fillStyle = 'rgba(0,0,0,1)';
}

function isAlive(x,y) {
	if (c.getImageData(x,y,1,1).data[2] === onValue && c.getImageData(x,y,1,1).data[3] !== 0){
		return true;
	}
	return false;
}

function checkNeighbors(x,y) {
	let numAlive = 0;
	//top row
	if (x-boxSize >= 0 && y-boxSize >= 0){
		if (isAlive(x-boxSize,y-boxSize)) numAlive += 1;
	}
	if (y-boxSize >= 0){
		if (isAlive(x,y-boxSize)) numAlive += 1;
	}
	if (x+boxSize < windowWidth && y-boxSize >= 0){
		if (isAlive(x+boxSize,y-boxSize)) numAlive += 1;
	}
	//right side
	if (x+boxSize < windowWidth){
		if (isAlive(x+boxSize,y)) numAlive  += 1;
	}
	if (x+boxSize < windowWidth && y+boxSize < windowHeight){
		if (isAlive(x+boxSize,y+boxSize)) numAlive += 1;
	}
	//bottom
	if (y+boxSize < windowHeight){ 
		if (isAlive(x,y+boxSize)) numAlive += 1;
	}
	//left side 
	if (x-boxSize >= 0){
		if(isAlive(x-boxSize,y)) numAlive += 1;
	}
	if (x-boxSize >= 0 && y+boxSize < windowHeight){
		if(isAlive(x-boxSize,y+boxSize)) numAlive += 1;
	}

	return numAlive;
}

function survives(x,y) {
	let numNeighbors = checkNeighbors(x,y);
    if ((numNeighbors === 2 || numNeighbors === 3) && isAlive(x,y)) return true;
	return false;
}

function isBorn(x,y) {
	let numNeighbors = checkNeighbors(x,y);

	if (numNeighbors === 3 && !isAlive(x,y)) return true;
	return false;
}

function getInitialConditions(){

}

function getSurroundingCords(x,y) {
let surroundingCords = [];
if(y-boxSize >= 0) {
	if (x-boxSize >= 0) surroundingCords.push([x-boxSize,y-boxSize]);
	surroundingCords.push([x,y-boxSize]);
	if (x+boxSize < windowWidth) surroundingCords.push([x+boxSize,y-boxSize]);
}

if (x+boxSize < windowWidth){
	surroundingCords.push([x+boxSize,y]);
	if (y+boxSize < windowHeight) surroundingCords.push([x+boxSize,y+boxSize]);
}

if (y+boxSize < windowHeight) surroundingCords.push([x, y+boxSize]);

if (x-boxSize >= 0){
	surroundingCords.push([x-boxSize,y]);
	if (y+boxSize < windowHeight) surroundingCords.push([x-boxSize, y+boxSize]);
}
return surroundingCords;
}


function getUnique (cords){
	let uniqueCords = [];

	for (let indexOuter = 0; indexOuter < cords.length; indexOuter += 1) {
		let notUnique = false;
		let x = cords[indexOuter][0];
		let y = cords[indexOuter][1];
		for (let indexInner = 0; indexInner < uniqueCords.length; indexInner += 1){
			if (uniqueCords[indexInner][0] === x && uniqueCords[indexInner][1] === y){
				notUnique = true;
			}
		}
		if (!notUnique) uniqueCords.push([x,y]);  
 	}
 	return uniqueCords;
}


function getCordsToBeChecked (activeBoardCords) {
	let cordsToBeChecked = activeBoardCords; 
	let cordsLength = activeBoardCords.length;
	for(let cordIndex = 0; cordIndex < cordsLength; cordIndex += 1){
		let x = activeBoardCords[cordIndex][0];
		let y = activeBoardCords[cordIndex][1];
		surroundingCords = getSurroundingCords(x,y);
		//filter for unique
		cordsToBeChecked= cordsToBeChecked.concat(surroundingCords);
	}
	cordsToBeChecked = getUnique(cordsToBeChecked);
return cordsToBeChecked;
}
//@returns array of corrdinates of next turns population
function getNextBoard (activeBoardCords) {
	//nextPop
	cordsToBeChecked = getCordsToBeChecked(activeBoardCords);
	nextActiveBoardCords = [];
	for(let cordIndex = 0; cordIndex < cordsToBeChecked.length; cordIndex++){
		let x = cordsToBeChecked[cordIndex][0];
		let y = cordsToBeChecked[cordIndex][1];
		if (survives(x,y) || isBorn(x,y)) nextActiveBoardCords.push([x,y]);  
	}
return nextActiveBoardCords;
}

function pause(req) {
	cancelAnimationFrame(req);
}

function playGame() {
	req = requestAnimationFrame(playGame);
	if (isPaused) {
		pause(req);
	}
  let newBoard = getNextBoard(activeBoardCords);
  c.clearRect(0,0,windowWidth,windowHeight);
	drawBoard(newBoard);
	activeBoardCords = newBoard;
}

window.onkeydown = () => {
		isPaused = !isPaused; // flips the pause state
		if (!isPaused) {
			playGame();
		}
};

c.fillStyle = 'rgba(0,0,0,1)';



let activeBoardCords = drawBoard(GliderGun(400,300));
playGame();

