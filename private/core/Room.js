let Morpion = require('./Morpion');
module.exports = class Room{
	constructor(io, name, lobby){
		this.namespace = io.of('/'+name);
		this.name = name;
		this.game = new Morpion(this.namespace);

		console.log('ROOM CREATED');
		this.namespace.on('connection',(socket)=>{
			//verify if the user can connect
			if(this.game.players.length < 2 &&
				this.game.players.indexOf(socket) < 0 &&
				this.game.state === this.game.validState.WAITING){
				this.game.addPlayer(socket);
				if(this.game.players.length === 2){
					this.namespace.emit('launch', this.game.serialize());
				}
			}

			socket.on('disconnect', ()=>{
				this.game.deletePlayer(socket);
				if(this.game.players.length === 0){
					lobby.deleteRoom(name);
				}
			});
		})
		
	}

	/**
	 * return a serialized version of the room instance
	 * @returns {{name: *, state: *, nbPlayer: Number}}
	 */
	serialize(){
		return{
			name: this.name,
			state: this.game.state,
			nbPlayer: this.game.players.length
		}
	}
};