/**
 * @fileoverview Utility class for this app.
 * @author ysd
 */

/**
 * Create 2d vector.
 * @param {Number} x X element of the vector.
 * @param {Nunber} y Y element of the vector.
 */
function Vector2(x, y) {
	this.x = x || 0
	this.y = y || 0
}

/**
 * Length of the 2d vector.
 */
Vector2.prototype.length = function () {
	return Math.sqrt(this.x * this.x + this.y * this.y)
}

/**
 * Normalize the 2d vector.
 */
Vector2.prototype.normalize = function () {
	len = this.length();
	this.x /= len;
	this.y /= len;
}

exports.Vector2 = Vector2

/**
 * Add two Vector2.
 */
exports.vector2Add = function (a, b) {
	return new Vector2(a.x + b.x, a.y + b.y)
}

/**
 * Minus one Vector2 from another.
 */
exports.vector2Minus = function (a, b) {
	return new Vector2(a.x - b.x, a.y - b.y)
}

/**
 * Multiplies a vector by a number.
 */
exports.vector2Multi = function (a, m) {
	return new Vector2(a.x * m, a.y * m);
}

/**
 * Angle of two 2d vectors in degrees
 */
exports.vector2Angle = function (a, b) {
	const dot = exports.vector2Dot(a, b)
	const la = a.length()
	const lb = b.length()
	const theta = dot / (la * lb)
	return Math.acos(theta) * 180 / Math.PI
}

/**
 * Distance of 2 points
 */
exports.vector2Distance = function (a, b) {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Dot Product of two 2d vectors.
 */
exports.vector2Dot = function (a, b) {
	const mx = a.x * b.x
	const my = a.y * b.y
	return mx + my
}

/**
 * Normalize a 2d vector.
 */
exports.vector2Normalize = function (a) {
	var len = a.length();
	var vec = new Vector2(a.x / len, a.y / len);
	return vec;
}

/**
 * Linearly interpolates between two Vector2s by t.
 * When t = 0 returns a. 
 * When t = 1 return b. 
 * When t = 0.5 returns the midpoint of a and b.
 * @param t {Number} The normalized distance from point a.
 */
exports.vector2Lerp = function (a, b, t) {
	t = Math.max(0, t)
	t = Math.min(1, t)
	const ax = a.x * (1 - t)
	const ay = a.y * (1 - t)
	const bx = b.x * t
	const by = b.y * t
	return new Vector2(ax + bx, ay + by)
}

/**
 * Reflects a vector off the vector defined by a normal.
 * @param light {Vector2} Light direction.
 * @param norm {Vector2} Normal direction.
 */
exports.vector2Reflect = function (light, norm) {
	light = light.normalize()
	norm = norm.normalize()
	const v = 2 * exports.vector2Dot(light, norm)
	var ref = new Vector2(v * norm.x - light.x, v * norm.y - light.y)
	return ref.normalize();
}

/**
 * Triple cross of three vectors, a x b x c.
 * @return {Vector2} A perpendicular vector of c. The vector is still on the plane of abc.
 */
exports.vector2TripleCross = function (a, b, c) {
    // Perform a.dot(c)
    var ac = a.x * c.x + a.y * c.y;
    // Perform b.dot(c)
    var bc = b.x * c.x + b.y * c.y;

    // Perform b * a.dot(c) - a * b.dot(c)
    x = b.x * ac - a.x * bc;
    y = b.y * ac - a.y * bc;

    return new Vector2(x, y);
}

/**
 * Multiplies two vectors component-wise.
 */
exports.vector2Scale = function (a, b) {
	return new Vector2(a.x * b.x, a.y * b.y);
}

/**
 * Zero vector.
 */
exports.Zero = new Vector2(0, 0);
