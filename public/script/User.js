class User{
	constructor(){
		this.socket = io();
		this.activeRoom = null;
		this.init()
	}
	
	init(){
		this.socket.on('init_rooms',(rooms)=>{
			console.log(rooms);
		})
		
		this.socket.on('switch_to',(room)=>{
			this.activeRoom = room;
			this.socket = io('/'+ room);
			this.socket.emit('add_user', this.socket);
			console.log('switched to ', room)
		})
	}
	
	createRoom(name){
		console.log('i want my room!!!');
		this.socket.emit('create_room', name)
	}
	
	test(){
		this.socket.emit('test')
	}
}

user = new User();