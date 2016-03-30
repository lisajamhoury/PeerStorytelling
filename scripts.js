
var socket = io.connect();
var mypeerid = null;
var myname = null;
var peer = null;
var connection = null;
var myTurn = false;


socket.on('connect', function() {
	//console.log("Connected");
});


socket.on('returncallinfo', function(usertocall) {
	if (myTurn == true) {
		placecall(usertocall);
	} else {
		alert('No Way Jose');
	}
});

var init = function() {

	document.getElementById('call-button').addEventListener('click', function() {
		//console.log('got it');
		var nameToCall = document.getElementById('other_peer_id').value.toLowerCase();
		//console.log(nameToCall);
		socket.emit('getcallinfo', nameToCall);
		document.getElementById('other_peer_id').value = '';
	});

	peer = new Peer({host: 'liveweb.itp.io', port: 9001, path: '/'});
	
	peer.on('open', function(id) {
	  //console.log('My peer ID is: ' + id);
	  mypeerid = id;
	});
	
	peer.on('connection', function(conn) {
		connection = conn;
		connection.on('open', function() {
			//when someone calls you, the story input box becomes visible
			myTurn = true;
			document.getElementById('chat').style.display = 'block';
			document.getElementById('chatbutton').style.display = 'block';
			document.getElementById('story-prompt').style.display = 'block';

		});
		connection.on('data', function(data) {
			document.getElementById('story').innerHTML += data;
		});
	});
};	

//broadcast username to user list div
socket.on('addName', function(newuser){
	//console.log(newuser.name);
	var mainDiv = document.getElementById('user-list');
	var newUser = document.createElement('div');
	newUser.setAttribute("id", newuser.id);
	newUser.setAttribute("class", "added-user-name");
	newUser.innerHTML = newuser.name;
	mainDiv.appendChild(newUser);
});

//broadcast story to story div
socket.on('addStory', function(data){
	//console.log(data);
	document.getElementById('story').innerHTML += " " + data;
		});

		socket.on('markuserused', function(useduser) {
			document.getElementById(useduser.id).setAttribute("class", "used-name");
		});


var submitName = function() {
	myname = document.getElementById('user-name-input').value.toLowerCase();
	//console.log(myname);
	//console.log(mypeerid);
	socket.emit('newuserinfo', myname, mypeerid);
	appendUserList(myname);

	if(myname == "yurika") {
		myTurn = true;
		document.getElementById('other_peer_id').style.display = 'block';
		document.getElementById('call-button').style.display = 'block';
		document.getElementById('call-prompt').style.display = 'block';
	}
	
};
//funciton that adds the name to list
var appendUserList = function(name){
	socket.emit('addName', name);
};

//IF CONNECTION IS TRUE DO THESE
//other person's data
var placecall = function(usertocall) {

	connection = peer.connect(usertocall.id);
	socket.emit('markused', usertocall);
	//console.log('call placed');
	myTurn = false;
	//console.log(myTurn);
	

	//when you call another person, you can nolonger edit the text

	connection.on('open', function(data) {
		//console.log('callmade');
		//console.log(connection);
		document.getElementById('chat').style.display = 'none';
		document.getElementById('chatbutton').style.display = 'none';
		document.getElementById('story-prompt').style.display = 'none';

		document.getElementById('other_peer_id').style.display = 'none';
		document.getElementById('call-button').style.display = 'none';
		document.getElementById('call-prompt').style.display = 'none';
	});

	connection.on('data', function(data) {
		document.getElementById('story').innerHTML += data;
	});
};	


var sendmessage = function(){
	//console.log("sending message");
	if (myTurn == true) {
		var storyinput = document.getElementById('chat').value;
		appendStory(storyinput);
		document.getElementById('chat').value = "";
	} else {
		alert('Pfffft');
	}

	//when you send the story, then show the call button

	document.getElementById('other_peer_id').style.display = 'block';
	document.getElementById('call-button').style.display = 'block';
	document.getElementById('call-prompt').style.display = 'block';
}

var appendStory = function(d){
	socket.emit('addStory', d);
	document.getElementById('chat').style.display = 'none';
	document.getElementById('chatbutton').style.display = 'none';
	document.getElementById('story-prompt').style.display = 'none';
}

window.addEventListener('load', init);