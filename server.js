/**
 * @fileoverview main.js for this app.
 * @author ysd
 */

var net = require('net');
var Scene = require('./scene').Scene;

/**
 * Buffer for the sub package problem.
 */
var buffers = {};

/**
 * Game scene.
 */
var gameScene = new Scene();

/**
 * App entry.
 */
var server = net.createServer();

server.on('connection', onClientConnect).listen(1234);

/**
 * When new user connect.
 * @param {Socket} sock The connection object.
 */
function onClientConnect(sock) {

	// use the 'address:port' as the key
	var key = sock.remoteAddress + sock.remotePort;
	if (!(key in buffers)) {
		buffers[key] = ''
	}
	
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
					buffers[key] != '') {
					var tmp = buffers[key] + jsonStrs[i]
					if (tmp[tmp.length - 1] == '}') {
						// it is a completed json string, pass it to the router
						route(tmp);
						buffers[key] = ''
						continue;
					}
					else {
						// uncompleted json string, append to the end of the buffer
						buffers[key] = tmp
						break;
					}
				}
				if (i == jsonStrs.length - 1 &&
					buffers[key] == '') {
					var last = jsonStrs[i].length - 1;
					if (jsonStrs[i][last] != '}') {
						// an uncompleted json string, write to the buffer
						buffers[key] = jsonStrs[i]
						continue;
					}
				}
				// Pass it to the router
				route(jsonStrs[i])
			}
		}
	
	}
	);

}

/**
 * Forward data to another logic modules.
 * @param {string} data Received data from clients.
 */
function route (data) {

	var jsonObj = JSON.parse(data);
    
    /*
        ** package structure
        ** {"msgtype":"name", "name":---} client->server
        ** {"msgtype":"touch", "id":---, "posx":---, "poxy":---} client->server
    */
    
    if ('msgtype' in jsonObj) {
        // route to logic modules
        if (jsonObj.msgtype == 'name') {
            // server received the new user's name
            var playerId = gameScene.addPlayer(name);
        }
		else if (jsonObj.msgtype == 'touch') {
			// usesr touch the screen to move
			gameScene.playerMoveTo(jsonObj.id, jsonObj.posx, jsonObj.poxy);
		} else {
			
		}
    }
    
}