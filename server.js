// will need to install following modules:
	// # npm install socket.io
	// # npm install nedb

var http = require('http');
var fs = require('fs');
var sys = require('sys');
var url =  require('url');
var io = require('socket.io').listen(httpServer);

function requestHandler(req, res) {
	var parsedUrl = url.parse(req.url);
	var path = parsedUrl.pathname;
	if (path == "/") {
		path = "index.html";
	}
	fs.readFile(__dirname + path,
		function (err, fileContents) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + req.url);
			}
			res.writeHead(200);
			res.end(fileContents);
  		}
  	);	
	// console.log("Got a request " + req.url);
}


var httpServer = http.createServer(requestHandler);
httpServer.listen(8085);


var io = require('socket.io').listen(httpServer);

var users = [];

io.sockets.on('connection', 
	function (socket) {

	// socket.on('newimage', function (image, id, name) {
	// 	var img = image;
	// 	var imgname = 'map-' + id + '.png';
	// 	// strip off the data: url prefix to get just the base64-encoded bytes
	// 	var data = img.replace(/^data:image\/\w+;base64,/, "");
	// 	var buf = new Buffer(data, 'base64');
	// 	var tstamp = Date.now();
	// 	fs.writeFile('map-images/' + imgname, buf);
	// 	var saveimage = { _id: id, imgname: imgname, type: 'mapimage', mapname: name, timestamp: tstamp };
	// 	db.insert(saveimage, function (err, newImage) {
	// 		console.log("err: " + err);
	// 		// console.log("newDoc: " + newImage);
	// 	});

	
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
			newuser = {name: name, id: id};
			users.push(newuser);
		}
		console.log(users);

	});

});

