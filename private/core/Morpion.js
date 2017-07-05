module.exports = class Morpion{
	static validState = {
		'WAITING': 'WAITING',
		'CLOSED': 'CLOSED',
	};
	constructor(){
		this.state = Morpion.validState.WAITING;
		this.players = [];
		this.board = [
			[0,0,0],
			[0,0,0],
			[0,0,0]
		];
		this.currentPlayer = null;
	}

	addPlayer(socketPlayer){
		this.players.push(socketPlayer)
	}

	play(player,x,y){
		player = this.players.indexOf(player);
		if(this.board[x][y] !== 0){
			throw new Error('INVALID MOVE, ALREADY TAKEN')
		}
		if(this.currentPlayer !== player){
			throw new Error('INVALID PLAYER')
		}

		this.board[x][y] = player;
		this.checkWinCondition();
		return this.board;
	}

	checkWinCondition() {
		return (this.checkHorizontaly() ||
			this.checkVerticaly() ||
			this.checkDiagonal());
	}

	checkHorizontaly(){
		for (let playerIndex = 0 ; playerIndex < this.players.length; playerIndex++){
			for (let row = 0; row < this.board.length; row++){
				if(this.board[row][0] === playerIndex &&
					this.board[row][1] === playerIndex &&
					this.board[row][2] === playerIndex){
					return true;
				}
			}
		}

		return false
	}

	checkVerticaly(){
		for (let playerIndex = 0 ; playerIndex < this.players.length; playerIndex++){
			for (let column = 0; column < this.board.length; column++){
				if(this.board[0][column] === playerIndex &&
					this.board[1][column] === playerIndex &&
					this.board[2][column] === playerIndex){
					return true;
				}
			}
		}

		return false
	}

	checkDiagonal(){
		for (let playerIndex = 0 ; playerIndex < this.players.length; playerIndex++){
			if((
				(this.board[0][0] === playerIndex && this.board[2][2] === playerIndex) ||
				(this.board[0][2] === playerIndex && this.board[2][0] === playerIndex)) &&
				this.board[1][1] === playerIndex){
				return true;
			}
		}

		return false
	}
};