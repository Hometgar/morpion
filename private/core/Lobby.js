let Room = require('./Room');


module.exports = class Lobby{
	constructor(io){
		this.io = io;
		this.lobby = {};

		this.io.on('connection', (socket) => {
			console.log('user connected');
			socket.join('/');
			this.returnLobby(socket);
			
			socket.on('create_room', (name)=>{
				this.addRoom(name);
				socket.join('/'+name);
				socket.emit('switch_to', name);
			})
			
			socket.on('test', ()=>{
			    console.log('Lobby test')
			})
		})
	}

	addRoom(room){
		this.lobby[room] = new Room(this.io, room);
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
				state: room.game.state,
				nbPlayer: room.game.players.length
			})
		}
		socket.emit('init_rooms', res)
	}
};