/**
 * @fileoverview Scene class hold the game.
 * @author ysd
 */

var Player = require('./player').Player;
var MAX_PLAYER = require('./define').MAX_PLAYER;
var DELTA_TIME = require('./define').DELTA_TIME;
var Vector2 = require('./common').Vector2;
var aoi_st = require('./aoi_st');

/**
 * Player list. {id: player}
 */
var players = new Map();

// /**
//  * Observer list of interesting of every players. {id: []}
//  */
// var observedList = {}

/**
 * Valid id.
 * @type {Stack}
 */
var validId = [];

/**
 * Game scene. A 2d square.
 */
function Scene() {

	// size of the game scene, the origin is the center of the map.
	this.width = 100;
	this.height = 100;

	// This is the logic frame rate in the server.
	this.frameRate = DELTA_TIME * 1000;

	for (var index = 0; index < MAX_PLAYER; index++) {
		validId.push(index + 1);
	}

}

/**
 * Start the game main loop.
 */
Scene.prototype.start = function (send) {
	update(send, this.frameRate);
}

/**
 * Update game stat for every 100ms.
 */
function update(send, fr) {
	setTimeout(function () {
		update(send, fr);
	}, fr);

	// TODO(ysd): Collision detection.

	// Broadcast message.
	players.forEach(function (player, id, map) {
		var x1 = player.position.x - player.scope[0] / 2;
		var x2 = x1 + player.scope[0];
		var y1 = player.position.y - player.scope[1] / 2;
		var y2 = y1 + player.scope[1];
		var observed = aoi_st.search(x1, x2, y1, y2);

		/**
		 * Construct a json string:
		 * {"msgtype":"sync", 
		 *  "position": [
		 		{ "id":"---" , "posx":"---" , "posy":"---" },
		 		{ "id":"---" , "posx":"---" , "posy":"---" },
		 		{ "id":"---" , "posx":"---" , "posy":"---" }
		 	],
			"size": [
				{ "id":"---" , "size":"---" }
			]
			}
		*/
		var jsonStr = '{"msgtype":"sync",';

		// position synchronize.
		var m = 0;
		var positionSyncArr = [];

		// size synchronize
		var n = 0;
		var sizeSyncArr = [];

		for (var i = 0, l = observed.length; i < l; i++) {
			var id = observed[i];
			var player = players.get(id);
			// Some of the observed have not moved yet.
			// Check if the player of id is moved.
			if (player.moved) {
				var obj = {};
				obj.id = id;
				obj.posx = player.position.x;
				obj.posy = player.position.y;
				positionSyncArr[m++] = obj;
			}
			if (player.scaled) {

				// TODO(ysd): Check if some player is bigger/smaller.
			}
		}
		if (positionSyncArr.length > 0 || sizeSyncArr.length > 0) {
			jsonStr += '"position":' + JSON.stringify(positionSyncArr) + ','
				+ '"size":' + JSON.stringify(sizeSyncArr)
				+ '}';
			// If the client has not spawn the a player yet, it spawn first and do not move.
			send(id, jsonStr);
		}
	}
	);
}

/**
 * Allocate a position for a new player.
 * @return {Vector2}
 */
Scene.prototype.allocatePosition = function () {
	var x = (Math.random() - 0.5) * this.width;
	var y = (Math.random() - 0.5) * this.height;
	return new Vector2(x, y);
}

/**
 * Reset the size of the gane map.
 * @param width  {Number} New width of the map.
 * @param height {Number} New height of the map.
 */
Scene.prototype.resize = function (width, height) {

}

/**
 * Add a new player with given name.
 * @param name   {String} The new player's name.
 * @param return {Number} The allocated id.
 */
Scene.prototype.addPlayer = function (name) {
	var newPlayer = new Player(name);
	if (validId.length <= 0)
		return -1;
	else
		var id = validId.pop();

	newPlayer.id = id;
	newPlayer.position = this.allocatePosition();
	if (players.has(id))
		return -1;

	players.set(id, newPlayer);

	aoi_st.insert(id, newPlayer.position.x, newPlayer.position.y);

	// TODO(ysd): Resize the game map if necessary.

	return id;
}

Scene.prototype.removePlayer = function (id) {

}

/**
 * A player want to move to a point.
 * @param id {Number} Id of the player.
 * @param x  {Number} X position of the point.
 * @param y  {Number} Y position of the point.
 */
Scene.prototype.playerMoveTo = function (id, x, y) {
	var destination = new Vector2(x, y);
	players.get(id).moveTo(destination, onPlayerMove);
}

exports.Scene = Scene;

/**
 * Callback when player update its position.
 */
function onPlayerMove(id, position) {
	aoi_st.update(id, position.x, position.y);
}
