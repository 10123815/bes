/**
 * @fileoverview Scene class hold the game.
 * @author ysd
 */

var Player = require('./player').Player;
var MAX_PLAYER = require('./define').MAX_PLAYER;

/**
 * Player list. {id : player}
 */
var players = {}

/**
 * Valid id.
 * @type {Stack}
 */
var validId = []
for (var index = 0; index < MAX_PLAYER; index++) {
	validId.push(index + 1);
}

/**
 * Game scene. A 2d square.
 */
function Scene() {

	// size of the game scene, from top-left
	this.width = 100;
	this.height = 100;

}

Scene.prototype.resize = function () {

}

/**
 * Add a new player with given name.
 * @param name {String} The new player's name.
 * @param return {Number} The allocated id.
 */
Scene.prototype.addPlayer = function (name) {
	var newPlayer = new Player(name);
	if (validId.length <= 0)
		return -1;
	else
		var id =  validId.pop();
	newPlayer.id = id;
	newPlayer.position = allocatePosition();
	players[id] = newPlayer;
	
	// TODO : broadcast to all clients to add this new player
	
	return id;
}

Scene.prototype.removePlayer = function (id) {

}

/**
 * A player want to move to a point.
 * @param id {Number} Id of the player.
 * @param x {Number} X position of the point.
 * @param y {Number} Y position of the point.
 */
Scene.prototype.playerMoveTo = function (id, x, y) {
	var destination = new Vector2(x, y);
	players[id].moveTo(destination);
}

exports.Scene = Scene

/**
 * Allocate a position for a new player.
 * @return {Vector2}
 */
function allocatePosition() {
	return new Vector2(0, 0)
}
