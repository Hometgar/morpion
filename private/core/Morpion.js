module.exports = class Morpion{

	/**
	 *
	 * @Namespace io
	 */
	constructor(io){
		this.io = io;
		this.validState = {
			'WAITING': 'WAITING',
			'CLOSED': 'CLOSED',
		};
		this.state = this.validState.WAITING;
		//connected players list
		this.players = [];
		//state of the board game
		this.board = [
			[null,null,null],
			[null,null,null],
			[null,null,null]
		];
		//id of the player who have to play
		this.currentPlayer = null;
	}

	/**
	 * add a player to the party and when the max player number is connected, close the game access and finally set the first player to play
	 * @param socketPlayer
	 * @returns false|serialized Morpion's instance
	 */
	addPlayer(socketPlayer){
		if(this.state === this.validState.WAITING) {
			this.players.push(socketPlayer);
			this.initEvent(socketPlayer);
			if (this.players.length === 2) {
				this.state = this.validState.CLOSED;
				this.currentPlayer = this.players[Math.floor(Math.random() * 2)].id;
				return this.serialize();
			}
			console.log(socketPlayer.id, 'has been add');
		}else {
			throw new Error('Already close');
		}
	}

	/**
	 * delete a user from the player list
	 * @param socketPlayer
	 */
	deletePlayer(socketPlayer){
		if(this.players.indexOf(socketPlayer)>=0){
			this.players.splice(this.players.indexOf(socketPlayer),1);
			console.log(socketPlayer.id,'has been remove');
		}
	}

	/**
	 * function to valid a player move and actualise the players's board game and currentPlayer
	 * @param player
	 * @param x
	 * @param y
	 * @returns {Namespace|Socket|*}
	 */
	play(player,x,y){
		let playerId = player.id;
		//check of the cell have been taken
		if(this.board[y][x] !== null){
			return player.emit('error_msg','INVALID MOVE, ALREADY TAKEN')
		}
		//check if it's the player's turn
		if(this.currentPlayer !== playerId){
			return player.emit('error_msg','INVALID PLAYER')
		}
		//check if the designated cell exist
		if(y < 0 || y > this.board.length ||
			x < 0 || x > this.board[0].length){
			return player.emit('error_msg','INVALID MOVE, NOT IN BOARD')
		}

		this.board[y][x] = playerId;
		if(this.checkWinCondition()){
			return this.io.emit('end_game', this.currentPlayer)
		}else if(this.checkForNull()){
			return this.io.emit('end_game', null);
		}
		this.currentPlayer = this.currentPlayer === this.players[0].id ? this.players[1].id : this.players[0].id;
		this.io.emit('board_update', this.board, this.currentPlayer);
	}

	/**
	 * check for win
	 * @returns {*}
	 */
	checkWinCondition() {
		return (this.checkHorizontaly() ||
			this.checkVerticaly() ||
			this.checkDiagonal());
	}

	/**
	 * check for horizontal win
	 * @returns {boolean}
	 */
	checkHorizontaly(){
		for (let i = 0; i < 2; i++){
			let player = this.players[i].id;
			for (let row = 0; row < 3; row++){
				if(this.board[row][0] === player &&
					this.board[row][1] === player &&
					this.board[row][2] === player){
					return true;
				}
			}
		}
		return false
	}

	/**
	 * check for vertical win
	 * @returns {boolean}
	 */
	checkVerticaly(){
		for (let i = 0; i < 2; i++){
			let player = this.players[i].id;
			for (let column = 0; column < 3; column++){
				if(this.board[0][column] === player &&
					this.board[1][column] === player &&
					this.board[2][column] === player){
					return true;
				}
			}
		}
		return false
	}

	/**
	 * check for diagonal win
	 * @returns {boolean}
	 */
	checkDiagonal(){
		for (let i = 0; i < 2; i++){
			let player = this.players[i].id;
			if(((this.board[0][0] === player && this.board[2][2] === player) ||
					(this.board[0][2] === player && this.board[2][0] === player)) &&
				this.board[1][1] === player){
				return true;
			}
		}

		return false
	}

	/**
	 * check if all the cells have been taken
	 * @returns {boolean}
	 */
	checkForNull(){
		for(let i = 0; i < 3; i++){
			for(let j = 0; j < 3; j++){
				if(this.board[i][j] === null){
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * add some event to the player socket
	 * @param socket
	 */
	initEvent(socket){
		socket.on('play', (column, row) => {
			this.play(socket, column, row);
		});

		socket.on('init_game', (callback) => {
			console.log('init_game');
			callback(this.serialize());
		});
	}

	/**
	 * return an serialized version of the game instance
	 * @returns {{state: *, board: (Array|[null,null,null]), currentPlayer: (null|*), players: Number}}
	 */
	serialize(){
		return {
			'state': this.state,
			'board': this.board,
			'currentPlayer': this.currentPlayer,
			'players': this.players.length
		}
	}
};