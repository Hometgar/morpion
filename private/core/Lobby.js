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
				if(!this.lobby[name]) {
					this.addRoom(name);
					return socket.emit('room_created', name)
				}

				return socket.emit('error_msg', 'ROOM NAME ALREADY TAKEN');
			});
		})
	}

	addRoom(room){
		this.lobby[room] = new Room(this.io, room, this);
		this.io.emit('update_lobby', this.lobby[room].serialize());
	}

	deleteRoom(room){
		if(this.lobby[room]) {
			for (let socketId in this.lobby[room].namespace.connected) {
				this.lobby[room].namespace.connected[socketId].disconnect();
			}
			delete this.lobby[room];
		}
	}

	returnLobby(socket){
		console.log('return Lobby');
		let res = [];
		for(let room in this.lobby){
			room = this.lobby[room];
			res.push(room.serialize())
		}
		socket.emit('init_rooms', res)
	}
};