class User{
	constructor(){
		this.socket = io();
		this.activeRoom = null;
		this.gameInstance = null;
		this.init();
	}
	
	init(){
		this.socket.on('init_rooms',(rooms)=>{
			this.show_lobby(rooms);
		});

		this.socket.on('room_created', (roomName) => {
			this.switch_room(roomName);
		});

		this.socket.on('update_lobby', (room) => {
			this.show_lobby([room]);
		});

		this.socket.on('error_msg', (error) => {
			console.log(error);
			alert(error);
		});
	}
	
	createRoom(name){
		console.log('i want my room!!!');
		this.socket.emit('create_room', name)
	}

	switch_room(room){
		if(this.activeRoom !== room) {
			this.activeRoom = room;
			this.socket = io('/' + room);
			console.log('switched to', room);
			this.socket.on('error_msg', (error) => {
				console.log(error);
				alert(error);
			});
			this.init_game();
		}else{
			alert('ALREADY IN THE ROOM')
		}
	}

	show_lobby(rooms){
		rooms.forEach((room) => {
			$('#lobby-container').append('<li class="room" data-name="'+room.name+'" data-players="'+room.nbPlayer+'" data-state="'+room.state+'">'+room.name+'</li>');
		});
		$("#lobby-container .room").click((e) => {
			if($(e.target).attr('data-state') === 'CLOSED'){
				alert('room closed');
			}else{
				user.switch_room($(e.target).attr('data-name'));
			}
		});
	}

	init_game(){
		this.socket.emit('init_game', (game) => {
			console.log(game);
			this.gameInstance = new GameInstance(this.activeRoom, this.socket, game);
		});
	}
}

user = new User();