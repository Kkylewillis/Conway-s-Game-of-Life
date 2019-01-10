let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight-70;
let c = canvas.getContext('2d');
let paused = false;

document.addEventListener("keydown", function(event) {
  if (event.code === "Space") {
    paused = !paused;
  }
});

document.addEventListener("click", function(event) {
  console.log(event);
  console.log(event.path[0].offsetTop);
  if (paused) {
  let x = event.screenX - event.screenX%10; 
  let y = event.screenY - event.screenY%10 - 100 - event.path[0].offsetTop; 
  c.fillRect(x,y,boxSize,boxSize);
  activeBoardCords = activeBoardCords.concat([[x, y]]);
  }
});


//conway's game of life
const onValue = 0; 
const boxSize = 10;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const boardWidth = Math.floor(window.innerWidth/boxSize);
const boardHeight = Math.floor(window.innerHeight/boxSize);

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

function drawBoard(cords){
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

//@ returns an array of min & max cords of active board  
function getActiveBoardCords(nextPop){
	let aliveCords = [];
	for(let x = 0; x < boardWidth; x += 1){
		for(let y = 0; y < boardHeight; y +=1){
			let xCord = x * boxSize;
			let yCord = y * boxSize;
			if (isAlive(xCord,yCord)) aliveCords.push([xCord,yCord]);	
			console.log("what is taking so long?");
		}
	}
return aliveCords;
}

function playGame() {
  requestAnimationFrame(playGame);
  if (!paused) {
 let newBoard = getNextBoard(activeBoardCords);
 c.clearRect(0,0,windowWidth,windowHeight);
 drawBoard(newBoard);
 activeBoardCords = newBoard;
  }
}

c.fillStyle = 'rgba(0,0,0,1)';
let offset = 100;
let offset2 = 200;
let offset3 = 300;
let testBoard = [[20+offset,0+offset],[20+offset,10+offset],[20+offset,20+offset],[10+offset,20+offset],[0+offset,10+offset]];
let testBoard2 = [[20+offset2,0+offset],[20+offset2,10+offset],[20+offset2,20+offset],[10+offset2,20+offset],[0+offset2,10+offset]];
let testBoard3 = [[20+offset3,0+offset],[20+offset3,10+offset],[20+offset3,20+offset],[10+offset3,20+offset],[0+offset3,10+offset]];
let testBoard4 = testBoard.concat(testBoard2);
testBoard4 = testBoard4.concat(testBoard3);
let activeBoardCords = drawBoard(testBoard4);
playGame();

