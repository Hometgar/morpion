module.exports = class Lobby{
	constructor(io){
		this.io = io;
		this.lobby = {};

		console.log('test');

		this.io.on('connection', (socket) => {
			socket.join('/');
			this.returnLobby(socket);
		})
	}

	addRoom(room){
		this.lobby[room] = new Room(this.io, room);
	}

	returnLobby(socket){
		res = [];
		for(let room in this.lobby){
			room = this.lobby[room];
			res.push({
				name: room.name,
				state: room.state,
				nbPlayer: room.players.length
			})
		}
		socket.send('init_rooms', res)
	}
};