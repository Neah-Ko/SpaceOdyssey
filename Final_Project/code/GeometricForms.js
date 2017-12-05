/* GeometricForms.js
 * Handle 2D Forms classes
 * common functions
 * and dependancies 
 */
include("jsVectors.js");
include("Circle.js");
include("Rectangle.js");
include("Triangle.js");
include("Text.js");

/* jitter object */
function defaultsketch(){
	return jitter2D;
}

/* Function to 2Drotate a vector */
function rotatev2d(v, theta) {
	var x2 = v.x*Math.cos(theta) - v.y*Math.sin(theta);
	var y2 = v.x*Math.sin(theta) + v.y*Math.cos(theta);
	return new Vector(x2, y2, 0);
}