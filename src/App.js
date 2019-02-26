import React, { Component } from 'react';

const totalBoardRows = 40;
const totalBoardColumns = 50;

const newBoardStatus = (cellStatus = () => Math.random() < 0.25) => {
	const grid = [];
	for (let r = 0; r < totalBoardRows; r++) {
		grid[r] = [];
		for (let c = 0; c < totalBoardColumns; c++) {
			grid[r][c] = cellStatus();
		}
	}
	return grid;
};

const BoardGrid = ({ boardStatus, onToggleCellStatus }) => {
	function handleClick(r,c) {
		onToggleCellStatus(r,c);
	}

	const tr = [];
	for (let r = 0; r < totalBoardRows; r++) {
  		const td = [];
  		for (let c = 0; c < totalBoardColumns; c++) {
    		td.push(
		        <td
		        	key={`${r},${c}`}
					className={boardStatus[r][c] ? 'alive' : 'dead'}
					onClick={() => handleClick(r,c)}
				/>
    		);
  		}
  		tr.push(<tr key={r}>{td}</tr>);
	}
	return <table><tbody>{tr}</tbody></table>;
};

class App extends Component {
	state = {
		boardStatus: newBoardStatus(),
		gameRunning: false
	}

	handleNewBoard = () => {
		this.setState(prevState => ({boardStatus: newBoardStatus()}));
	}

	handleClearBoard = () => {
		this.setState(prevState => ({boardStatus: newBoardStatus(() => false)}));
	}

	toggleCellStatus = (r,c) => {
	    const toggleBoardStatus = prevState => {
	    	const tempBoardStatus = [...prevState.boardStatus]
	    	tempBoardStatus[r][c] = !tempBoardStatus[r][c];
	    	return tempBoardStatus;
	    };

		this.setState(prevState => ({boardStatus: toggleBoardStatus(prevState)}));
	}

	handleStart = () => {
		/*  Prevent user from starting more than 1 timer simultaneously */
		if (this.timerID) return;

		this.timerID = setInterval(() => {
			const { boardStatus } = this.state;

			/* Must deep clone boardStatus to avoid modifying it by reference when updating newBoardStatus.
			Can't do `const newBoardStatus = [...boardStatus]` 
			because Spread syntax effectively goes one level deep while copying an array. 
			Therefore, it may be unsuitable for copying multidimensional arrays.
			Note: JSON.parse(JSON.stringify(oldObject)) doesn't work if the cloned object uses functions */
			const newBoardStatus = JSON.parse(JSON.stringify(boardStatus));

			for (let r = 0; r < totalBoardRows; r++) {
				for (let c = 0; c < totalBoardColumns; c++) { 
					let trueNeighbors = 0;
    				const neighbors = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    				neighbors.forEach(neighbor => {
    					const x = r + neighbor[0];
    					const y = c + neighbor[1];
    					const isNeighborOnBoard = (x >= 0 && x < totalBoardRows && y >= 0 && y < totalBoardColumns);
    					/* No need to count more than 4 alive neighbors */
    					if (trueNeighbors < 4 && isNeighborOnBoard && boardStatus[x][y]) {
	    					trueNeighbors++;
	    				}
    				})

					if (!boardStatus[r][c]) {
						if (trueNeighbors === 3) newBoardStatus[r][c] = true;
					} else {
						if (trueNeighbors < 2 || trueNeighbors > 3) newBoardStatus[r][c] = false;
					}
				}
			}
			this.setState(prevState => ({
				boardStatus: newBoardStatus,
				gameRunning: true
			}));
		}, 1000);
	}

	handleStop = () => {
		clearInterval(this.timerID);
		/* Remove this.timerID value so a timer can be restarted */
		this.timerID = undefined;
		this.setState(prevState => ({gameRunning: false}));
	}

	startStopButton = () => {
		return this.state.gameRunning ?
		<button type='button' onClick={this.handleStop}>Stop</button> :
		<button type='button' onClick={this.handleStart}>Start</button>;
	}

	render() {
		const { boardStatus } = this.state;

    	return (
    		<div>
    			<h2>Game of Life</h2>
    			<BoardGrid
    				boardStatus={boardStatus}
    				onToggleCellStatus={this.toggleCellStatus}
    			/>
	      		<button type='button' onClick={this.handleNewBoard}>New Board</button>
	      		<button type='button' onClick={this.handleClearBoard}>Clear Board</button>
	      		{this.startStopButton()}
      		</div>
    	);
  	}
}

export default App;