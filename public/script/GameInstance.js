class GameInstance{
	constructor(name, socket, game){
		this.state = game.state;
		this.name = name;
		this.board = game.board;
		this.currentPlayer = game.currentPlayer ? game.currentPlayer : null;
		this.player = socket;
		this.initEvent();
		this.initGUI();
		console.log(game.players);
		if(game.players === 2){
			this.launch();
		}
	}
	
	initGUI(){
		console.log('init GUI');

		$('#active-room-name').html(this.name);

		$('#state').html(this.state === 'WAITING'? "waiting for an other player" : "launched");

		this.initBoard();

		$('#lobby').hide();
		$('#game').show();
	}

	initEvent(){
		this.player.on('launch', (game) => {
			console.log('launch');
			this.board = game.board;
			this.currentPlayer = game.currentPlayer;
			this.state = game.state;
			this.launch();
		});

		this.player.on('board_update', (board, nextPlayer) => {
			this.board = board;
			this.currentPlayer = nextPlayer;
			this.updateUI();
			this.initBoard();
		});

		this.player.on('end_game', (idWinner) => {
			if (this.player.id === idWinner) {
				alert('CONGRATE YOU WIN!!');
			}else{
				alert('SORRY YOU LOOSE')
			}
			let replay = confirm("WANNA REPLAY?");
			if(replay){
				window.location.reload();
			}else{
				this.player.close();
			}
		});

		$('#game-board td').click((e) => {
			if(this.currentPlayer === this.player.id) {
				this.player.emit('play', $(e.target).attr('data-column'), $(e.target).parent('tr').attr('data-row'));
			}else{
				alert('not your turn');
			}
		})
	}

	initBoard(){
		this.board.forEach((row, indexRow) => {
			row.forEach((cell, indexColumn) => {
				let toDisplay = "";
				if(cell){
					toDisplay = cell === this.player.id ? 'X' : 'O';
				}
				$('tr[data-row='+indexRow+']>td[data-column='+indexColumn+']').html(toDisplay)
			})
		});
	}

	updateUI(){
			$('#active-player').html(this.currentPlayer === this.player.id ? "Your turn" : "Opponent turn");
	}

	launch(){
		this.updateUI();

		$('#state').html('launched')
	}
}
