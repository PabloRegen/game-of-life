import React, { Component } from 'react';

const totalBoardRows = 3;
const totalBoardColumns = 5;
/*
const Cell = ({row, col, status, onCellClick}) => {
	// each cell status is true or false
	return (
		<td 
			className={status ? 'alive' : 'dead'}
			status={status.toString()}
			onClick={onCellClick}>
			{`${row},${col}`}
		</td>
	);
}
*/

const randomizeBoardStatus = () => {
	/* 2D array: 'boardStatus' becomes an array of 'rowOfStatus' arrays */
	const boardStatus = [];

	for (let r = 0; r < totalBoardRows; r++) {
		const rowOfStatus = [];

		for (let c = 0; c < totalBoardColumns; c++) {
			rowOfStatus.push({status: Math.random() < 0.33});
		}

		boardStatus.push(rowOfStatus);
	}

	return boardStatus;
}

class App extends Component {
	state = {
      	// boardStatus: []
      	boardStatus: randomizeBoardStatus()
    }

	toggleCellStatus(row, col, status) {
		// console.log(this.state)
	    let newBoardStatus = this.state.boardStatus.slice() // or `let newBoardStatus = [...this.state.boardStatus]` ?

	    newBoardStatus[row][col].status = !status;
	    // newBoardStatus[row][col].status = !newBoardStatus[row][col].status; // in case I don't have `status` parameter

		this.setState(prevState => ({
			boardStatus: newBoardStatus
			// can be done in 1 line without defining `newBoardStatus` with one of the below lines?
			// boardStatus: [...prevState.boardStatus, boardStatus[row][col].status: !boardStatus[row][col].status]
			// boardStatus: [...prevState.boardStatus, boardStatus[row][col].status: !prevState.boardStatus[row][col].status]	
		}));
	}

 //   	randomizeBoardStatus = () => {
	// 	/* 2D array: 'boardStatus' is an array of 'rowOfStatus' arrays */
	// 	const boardStatus = [];

	// 	for (let r = 0; r < totalBoardRows; r++) {
	// 		const rowOfStatus = [];

	// 		for (let c = 0; c < totalBoardColumns; c++) {
	// 			rowOfStatus.push({status: Math.random() < 0.33});
	// 		}

	// 		boardStatus.push(rowOfStatus);
	// 	}

	// 	// this.setState(prevState => ({
	// 	// 	boardStatus: boardStatus
	// 	// }));

	// 	return boardStatus
	// }

	randomizeBoardStatus = () => {
		this.setState(prevState => ({
			boardStatus: randomizeBoardStatus()
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
						status={this.state.boardStatus[r][c].status.toString()}
						onClick={this.toggleCellStatus(r, c, this.state.boardStatus[r][c].status.toString())}>
						{`${r},${c}`}
					</td>

					/* or return td from a separate <Cell> component (lines 6-16)
	          		<Cell
			            key={`${r},${c}`}
			            row={r}
			            col={c}
			            onCellClick={this.toggleCellStatus}
			            status={this.state.boardStatus[r][c].status.toString()}
			        />
			        */
        		);
      		}

      		boardGrid.push(<tr key={r}>{rowOfCells}</tr>);
    	}

    	return <table><tbody>{boardGrid}</tbody></table>;
  	}

	// componentWillMount() {
	// 	 // populate 'boardStatus' in advance, so 'generateBoardGrid' can pass 'status' attribute 
	// 	this.randomizeBoardStatus();
	// }

	render() {
    	return (
    		<div>
	        	{this.generateBoardGrid()}
	      		<button type='button' onClick={this.randomizeBoardStatus}>randomize</button>
      		</div>
    	);
  	}
}

export default App;