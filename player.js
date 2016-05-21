var common = require('./common');
var define = require('./define');

function Player(name) {

	// information of the player
	this.id = allocateId()
	this.usnm = name

	// the radius 0f the circle
	// it need to sync to another client
	this.radius = 1

	// the center of the circle
	// it need to sync to another client 
	this.position = new common.Vector2(0, 0);

	// 1 m/s
	this.speed = 1;

}

/**
 * Player move to a point.
 * @param destination {Vector2} Destination point.
 */
Player.prototype.moveTo = function (destination) {

	var movement = new Vector2(0, 0);

	this.doMoveTo = function (destination) {
		// Direction and distance.
		var dir = common.vector2Minus(destination, this.position);
		var distance = dir.length();
		dir.x /= distance;
		dir.y /= distance;

		if (distance > this.speed) {

			// move
			var spd = this.speed * define.DELTA_TIME;
			var targetMovement = new Vector2(dir.x * spd, dir.y * spd);
			movement = common.vector2Lerp(movement, targetMovement, 0.8);

			// update position
			this.position = common.vector2Add(this.position, movement);

			// TODO : boardcast new position to all clients to tell clients the position after 1 second

			// schedule the next move after 1 second
			setTimeout(function () {
				this.doMoveTo(destination);
			}, 100);

		}
		else if (distance < this.speed && distance > 0.1) {
			// closed to the destination, decrease the speed
			// TODO : 
		}
		else {
			// reach the destination
			delete this.movement;
		}
	}

	this.doMoveTo(destination);

}

// Player.prototype.updatePosition = function (x, y) {
// 	this.position.x = x;
// 	this.position.y = y;

// 	// TODO : boardcast position to all clients in AOI
// }

// Player.prototype.updateRadius = function (r) {
// 	this.radius = r;

// 	// TODO : broadcast radiu to all clients in AOI
// }

exports.Player = Player
