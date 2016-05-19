var w = require('./scene').width
var h = require('./scene').height
var common = require('./common')
var Vector2 = require('./common').Vector2

var p = new Vector2(0, 0.2)
console.log(common.vector2Reflect(p, new Vector2(1, 1)))

function allocateId ( ) {
	return 0;
}

function allocatePosition ( ) {
	return new Vector2(0, 0)
}

function Player (name) {

	// information of the player
	this.id = allocateId()
	this.usnm = name

	// the radius 0f the circle
	// it need to sync to another client
	this.radius = 1

	// the center of the circle
	// it need to sync to another client 
	this.position = allocatePosition()

	this.updatePosition = function (x, y) {
		this.position.x = x
		this.position.y = y
	}
}