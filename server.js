var net = require('net');

var server = net.createServer();

server.on('connection', onClientConnect).listen(1234);

function onClientConnect (sock) {

	// Emitted when data is received
	sock.on('data', onClientData);

}

function onClinetData (data) {

}

var handlers = {
	name 	: createPlayer,
	touch 	: playerTouch, 
}

// When a new player enter his name
function createPlayer (id, name) {

	// TODO : allocate user id

	// TODO : create new player at all clients

}

// When a player touch the screen
function playerTouch (id, touch) {}