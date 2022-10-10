(function() {
	
	var state = 1;
	var puzzle = document.getElementById('puzzle');

	decipher();
	
	// Listens to clicks on puzzle cells
	puzzle.addEventListener('click', function(e) {

		if(state == 1) {

			puzzle.className = 'animate';
			shiftCell(e.target);
		}
	});
	
	// Listens for click on control buttons
	document.getElementById('decipher').addEventListener('click', decipher);
	document.getElementById('scramble').addEventListener('click', scramble);

	
	function decipher() {
		
		if(state == 0) { return; }

		puzzle.innerHTML = '';
		var n = 1;

		for(var i = 0; i <= 3; i++) {

			for(var j = 0; j <= 3; j++) {

				var cell = document.createElement('span');
				cell.id = 'cell-' + i + '-' + j;
				cell.style.left = (j * 80 + 1 * j + 1) + 'px';
				cell.style.top  = (i * 80 + 1 * i + 1) + 'px';
				
				if(n <= 15) {

					cell.classList.add('number');
					cell.classList.add((i % 2 == 0 && j % 2 > 0 || i % 2 > 0 && j % 2 == 0) ? 'dark' : 'light');
					cell.innerHTML = (n++).toString();
				} 

				else { cell.className = 'empty'; }
				puzzle.appendChild(cell);
			}
		}
	}


	setInterval(() => {

		repoStars.classList.remove('vibrate');
		void repoStars.offsetWidth;
		repoStars.classList.add('vibrate');
	}, 90000);
	

	const playRules = document.getElementById('playing-rules');
	const infoPanel = document.getElementById('display-panel');
	const close = document.getElementsByClassName('close')[0];


	playRules.onclick = () => { infoPanel.style.display = 'block'; };
	close.onclick = () => { infoPanel.style.display = 'none'; };


	window.onclick = (event) => {

		if(event.target == infoPanel) {

			infoPanel.style.display = 'none';
			return false;
		}
	};
	

	setInterval(() => {

		playRules.classList.remove('vibrate');
		void playRules.offsetWidth;
		playRules.classList.add('vibrate');
	}, 30000)


	function shiftCell(cell) {
		
		if(cell.clasName != 'empty') {
			
			var emptyCell = getEmptyAdjacentCell(cell);
			
			if(emptyCell) {

				var temp = { style: cell.style.cssText, id: cell.id };
				
				// Exchanges id and style values
				cell.style.cssText = emptyCell.style.cssText;
				cell.id = emptyCell.id;
				emptyCell.style.cssText = temp.style;
				emptyCell.id = temp.id;
				
				if(state == 1) { setTimeout(checkOrder, 150); }
			}
		}
	}


	function getCell(row, col) { return document.getElementById('cell-' + row + '-' + col); }
	function getEmptyCell() { return puzzle.querySelector('.empty'); }
	

	function getEmptyAdjacentCell(cell) {
		
		var adjacent = getAdjacentCells(cell);
		
		for(var i = 0; i < adjacent.length; i++) {

			if(adjacent[i].className == 'empty') { 

				return adjacent[i]; 
			}
		}
		
		return false;
	}


	function getAdjacentCells(cell) {
		
		var id  = cell.id.split('-');
		var row = parseInt(id[1]);
		var col = parseInt(id[2]);
		var adjacent = [];
		
		// Gets all possible adjacent cells
		if(row < 3) { adjacent.push(getCell(row + 1, col)); }			
		if(row > 0) { adjacent.push(getCell(row - 1, col)); }
		if(col < 3) { adjacent.push(getCell(row, col + 1)); }
		if(col > 0) { adjacent.push(getCell(row, col - 1)); }
		return adjacent;
	}
	

	// Checks order of numbers
	function checkOrder() {
		
		// Checks if the empty cell is in correct position
		if(getCell(3, 3).className != 'empty') { return; }
		var n = 1;

		for(var i = 0; i <= 3; i++) {

			for(var j = 0; j <= 3; j++) {

				if(n <= 15 && getCell(i, j).innerHTML != n.toString()) { return; }
				n++;
			}
		}

		if(confirm('Congrats, You did it!! \nScramble the puzzle?')) { scramble(); }
	}


	function scramble() {
	
		if(state == 0) { return; }
		
		puzzle.removeAttribute('class');
		state = 0;
		var previousCell;
		var i = 1;
		var interval = setInterval(function() {

			if(i <= 100) {

				var adjacent = getAdjacentCells(getEmptyCell());

				if(previousCell) {

					for(var j = adjacent.length - 1; j >= 0; j--) {

						if(adjacent[j].innerHTML == previousCell.innerHTML) {

							adjacent.splice(j, 1);
						}
					}
				}

				// Gets random adjacent cells and memorizes it for the next iteration
				previousCell = adjacent[rand(0, adjacent.length - 1)];
				shiftCell(previousCell);
				i++;
			} 

			else {

				clearInterval(interval);
				state = 1;
			}

		}, 5);
	}
	
	// Generates random numbers
	function rand(from, to) { return Math.floor(Math.random() * (to - from + 1)) + from; }
}());
