import React, { Component } from 'react';

const totalBoardRows = 40;
const totalBoardColumns = 60;

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

const Slider = ({ speed, onSpeedChange }) => {
	function handleChange(e) {
		onSpeedChange(e.target.value)
	}

	return (
		<input
			type='range'
			name='slider'
			min='50'
			max='1000'
			step='50'
			value={speed}
			onChange={handleChange} />
	);
}

class App extends Component {
	state = {
		boardStatus: newBoardStatus(),
		generation: 0,
		isGameRunning: false,
		speed: 500
	}

	handleNewBoard = () => {
		this.setState(prevState => ({
			boardStatus: newBoardStatus(),
			generation: 0
		}));
	}

	handleClearBoard = () => {
		this.setState(prevState => ({
			boardStatus: newBoardStatus(() => false),
			generation: 0
		}));
	}

	toggleCellStatus = (r,c) => {
	    const toggleBoardStatus = prevState => {
	    	const tempBoardStatus = [...prevState.boardStatus]
	    	tempBoardStatus[r][c] = !tempBoardStatus[r][c];
	    	return tempBoardStatus;
	    };

		this.setState(prevState => ({
			boardStatus: toggleBoardStatus(prevState)
		}));
	}

	handleStep = () => {
		const { boardStatus } = this.state;

		/* Must deep clone boardStatus to avoid modifying it by reference when updating clonedBoardStatus.
		Can't do `const clonedBoardStatus = [...boardStatus]`
		because Spread syntax effectively goes one level deep while copying an array. 
		Therefore, it may be unsuitable for copying multidimensional arrays.
		Note: JSON.parse(JSON.stringify(obj)) doesn't work if the cloned object uses functions */
		const clonedBoardStatus = JSON.parse(JSON.stringify(boardStatus));

		const amountTrueNeighbors = (r,c) => {
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
			return trueNeighbors;
		};

		for (let r = 0; r < totalBoardRows; r++) {
			for (let c = 0; c < totalBoardColumns; c++) {
				const totalTrueNeighbors = amountTrueNeighbors(r,c);

				if (!boardStatus[r][c]) {
					if (totalTrueNeighbors === 3) clonedBoardStatus[r][c] = true;
				} else {
					if (totalTrueNeighbors < 2 || totalTrueNeighbors > 3) clonedBoardStatus[r][c] = false;
				}
			}
		}

		this.setState(prevState => ({
			boardStatus: clonedBoardStatus,
			generation: prevState.generation + 1
		}));
	}

	componentDidUpdate(prevProps, prevState) {
		const { isGameRunning, speed } = this.state;

		if (isGameRunning && prevState.speed !== speed) {
			clearInterval(this.timerID);
			this.timerID = setInterval(() => {this.handleStep()}, speed);
		}
	}

	handleRun = () => {
		/*  Prevent user from starting more than 1 timer simultaneously */
		if (this.timerID) return;
		this.timerID = setInterval(() => {this.handleStep()}, this.state.speed);
		this.setState(prevState => ({isGameRunning: true}));
	}

	handleStop = () => {
		clearInterval(this.timerID);
		/* Remove this.timerID value so a timer can be restarted */
		this.timerID = undefined;
		this.setState(prevState => ({isGameRunning: false}));
	}

	runStopButton = () => {
		return this.state.isGameRunning ?
		<button type='button' onClick={this.handleStop}>Stop</button> :
		<button type='button' onClick={this.handleRun}>Run</button>;
	}

	speedChange = newSpeed => {
		this.setState(prevState => ({speed: newSpeed}));
	}

	render() {
		const { boardStatus, isGameRunning, generation, speed } = this.state;

    	return (
    		<div>
    			<h2>Game of Life</h2>
    			<BoardGrid boardStatus={boardStatus} onToggleCellStatus={this.toggleCellStatus} />
	      		<button type='button' onClick={this.handleNewBoard}>New Board</button>
	      		<button type='button' onClick={this.handleClearBoard}>Clear Board</button>
	      		{this.runStopButton()}
				<button type='button' disabled={isGameRunning} onClick={this.handleStep}>Step</button>
	      		<Slider speed={speed} onSpeedChange={this.speedChange} />
	      		{`Generation: ${generation}`}
      		</div>
    	);
  	}
}

export default App;