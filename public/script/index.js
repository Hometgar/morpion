
$(document).ready(()=>{
    $('.toggle-create-room').click(()=>{
	    createRoomToogle();
    });
	
	$('#create-room-form').submit((e)=>{
	    e.preventDefault();
	    
	    let name = $("#room-name").val();
	    if(name) {
		    user.createRoom(name);
		    createRoomToogle();
	    }
	});
});

function createRoomToogle(){
	$('#create-room').toggle()
}