/**
 * @fileoverview Scene class hold the game.
 * @author ysd
 */

var Player = require('./player').Player;
var MAX_PLAYER = require('./define').MAX_PLAYER;
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
var validId = []

/**
 * Game scene. A 2d square.
 */
function Scene() {

	// size of the game scene, the origin is the center of the map.
	this.width = 100;
	this.height = 100;

	// This is the logic frame rate in the server.
	this.frameRate = 100;

	for (var index = 0; index < MAX_PLAYER; index++) {
		validId.push(index + 1);
	}

}

/**
 * Start the game main loop.
 */
Scene.prototype.startGame = function () {
	this.update();
}

/**
 * Update game stat for every 100ms.
 */
Scene.prototype.update = function () {
	setTimeout(this.update, this.frameRate);

	players.forEach(function (id, player, map) {
		var x1 = player.position.x - player.scope.x / 2;
		var x2 = x1 + player.scope.x;
		var y1 = player.position.y - player.scope.y / 2;
		var y2 = y1 + player.scope.y;
		var observed = aoi_st.search(id, x1, x2, y1, y2);

		/**
		 * Construct a json string:
		 * {"msgtype":"position", "data": [
		 		{ "id":"---" , "posx":"---" , "posy":"---" },
		 		{ "id":"---" , "posx":"---" , "posy":"---" },
		 		{ "id":"---" , "posx":"---" , "posy":"---" }
		 		]
			}
		*/
		var jsonStr = '{"msgtype":"position", "data":';
		var objArr = new Array(observed.length);
		for (var i = 0, l = observed.length; i < l; i++) {
			var obj = {};
			var id = observed[i];
			obj.id = id;
			var player = players.get(id);
			obj.posx = player.position.x;
			obj.posy = player.position.y;
			objArr[i] = obj;
		}
		jsonStr += JSON.stringify(objArr) + '}';

		// If the client has not spawn the a player yet, it spawn first and do not move.
		// TODO(ysd): send to clients.
	}
	);
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
	newPlayer.position = allocatePosition();
	if (players.has(id))
		return -1;

	players.set(id, newPlayer);

	// TODO(ysd): Broadcast to all clients to add this new player.
	aoi_st.insert(id, newPlayer.position.x, newPlayer.position.y);

	// TODO(ysd): Resize the game map.

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
	players[id].moveTo(destination, onPlayerMove);
}

exports.Scene = Scene

/**
 * Allocate a position for a new player.
 * @return {Vector2}
 */
function allocatePosition() {
	return new Vector2(0, 0)
}

function onPlayerMove(id, position) {
	aoi_st.update(id, position.x, position.y);
}
