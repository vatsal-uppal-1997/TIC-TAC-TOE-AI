const net = new brain.NeuralNetwork();

let turn = "P1";
let value = 1;

let shadowMatrix = [[-1, -1, -1],[-1, -1, -1], [-1, -1, -1]]
let winningSamples = []

let machinePlay = false;

function machine() {
	machinePlay = true;
}

function clearAll() {
	console.log("called");
	for (let i=1; i<=9; i++) 
		document.getElementById("box-"+i).innerHTML = "";
	shadowMatrix = [[-1, -1, -1],[-1, -1, -1], [-1, -1, -1]];
	turn = "P1";
	value = 1;
}

function getIndexes(of) {
	input = [0,0,0,0,0,0,0,0,0];
	output = [0,0,0,0,0,0,0,0,0];
	traverse = [...shadowMatrix[0], ...shadowMatrix[1], ...shadowMatrix[2]];
	for (let i=0; i < traverse.length; i++) {
		if (traverse[i] === 1)
			input[i] = 1;
		else if (traverse[i] === 0) 
			output[i] = 1;
	}
	return {input, output};
}

function scanWinner() {
	if (shadowMatrix[0][0] === shadowMatrix[1][1] &&
	    shadowMatrix[1][1] === shadowMatrix[2][2])
		return shadowMatrix[0][0];
	else if (shadowMatrix[0][2] === shadowMatrix[1][1] &&
		 shadowMatrix[2][0] === shadowMatrix[1][1])
		return shadowMatrix[0][2];
	
	for (let i=0; i<3; i++) {
		if (shadowMatrix[i][0] === shadowMatrix[i][1] &&
		    shadowMatrix[i][1] === shadowMatrix[i][2])
			return shadowMatrix[i][0];
		if (shadowMatrix[0][i] === shadowMatrix[1][i] &&
		    shadowMatrix[1][i] === shadowMatrix[2][i])
			return shadowMatrix[0][i];
	}

	return false;		
}
function select(id) {
	let element = undefined;
	let idx = undefined;
	const turnElement = document.getElementById("turn");
	if (id === "skip") {
		element = { innerText: "" };
	} else {
		element = document.getElementById(id);
		idx = id.split("-")[1];
	}
	if (element.innerText !== "")
		return false;
	else {
		element.innerText = value;
		if (idx >= 1 && idx <= 3) 
			shadowMatrix[0][idx-1] = value;
		else if (idx >= 4 && idx <= 6)
			shadowMatrix[1][(idx-1)%3] = value;
		else
			shadowMatrix[2][(idx-1)%3] = value;
		console.log(shadowMatrix);
		let winner = scanWinner();
		if (winner !== -1 && winner !== false) {
			if (winner === 0) {
				turnElement.innerText = "Player 2 is the winner";
				winningSamples.push(getIndexes("box-1"));
				net.train(winningSamples);
			} else {
				turnElement.innerText = "Player 1 is the winner";
			}
			if (turn === "P1") {
				turn = "P2";
				value = 0;
			} else {
				turn = "P1";
				value = 1;
			}
		} else if (turn === "P1") {
			turn = "P2";
			value = 0;
			if (machinePlay) {
				turnElement.innerText = "Machine's Turn";
				return select("skip");
			} else {
				turnElement.innerText = "Player 2's Turn";
			}
		} else {
			if (!machinePlay) {
				turn = "P1";
				turnElement.innerText = "Player 1's Turn";
				value = 1;
			} else {
				turn = "P1";
				turnElement.innerText = "Player 1's Turn";
				value = 1;
				let moves = net.run([...shadowMatrix[0],
						     ...shadowMatrix[1],
					             ...shadowMatrix[2]]);
				moves = Array.from(moves);
				let idx = moves.indexOf(Math.max(...moves));
				let element = document.getElementById("box-"+(idx+1));
				while (element.innerText !== "") {
					moves.splice(idx, 1);
					idx = moves.indexOf(Math.max(...moves));
					element = document.getElementById("box-"+(idx+1));
				}
				idx = idx+1;
				console.log("the index is ", idx);
				if (idx >= 1 && idx <= 3) 
					shadowMatrix[0][idx-1] = value;
				else if (idx >= 4 && idx <= 6)
					shadowMatrix[1][(idx-1)%3] = value;
				else
					shadowMatrix[2][(idx-1)%3] = value;
				element.innerText = "0";
			}
		}
		return true;
	}
}

console.log(net);
