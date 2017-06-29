module.exports = class Lobby{
	constructor(io){
		this.io = io;
		this.lobby = {};

		this.io.on('connection', (socket) => {
			console.log('user connected');
			socket.join('/');
			this.returnLobby(socket);
		})
	}

	addRoom(room){
		this.lobby[room] = new Room(this.io);
	}
	
	deleteRoom(room){
		this.lobby[room].close();
		delete this.lobby[room];
	}

	returnLobby(socket){
		console.log('return Lobby');
		let res = [];
		for(let room in this.lobby){
			room = this.lobby[room];
			res.push({
				name: room.name,
				state: room.state,
				nbPlayer: room.players.length
			})
		}
		this.io.to(socket.id).emit('init_rooms', res)
	}
};