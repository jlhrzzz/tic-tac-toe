/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-redeclare */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

type StateType = {
	value: string;
};
type propType = {
	value: string;
	onClick: Function
};
interface Square {
	state: StateType;
	props: propType
}
type StateType2 = {
	squares: string[];
	xIsNext: boolean
};
type propType2 = {
	squares: string[];
	onClick: Function
};
interface Board {
	state: StateType2;
	props: propType2
}
type StateType3 = {
	history: object[];
	xIsNext: boolean
	stepNumber: number
};
type propType3 = {
	history: object[];
	xIsNext: boolean
};
interface Game {
	state: StateType3;
	props: propType3
}

function Square(props: { onClick: React.MouseEventHandler<HTMLButtonElement>; value: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) {
	return (
		<button className="square" onClick={props.onClick} >
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	constructor(props: string) {
		super(props)
		this.state = {
			squares: Array(9).fill(null),
			xIsNext: true,
		}
	}

	renderSquare(i: string) {
		return <Square
			value={this.props.squares[i]}
			onClick={() => { this.props.onClick(i) }}
		/>;
	}

	render() {
		const winner = calculateWinner(this.state.squares)
		let status: boolean | React.ReactChild | React.ReactFragment
		if (winner) {
			status = `Winner ${winner}`
		} else {
			status = `Next player: ${this.state.xIsNext ? 'x' : 'O'}`;
		}

		return (
			<div>
				<div className="board-row">
					{this.renderSquare('0')}
					{this.renderSquare('1')}
					{this.renderSquare('2')}
				</div>
				<div className="board-row">
					{this.renderSquare('3')}
					{this.renderSquare('4')}
					{this.renderSquare('5')}
				</div>
				<div className="board-row">
					{this.renderSquare('6')}
					{this.renderSquare('7')}
					{this.renderSquare('8')}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props: string) {
		super(props)
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true
		}
	}

	handleClick(i: string) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current: any = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return
		}
		squares[i] = this.state.xIsNext ? 'x' : 'O'
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		})
	}

	jumpTo(step: number) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	render() {
		const history = this.state.history
		const current: any = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares)

		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move :
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status: string
		if (winner) {
			status = `Winner ${winner}`
		} else {
			status = `Next player: ${this.state.xIsNext ? 'x' : 'O'}`;
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares: any[]) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Game history={[]} xIsNext={false} />
	</React.StrictMode>
);