/**
 * @fileoverview Player class represent a player in this game.
 * @author ysd
 */

var common = require('./common');
var define = require('./define');
var Vector2 = require('./common').Vector2;

/**
 * Player actions and properties.
 * @param {string} name Player's name given by user.
 */
function Player(name) {

	/**
	 * Player's id.
	 */
	this.id = 0

	/**
	 * Player's name.
	 */
	this.usnm = name

	/**
	 * Radius of the circle. It need to be synchronized to all clients.
	 */
	this.radius = 2

	/**
	 * Center of the circle. It need to be synchronized to all clients.
	 */
	this.position = new common.Vector2(0, 0);

	/**
	 * Player's move speed per second.
	 */
	this.speed = 20;

	/**
	 * Init fielf of aoi. It must big than the field of view by speed.
	 */
	this.scope = [16, 9];

	/**
	 * Player's position update.
	 */
	this.movement = new Vector2(0, 0);

	/**
	 * Has the player moved/scaled in current logic frame.
	 */
	this.moved = false;
	this.scaled = false;

}

Player.prototype.eat = function (foodRadius, onPlayerEat) {
	// Grow when player eat another player.
	// And speed will descend.
}

/**
 * Player move to a point.
 * @param {Vector2} destination Destination point.
 */
Player.prototype.moveTo = function (destination, onPlayerMove) {

	playerMove(this, destination, onPlayerMove);

}

function playerMove(player, destination, onPlayerMove) {

	var spd = player.speed * define.DELTA_TIME;

	// Direction to the destination
	var dir = common.vector2Minus(destination, player.position);
	var distance = dir.length();
	dir.x /= distance;
	dir.y /= distance;

	// Lerp to player vector.
	var targetMovement = common.vector2Multi(dir, spd);

	if (distance > 0.1) {

		player.moved = true;
		if (distance > spd) {
			// accelerate
			player.movement = common.vector2Lerp(player.movement, targetMovement, 0.5);
		} else {
			// decelerate
			player.movement = common.vector2Lerp(player.movement, common.Zero, 0.5);
		}

		// update position
		player.position = common.vector2Add(player.position, player.movement);
		onPlayerMove(player.id, player.position);


		// schedule the next move after 1 second
		setTimeout(function () {
			playerMove(player, destination, onPlayerMove);
		}, define.DELTA_TIME * 1000);

	}
	else {
		player.moved = false;
		return;
	}
}

exports.Player = Player
