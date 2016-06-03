/**
 * @fileoverview Player class represent a player in this game.
 * @author ysd
 */

var common = require('./common');
var define = require('./define');

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
	this.speed = 1;
	
	/**
	 * Init fielf of aoi. It must big than the field of view by speed.
	 */
	this.scope = [16, 9];

}

Player.prototype.eat = function (foodRadius, onPlayerEat) {
	// Grow when player eat another player.
}

/**
 * Player move to a point.
 * @param {Vector2} destination Destination point.
 */
Player.prototype.moveTo = function (destination, onPlayerMove) {

	var movement = new Vector2(0, 0);
	var spd = this.speed * define.DELTA_TIME;

	this.doMoveTo = function (destination) {
		// Direction and distance.
		var dir = common.vector2Minus(destination, this.position);
		var distance = dir.length();
		dir.x /= distance;
		dir.y /= distance;
		var targetMovement = new Vector2(dir.x * spd, dir.y * spd);

		if (distance > 0.1) {
			
			if (distance > this.speed) {
				// accelerate
				movement = common.vector2Lerp(movement, targetMovement, 0.5);
			} else {
				// decelerate
				movement = common.vector2Lerp(movement, common.Zero2);
			}
			
			// update position
			this.position = common.vector2Add(this.position, movement);
			onPlayerMove(this.id, this.position);
			
			// schedule the next move after 1 second
			setTimeout(function () {
				this.doMoveTo(destination);
			}, 100);
			
		} else {
			// reach the destination
			delete this.movement;
		}
	}

	this.doMoveTo(destination);

}

exports.Player = Player
