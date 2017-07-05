require('./Morpion');
module.exports = class Room{
	constructor(io, name){
		this.namespace = io.of('/'+name);
		this.name = name;
		this.game = new Morpion();
		
		console.log('ROOM CREATED');
		this.namespace.on('connection',(socket)=>{
			console.log('there is a connection');
			socket.on('add_user',()=>{
				if(this.game.players.length < 2 &&
					this.game.players.indexOf(socket) < 0 &&
					this.game.state === Morpion.validState.WAITING){
					this.game.addPlayer(socket);
					return socket.emit('switch_to', this.name)
				}

				return this.namespace.to(socket.id).emit('error', 'INVALID ROOM')
			});
			
			socket.on('disconnect', ()=>{
				console.log('disconnection of ', socket.id);
				
				this.namespace.emit('disconnect')
			});
			
			socket.on('test', ()=>{
				console.log('room test')
			})
		})
		
	}
	
};