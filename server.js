// will need to install following modules:
	// # npm install socket.io
	// # npm install nedb

var http = require('http');
var fs = require('fs');
//var sys = require('util');
var path = require('path');
//var url =  require('url');

var users = [];

var httpServer = http.createServer(requestHandler);
httpServer.listen(8085);

function requestHandler(req, res) {
	 // What did we request?
  var pathname = req.url;

  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }

  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // Now read and write back the file with the appropriate content type
  fs.readFile(__dirname + pathname,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Dynamically setting content type
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
    );
}


var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', 
	function (socket) {
	
	socket.on('newuserinfo', function (name, id) {
		var isnewuser = true;
		var newuser;
		for (var i = 0; i < users.length; i++ ) {
			if (users[i].id == id ) {
				console.log('false');
				isnewuser = false;
			} else {
				console.log('true');
				isnewuser = true;
			}
		}

		if (isnewuser == true) {
			newuser = {name: name, id: id, called: 'no'};
			users.push(newuser);
			io.sockets.emit('addName', newuser);
		}
		console.log(users);

	});


	socket.on('getcallinfo', function(name) {
		console.log('getinfo');
		var userToCall = null;
		var isExistingUser = false;
		for (var j = 0; j < users.length; j++) {
			if (users[j].name == name) {
				console.log('found peer id');
				users[j].called = 'yes';
				userToCall = users[j];
				isExistingUser = true;
			} 
		}
		if (isExistingUser == true) {
			socket.emit('returncallinfo', userToCall);

			console.log(users);

		} else {
			socket.emit('usernotfound', {});
		}
	});

	socket.on('markused', function(useduser) {
		io.sockets.emit('markuserused', useduser);
	});


	//collective story
	socket.on('addStory', function(data){
		console.log('storyline continued');
		io.sockets.emit('addStory',data);
	});

});

