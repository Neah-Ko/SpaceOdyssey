/* imports */
include("GeometricForms.js");

/* Input outputs declarations */
inlets = 9;
outlets = 0;

/* Global variables */
	/* 3D jit.world identified by scripting name */
s3D = this.patcher.getnamed("3DShapes");
/* The whole architecture is working with
renderbangs as ticks of the clock
1 tick/ea 33ms.
piece ~ 180s : 5400 ticks.
All actions temporisations are calculated in ticks
so for seconds do ~*30 (ex 90 ticks ~3s). */
var tick = 0;
/* epsilon
* minimal value handeling
*/
var epsilon = .0033;
/* current position of 3DShapes world */
var position = new Vector();
var rotation = new Vector();
/* functions */
	/* input : respond to bang */
function bang(){
	tick++;
	if(sparam && sparam[3] > 0){
		sparam = [sparam[0], sparam[1], sparam[2], sparam[3]-1];
		shiftmov(sparam);
	}
	if(rparam && rparam[3] > 0){
		rparam = [rparam[0], rparam[1], rparam[2], rparam[3]-1];
		rotmov(rparam);
	}
}
	/* input : respond to int */
function int_msg(){
	//if(inlet == x)
}
	/* input : respond to float */
function msg_float(v){
	if(inlet == 3) position.x = v;
	if(inlet == 4) position.y = v;
	if(inlet == 5) position.z = v;
	if(inlet == 6) rotation.x = v;
	if(inlet == 7) rotation.y = v;
	if(inlet == 8) rotation.z = v;
}

/* shift() 
* -1 we move backward on the axis, 0 we don't move on the axis, 1 we move forward
* input xmov : -1, 0, 1
* input ymov : -1, 0, 1
* input zmov : -1, 0, 1
* input seconds : number of seconds to perform the operation
*/
var sparam;
function shift(xmov, ymov, zmov, seconds){
	sparam = [xmov, ymov, zmov, Math.round(seconds * 33.33333)];
}

function shiftmov(sparam){
	var v = new Vector(sparam[0] * epsilon,
					   sparam[1] * epsilon,
					   sparam[2] * epsilon);
	position.x += v.x;
	position.y += v.y;
	position.z += v.z;
	s3D.position(position.x, position.y, position.z);
}

/* shift() 
* -1 we rotate backward on the axis,
* 0 we don't rotate on the axis,
* 1 we rotate forward
* input xrot : -1, 0, 1
* input yrot : -1, 0, 1
* input zrot : -1, 0, 1
* input seconds : number of seconds to perforrm the operation
*/
var rparam = 0;
function rotate(xrot, yrot, zrot, seconds){
	rparam = [xrot, yrot, zrot, Math.round(seconds * 33.33333)];
}

function rotmov(rparam){
	var v = new Vector(rparam[0] * epsilon,
					   rparam[1] * epsilon,
					   rparam[2] * epsilon);
	rotation.x += v.x;
	rotation.y += v.y;
	rotation.z += v.z;
	s3D.rotate(rotation.x, rotation.y, rotation.z);
}


/*var objects = [];
var gs = [];
function test(){
	addls = function(v){objects.push(v); return true;};
	this.patcher.applydeep(addls);
	for(var i in objects)
		if(objects[i].maxclass == "jit.gl.gridshape")
			gs.push(objects[i]);
}

var props = [];
function test2(){
	for (var m in gs[0])
	    props.push(m);
	post(props.join(","));
}*/

/* prototypes library */
	/* prototype function to test x in list */
Object.prototype.in = function(array) {
	for(var i in array)
		if(this == array[i]) return true;
	return false;
}
	/* function to get rand between 2 values */
function getIntRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

	/* function to get float rand between 2 values */
function getFloatRandom(min, max) {
  return Math.random() * (max - min) + min;
}