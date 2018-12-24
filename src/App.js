import React, { Component } from 'react';

const totalBoardRows = 40;
const totalBoardColumns = 50;

const newStatusMatrix = (status) => {
	/* 'boardStatus' becomes an array of 'rowOfStatus' arrays */
	const boardStatus = [];

	for (let r = 0; r < totalBoardRows; r++) {
		const rowOfStatus = [];

		for (let c = 0; c < totalBoardColumns; c++) {
			rowOfStatus.push({status: status()});
		}

		boardStatus.push(rowOfStatus);
	}

	return boardStatus;
}

class App extends Component {
	state = {
      	boardStatus: newStatusMatrix(() => Math.random() < 0.25)
    }

	randomizeBoardStatus = () => {
		this.setState(prevState => ({
			boardStatus: newStatusMatrix(() => Math.random() < 0.25)
		}));
	}

	clearBoard = () => {
		this.setState(prevState => ({
			boardStatus: newStatusMatrix(() => false)
		}));
	}

    generateBoardGrid = () => {
    	/* 2D array: 'boardGrid' is an array of 'rowOfCells' arrays */
    	const boardGrid = [];

		for (let r = 0; r < totalBoardRows; r++) {
      		const rowOfCells = [];

      		for (let c = 0; c < totalBoardColumns; c++) {
        		rowOfCells.push(
			        <td
			        	key={`${r},${c}`}
						className={this.state.boardStatus[r][c].status ? 'alive' : 'dead'}
						onClick={() => this.toggleCellStatus(r, c)} />
        		);
      		}

      		boardGrid.push(<tr key={r}>{rowOfCells}</tr>);
    	}

    	return <table><tbody>{boardGrid}</tbody></table>;
  	}

  	toggleCellStatus(row,col) {
	    const newBoardStatus = prevState => {
	    	let tempBoardStatus = [...prevState.boardStatus]
	    	tempBoardStatus[row][col].status = !tempBoardStatus[row][col].status;
	    	return tempBoardStatus;
	    }

		this.setState(prevState => ({
			boardStatus: newBoardStatus(prevState)
		}))
	}

	render() {
    	return (
    		<div>
    			<h2>Game of Life</h2>
	        	{this.generateBoardGrid()}
	      		<button type='button' onClick={this.randomizeBoardStatus}>Randomize</button>
	      		<button type='button' onClick={this.clearBoard}>Clear Board</button>
      		</div>
    	);
  	}
}

export default App;