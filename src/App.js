import React, { Component } from 'react';

const totalBoardRows = 40;
const totalBoardColumns = 50;

const newBoardStatus = (cellStatus = () => Math.random() < 0.25) => {
	const grid = [];
	for (let r = 0; r < totalBoardRows; r++) {
		const row = [];
		for (let c = 0; c < totalBoardColumns; c++) {
			row.push(cellStatus());
		}
		grid.push(row);
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
	state = {boardStatus: newBoardStatus()}

	handleNewBoard = () => {
		this.setState(prevState => ({boardStatus: newBoardStatus()}));
	}

	clearBoard = () => {
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
	      		<button type='button' onClick={this.clearBoard}>Clear Board</button>
	      		<button  type='button' onClick={this.handleStart}>Start</button>
      		</div>
    	);
  	}
}

export default App;