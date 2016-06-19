/**
 * @fileoverview Gateway of the game. It receive requests and forward to another modules.
 * @author ysd
 */

var net = require('net');
var Scene = require('./scene').Scene;
var MAX_PLAYER = require('./define').MAX_PLAYER;

/**
 * Buffer for the sub package problem.
 */
var buffers = new Map();

/**
 * Socket list. {id: Socket}
 */
var socks = new Map();

/**
 * Id list. {address+port: id}
 */
var ids = new Map();

/**
 * App entry.
 */
var gameScene = new Scene();
var server = net.createServer();
server.on('connection', onClientConnect).listen(1234);
gameScene.start(send);
// console.log('Game start....');

/**
 * Send data to a client.
 * @param {Number} id ID of the client to map his socket.
 * @param {string} data Json string to send.
 */
function send(id, data) {
	if (socks.has(id)) {
		socks.get(id).write(data);
	}
}

/**
 * When a client leave the game.
 */
function clientEnd(key) {
	if (buffers.has(key)) {
		buffers.delete(key);
	}
	if (ids.has(key)) {
		var id = ids.get(key);
		ids.delete(key);
		if (socks.has(id)) {
			socks.delete(id);
			gameScene.removePlayer(id);

			// Broadcast to another client.
			/**
	 		 * Package structure.
			 * {"msgtype":"close","id":"---"} server->client
			 */
			var jsonObj = {};
			jsonObj.msgtype = 'close';
			jsonObj.id = id;
			var jsonStr = JSON.stringify(jsonObj);
			socks.forEach(function (sock, id, map) {
				sock.write(jsonStr);
			});
		}
	}
}

/**
 * When new user connect.
 * @param {Socket} sock The connection object.
 */
function onClientConnect(sock) {

	// use the 'address+port' as the key
	var key = sock.remoteAddress + sock.remotePort;
	if (!(buffers.has(key))) {
		buffers.set(key, '');
	}

	sock.on('end', function () {
		var key = sock.remoteAddress + sock.remotePort;
		clientEnd(key);
	});

	sock.on('error', function (e) {
		var key = sock.remoteAddress + sock.remotePort;
		clientEnd(key);
	});

	// Emitted when data is received
	sock.on('data', function (data) {

		if (data.length <= 0)
			return

		var dataStr = data.toString();
		var originLength = dataStr.length;
		if (originLength <= 0)
			return

		// Delimited with '*'
		jsonStrs = dataStr.slice(0, originLength - 2).split('*');

		// subpackage
		var key = sock.remoteAddress + sock.remotePort;
		for (var i = 0; i < jsonStrs.length; i++) {
			if (jsonStrs[i] != '') {
				if (i == 0 &&
					jsonStrs[i][0] != '{' &&
					buffers.get(key) != '') {
					var tmp = buffers.get(key) + jsonStrs[i]
					if (tmp[tmp.length - 1] == '}') {
						// it is a completed json string, pass it to the router
						route(tmp, sock);
						buffers.set(key, '');
						continue;
					}
					else {
						// uncompleted json string, append to the end of the buffer
						buffers.set(key, tmp);
						break;
					}
				}
				if (i == jsonStrs.length - 1 &&
					buffers.get(key) == '') {
					var last = jsonStrs[i].length - 1;
					if (jsonStrs[i][last] != '}') {
						// an uncompleted json string, write to the buffer
						buffers.set(key, jsonStrs[i]);
						continue;
					}
				}
				// Pass it to the router
				route(jsonStrs[i], sock);
			}
		}

	}
	);



}

/**
 * Forward data to another logic modules.
 * @param {string} data Received data from clients.
 */
function route(data, sock) {

	var jsonObj = JSON.parse(data);

    /*
        ** package structure
        ** {"msgtype":"name", "name":"ysd"} client->server
        ** {"msgtype":"touch", "id":"1000", "posx":"0", "poxy":"0"} client->server
		** {"msgtype":"id", "id":"---"} server->client
		** {"msgtype":"spawn", "id":"---", "name":"---"} server->client
    */

    if ('msgtype' in jsonObj) {
        // route to logic modules
        if (jsonObj.msgtype == 'name') {
            // server received the new user's name
            var playerId = gameScene.addPlayer(jsonObj.name);
			if (playerId <= MAX_PLAYER && playerId > 0) {
				var sendJsonObj = {};

				// Send to self.
				sendJsonObj.msgtype = 'id';
				sendJsonObj.id = playerId;
				sock.write(JSON.stringify(sendJsonObj));

				// Boradcast to spawn new player in all clients
				sendJsonObj.msgtype = 'spawn';
				sendJsonObj.name = jsonObj.name;
				var jsonStrData = JSON.stringify(sendJsonObj);
				socks.forEach(function (sock, id, map) {
					sock.write(jsonStrData);
				});

				// Add to client sock list.
				socks.set(playerId, sock);
				var key = sock.remoteAddress + sock.remotePort;
				ids.set(key, playerId);
			}
        }
		else if (jsonObj.msgtype == 'touch') {
			// usesr touch the screen to move
			if (socks.has(jsonObj.id * 1)) {
				// Convert the string data to number.
				gameScene.playerMoveTo(jsonObj.id * 1, jsonObj.posx * 1, jsonObj.poxy * 1);
			}
		} else {
			console.log('Unknow msg type.');
		}
    }

}