/* imports */
include("GeometricForms.js");

/* Input outputs declarations */
inlets = 1;
outlets = 1;

/* Global variables */
/* jit.world instanciated as a jitterobject */
var jitter2D = new JitterObject("jit.gl.sketch","2DShapes");
/* clockticks */
var tick = 0;
/* drawing lists*/
	/* changingtoplayer shapes */
var changingtoplayer = [];
	/* changing shapes */
var changing = [];
	/* static shapes */
var unchanging = [];
	/* colors layers */
var layers = [];

/* handful of utilitary flags and global variables */
/* alert mode */
var enablealert = 0;
/* is the UI blinking ? */
var mainblinking = 0;
/* is hud is off ? */
var hudoff = 0;


/* blinking state */
	/* to set a blinking tempo every x seconds*/
var blinkingstate = [0, 0];
/* is fixed elem has been called for the last time ?*/
var pflag = 0;
/* render frequency (approx)*/
var renderFreq = 20; // (corresponds to 60 fps)
/* colours */
	/* fading blue */
var fadecolor1 = [.2, .55, .9, .8];
	/* fading orange */
var fadecolor2 = [1., .35, .2, .7];
	/* grey on orange */
var fadecolor3 =  [.871, .55, .476, .5];
var white = [1., 1., 1., 1.];
var black = [0., 0., 0., 1.];
	/* dark grey */
var solidcolor = [.1, .1, .1, 1.];
	/* darker grey */
var solidcolordarker = [.05, .05, .05, 1.];
/* thicness of the lines */
var linec = .008;
// computes seconds in terms of bang frequency
function getsec(v){ return Math.round((1.0 / renderFreq * 1000) * v); }

/* bang() function
 * Is banged by jit.world renderbang (ea/16.5 ms because 60 fps)
 * Goal is to define eveloving and ponctual elements
 * working with "clockticks"
 */
function bang(){
	jitter2D.reset(); // reset 2D
	verybottomsq();
	tick++; // We update tick
	/* event queuing */
	if(blinkingstate[0] != 0 && blinkingstate[1] != 0)
		setblinking(tick);
	if(tick == 1) { // init
		structures();
		panneldrop(getsec(5)); // start event
	}
	if(tick == getsec(5)) radar();
	drawfct(4);
	drawfct(1);
	drawfct(2);
	if(!hudoff){
		if(tick >= getsec(5)){
			topright01(tick);
			if(tick < getsec(15)) loadbar(tick);
			if(tick > getsec(10)){
				if(!greetings.state) greetings(tick-getsec(10));
				if(!pflag){ fixedelems(); pflag++; }
			} else {
				initialize(tick-getsec(5));
				fixedelems(tick-getsec(5)+1); // +1 to avoid i to be 0
			}
		}
	}
	drawfct(3);
}

var x = 0;
function test(){
	while(x++ || 1){
		post(x);
		if(x>5) break;
	}
}

/* verybottomsq() function
 * create black square on the bottom for repeating pixels
 */
function verybottomsq(){
	var r = new Rectangle(0., -.9, 6., .17, [0., 0., 0., 1.]);
	r.draw();
}

function test2(){
	var objCoord = []; // raw data
	var objPos = []; // formated
	addls = function(v){
		if(v.varname.substr(0, 6) == "3DOpos")
			objCoord.push(v);
		return true;
	};
	/* We find all named objects that starts with 3DOpos */
	this.patcher.parentpatcher.applydeep(addls);
	var nbit = 0;
	for(var i = 0; i < objCoord.length; i++){
		var data = objCoord[i].varname.substr(-2);
		var index = data[0];
		var coord = data[1];
		var value = objCoord[i].getvalueof(); 
		var exists = 0;
		for(var x = 0; x < objPos.length; x++){
			if(objPos[x][0] == index){
				exists = 1;
				objPos[x][1][coord] = value;
				break;
			}
		}
		if(!exists){
			var v = new Vector();
			v[coord] = value;
			objPos.push([index, v]);
		}
	}
}

/* setblinking() function
 * in case of automatic blinking
 * decided by blinkingstate var
 */
var decr = 0;
function setblinking(){
	if(!decr){
		decr = getsec(blinkingstate[1]);
		blink(blinkingstate[0]);
	} else decr--;
}

/* drawfct() function
 * takes care of layer priority order 
 * while drawing
 * input n : part to draw
 */
function drawfct(n){
	if(n == 4){
		/* layers */
		for(var i = 0; i < layers.length; i++)
			if(!layers[i].draw()){	
				layers[i] = undefined;
				layers.splice(i, 1);
			}
	} else if(n == 1){
		/* draw iterations struct */
		for(var i = 0; i < unchanging.length; i++)
			unchanging[i].draw();
	} else if(n == 2 && !mainblinking){
		/* toplayer of animated changing elems */
		for(var i = 0; i < changingtoplayer.length; i++)
				if(!changingtoplayer[i].draw()){	
					changingtoplayer[i] = undefined;
					changingtoplayer.splice(i, 1);
				}
	} else if(n == 3 && !mainblinking){
		/* bottom layer change */
		for(var i = 0; i < changing.length; i++)
				if(!changing[i].draw()){	
					changing[i] = undefined;
					changing.splice(i, 1);
				}
	} else {
		mainblinking--;
		if(mainblinking == 0) enabletext(1)
	}
}

/*	for(var j = 0; j < objPos.length; j++){
		if(objPos[j][1].dist[]);*/
		//act
		/*post(objPos[j][0]);
		post(objPos[j][1].x);
		post(objPos[j][1].y);
		post(objPos[j][1].z);
		post();
}*/

/* panneldrop() function
 * draw and draw the pannel
 * x length of the "animation" in clockticks
 */
function panneldrop(x){
	var pan = new Rectangle(0., 0., 6, 2, solidcolor);
	pan.drawitfunc = function(){ this.vp.y = (this.vp.y - (2/x)); };
	pan.definedrawflag = function(){ return this.posy > 0; }
	var pantop = new Rectangle(0., .985, 6, .03, solidcolordarker);
	pantop.drawitfunc = function(){ this.vp.y = (this.vp.y - (2/x)); };
	pantop.definedrawflag = function(){ return this.posy > 0; }
	changing.push(pantop);
	changing.push(pan);
}

/* compiling() function
 * catches compiling redondant message
 * implementinf function compile wasn't working
 * and calls clear()
 */
function compiling(){
	clear();
}

/* blink() function
 * makes the UI disapear
 * input tempo : numbers of seconds
 */
function blink(tempo){
	/* multiplied by 2 because mainblink is reduced twice by iteration */
	mainblinking = 2 * getsec(tempo);
	/* handle jit.gl.texts */
	enabletext(0);
}

/* enabletext(i) function
 * send enable(0) or enable(1) message
 * to all jit.gl.text patchers instanciated
 * input i : 0 or 1
 */
var textdisabled = -1; 
function enabletext(i){
	if(!hudoff){
	if(textdisabled != i){
		if(tick < getsec(15)){
			if(tpatch) tpatch.enable(i);
			if(iPatch) iPatch.enable(i);
			if(cPatch) cPatch.enable(i);
			if(ic1Patch) ic1Patch.enable(i);
			if(cc1Patch) cc1Patch.enable(i);
			if(ic2Patch) ic2Patch.enable(i);
			if(cc2Patch) cc2Patch.enable(i);
			if(ic3Patch) ic3Patch.enable(i);
			if(cc3Patch) cc3Patch.enable(i);
			if(ic4Patch) ic4Patch.enable(i);
			if(cc4Patch) cc4Patch.enable(i);
		}
		textdisabled = i;
		/* if patches are deleted, sending em messages 
		 * can cause max to crash so we try to reduce that
		 * chance by as much selection as we can
		 */
		if(e1Patch)	e1Patch.enable(i);
		if(e2Patch)	e2Patch.enable(i);
		if(sPatch) sPatch.enable(i);
		if(aPatch) aPatch.enable(i);
		if(oPatch) oPatch.enable(i);
		if(zPatch) zPatch.enable(i);
	}}
}

/* global variables text patches */
var aPatch = undefined; /* bottom right "Warning" message */
var sPatch = undefined; /* top left "High struct..." message */
var e1Patch = undefined; /* right exclamation mark */
var e2Patch = undefined; /* left exclamation mark */
/* alertstate() function
 * enable alertstate
 */
function alertstate(){
	fadecolor1 = normcolor("#B33A3ABB");
	enablealert = 1;
	if(!aPatch){
		aPatch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		aPatch.text("Warning !!");
		aPatch.gl_color(fadecolor1);
		aPatch.fontsize(22);
		aPatch.position(.5, -.75, 0.);
	}
	if(!sPatch){
		sPatch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		sPatch.text("High structural damage - hull integrity 28%");
		sPatch.gl_color(fadecolor1);
		sPatch.fontsize(13);
		sPatch.position(-2.8, .7, 0.);
	}
	var atri1 = new Triangle(-2.75, .2, fadecolor1, true);
	atri1.vertex1.set(.13, 0., 0.);
	atri1.vertex2.set(0., .2, 0.);
	atri1.vertex3.set(-.13, 0., 0.);
	atri1.definedrawflag = function(){
		this.drawflag = enablealert;
	};
	changing.push(atri1);
	var atri2 = new Triangle(2.75, .2, fadecolor1, true);
	atri2.vertex1.set(.13, 0., 0.);
	atri2.vertex2.set(0., .20, 0.);
	atri2.vertex3.set(-.13, 0., 0.);
	atri2.definedrawflag = function(){
		this.drawflag = enablealert;
	};
	changing.push(atri2);
	
	if(!e1Patch){
		e1Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		e1Patch.text("!");
		e1Patch.gl_color(fadecolor1);
		e1Patch.fontsize(20);
		e1Patch.position(2.735, .24, 0.);
	}
	if(!e2Patch){
		e2Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		e2Patch.text("!");
		e2Patch.gl_color(fadecolor1);
		e2Patch.fontsize(20);
		e2Patch.position(-2.765, .24, 0.);
	}
	blinkingstate = [1, 4];
}
/* safestate() function
 * disable alertstate
 */
function safestate(){
	fadecolor1 = [.2, .55, .9, .8];
	enablealert = 0;

	if(aPatch) this.patcher.remove(aPatch);	
	if(sPatch)	this.patcher.remove(sPatch);	
	if(e1Patch)	this.patcher.remove(e1Patch);
	if(e2Patch)	this.patcher.remove(e2Patch);
	sPatch = undefined;
	e1Patch = undefined;
	e2Patch = undefined;
	aPatch = undefined;
	blinkingstate = [0, 0];
}

/* global variables text patches */
var oPatch = undefined; /* 0 */
var zPatch = undefined; /* 1 */
var blinking = 0; /* flag */

/* topright01() function
 * handles 1 0 situated on top right
 * swaps color 0 from red to blue and other way around
 * each 5s
 * input i : current clocktick
 */
function topright01(i){
	if(!oPatch && !blinking){
		oPatch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		oPatch.text("1 ");
		oPatch.gl_color(fadecolor2);
		oPatch.fontsize(15);
		oPatch.position(2.7, .69, 0.);
		zPatch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		zPatch.text("0");
		zPatch.gl_color(fadecolor2);
		zPatch.fontsize(15);
		zPatch.position(2.8, .69, 0.);
		this.lastcolor = 2;
	} else {
		if(blinking){
			zPatch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
			zPatch.text("0");
			zPatch.gl_color((this.lastcolor == 2) ? fadecolor1 : fadecolor2);
			this.lastcolor = (this.lastcolor == 2) ? 1 : 2;
			zPatch.fontsize(15);
			zPatch.position(2.8, .69, 0.);
			blinking = 0;
		} else if(i % getsec(5) == 0){
			this.patcher.remove(zPatch);
			zPatch = undefined;
			blinking = 1;
		}
	}
}
/* clear() function 
 * Get rid of patchers that doesn't remove themselves
 * empty lists in case
 */
function clear(){
	if(oPatch) this.patcher.remove(oPatch);
	if(zPatch) this.patcher.remove(zPatch);
	if(tpatch) this.patcher.remove(tpatch);
	if(iPatch) this.patcher.remove(iPatch);
	if(cPatch) this.patcher.remove(cPatch);
	if(ic1Patch) this.patcher.remove(ic1Patch);
	if(cc1Patch) this.patcher.remove(cc1Patch);
	if(ic2Patch) this.patcher.remove(ic2Patch);
	if(cc2Patch) this.patcher.remove(cc2Patch);
	if(ic3Patch) this.patcher.remove(ic3Patch);
	if(cc3Patch) this.patcher.remove(cc3Patch);
	if(ic4Patch) this.patcher.remove(ic4Patch);
	if(cc4Patch) this.patcher.remove(cc4Patch);
	if(aPatch) this.patcher.remove(aPatch);
	if(sPatch) this.patcher.remove(sPatch);
	if(e1Patch)	this.patcher.remove(e1Patch);
	if(e2Patch)	this.patcher.remove(e2Patch);
	if(changing) changing = [];
	if(changingtoplayer)(changingtoplayer) = [];
	if(unchanging) unchanging = [];
}
/* turnoff() function
 * turns of all hud
 * keeps structures
 * calls the end
 */
function turnoff(){
	var u = unchanging;
	clear();
	unchanging = u;
	hudoff = 1;
	theend();
}

/* theend() function
 * end of the piece
 * red filter then fades to black
 */
function theend(i){
	var c = normcolor("#B33A3A"); // red
	var red = new Rectangle(0., 0., 12., 4., c);
	red.color[3] = .1;
	red.drawitfunc = function(){
		this.color[3] += .4/getsec(1);
	}
	red.definedrawflag = function(){
		this.drawflag = this.color[3] < .5;
	}
	layers.push(red);
	
	var black = new Rectangle(0., 0., 12., 4., [0., 0., 0., 1.]);
	black.startbang = tick + getsec(1) + 1;
	black.drawitfunc = function(){
		if(tick == this.startbang)
			this.color[3] = .2;
		else if(tick > this.startbang)
			this.color[3] = Math.min(this.color[3] + .8/122., 1.);
	}
	layers.push(black);
}

/* resetblinkingstate() function
 * resets blinking state variable
 * to initial
 */
function resetblinkingstate(){
	blinkingstate = [0, 0];
}
/* bholeblinkingstate() function
 * sets blinkingstate for black hole
 */
function bholeblinkingstate(){
	blinkingstate = [1, 4];
}

/* global variables text patch */
var tpatch = undefined; /*greetings text */
/* flags */
var cg = 0;
var cg2 = 0;
var acc = 0;
var blinked = 0;
/* greetings() function
 * write progressively greetings message
 * input i : current clocktick - a constant so it starts at 0
 */
function greetings(i){
	/* display :
	"Good morning commander !" 
	at the begining of the piece.
	Constraints : 1- letters should appear one by one
				  2- full text should blink after being printed
	*/
	var fsize  = 22;
	var pos = [.5, -.75, 0.];
	var text = "Good Morning Commander !!";
	var index = i - acc;

	/* we take act 1 click over 4 */
	if(cg < 4) { cg++; acc++; }
	else {
		if(index < text.length) {
			if(tpatch) {
				this.patcher.remove(tpatch);
				tpatch = undefined;
			}
			var subs = text.substring(0, index);
			tpatch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
			tpatch.text(subs);
			tpatch.gl_color(fadecolor1);
			tpatch.fontsize(fsize);
			tpatch.position(pos);
		} else {
			if(blinked < 3){
				if(tpatch) {
					this.patcher.remove(tpatch);	
					tpatch = undefined;
				} else {
					var subs = text.substring(0, index);
					tpatch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
					tpatch.text(text);
					tpatch.gl_color(fadecolor1);
					tpatch.fontsize(fsize);
					tpatch.position(pos);
					blinked++;
				}
			} else {
				if(cg2 > 25){
					this.patcher.remove(tpatch);
					tpatch = undefined;
					cg = undefined;
					cg2 = undefined;
					acc = undefined;
					blinked = undefined;
					this.state = 1; // When whole animation is done
				} else cg2++;
			}
		}
		cg = 0;
	}
}

/* global variables text patch */
var iPatch = undefined; /* top left message "initialize" */
var cPatch = undefined; /* [sym] symbol before the message that represents progress*/
/* flag */
var rln = 0;
/* progression chars */
var loadchars = ["|", "/", "-", "\\"];
/* initialize() function
 * displays initialisation on top left part
 * displays a progression character
 * make change character
 * is calling initchild1-4 which are 4 messages following same 
 * "progression" pattern
 * input : current clocktick - a constant so it starts at 0
 */
function initialize(i){
	/* display :
	"|/-\ Initialisation" 
	5 seconds
	*/
	//post(i);
	var nbticks = getsec(5);
	var c = Math.floor(nbticks/4);
	var n = Math.floor(i/(c));
	if(n > 3) n = 3;
	if(n >= 0) initchild1(i);
	if(n >= 1) initchild2(i-c);
	if(n >= 2) initchild3(i-(2*c));
	if(n >= 3) initchild4(i-(3*c));
	if(!iPatch && !cPatch){ 
		iPatch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		iPatch.text("Initialisation");
		iPatch.gl_color(fadecolor1);
		iPatch.fontsize(22);
		iPatch.position(-2.3, .7, 0.);
		cPatch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		cPatch.text("["+loadchars[n]+"]");
		cPatch.gl_color(fadecolor1);
		cPatch.fontsize(22);
		cPatch.position(-2.45, .7, 0.);
	}
	if(rln != n){
		this.patcher.remove(cPatch);
		cPatch = undefined;
		cPatch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		cPatch.text("["+loadchars[n]+"]");
		cPatch.gl_color(fadecolor1);
		cPatch.fontsize(22);
		cPatch.position(-2.45, .7, 0.);
	}
	if(i == nbticks-1){
		this.patcher.remove(iPatch);
		this.patcher.remove(cPatch);
		this.patcher.remove(ic1Patch);
		this.patcher.remove(cc1Patch);
		this.patcher.remove(ic2Patch);
		this.patcher.remove(cc2Patch);
		this.patcher.remove(ic3Patch);
		this.patcher.remove(cc3Patch);
		this.patcher.remove(ic4Patch);
		this.patcher.remove(cc4Patch);
	}
	if(i == nbticks){
		iPatch = undefined;
		cPatch = undefined;
		ic1Patch = undefined;
		cc1Patch = undefined;
		ic2Patch = undefined;
		cc2Patch = undefined;
		ic3Patch = undefined;
		cc3Patch = undefined;
		ic4Patch = undefined;
		cc4Patch = undefined;
	}
	rln = n;
}

/* global variables text patch */
var ic1Patch = undefined;
var cc1Patch = undefined;
/* flag */
var ri1n = 0;
/* initchild1-4() functions
 * roughly the same as initialise()
 * different message, different location
 */
function initchild1(x){
	var nbticks = Math.round(getsec(5) / 4);
	var n = Math.floor(x/(nbticks/4));
	if(n>3) n = 3;
	if(!ic1Patch && !cc1Patch){ 
		ic1Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		ic1Patch.text("Antimater engines");
		ic1Patch.gl_color(fadecolor1);
		ic1Patch.fontsize(15);
		ic1Patch.position(1.15, .5, 0.);
		cc1Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		cc1Patch.text("["+loadchars[n]+"]");
		cc1Patch.gl_color(fadecolor1);
		cc1Patch.fontsize(15);
		cc1Patch.position(1., .5, 0.);
	}
	if(ri1n != n){
		this.patcher.remove(cc1Patch);
		cc1Patch = undefined;
		cc1Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		cc1Patch.text("["+loadchars[n]+"]");
		cc1Patch.gl_color(fadecolor1);
		cc1Patch.fontsize(15);
		cc1Patch.position(1, .5, 0.);
	}
	ri1n = n;
}

var ic2Patch = undefined;
var cc2Patch = undefined;
var ri2n = 0;
function initchild2(x){
	var nbticks = Math.round(getsec(5) / 4);
	var n = Math.floor(x/(nbticks/4));
	if(n>3) n = 3;
	if(!ic2Patch && !cc2Patch){ 
		ic2Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		ic2Patch.text("Enabling localisation");
		ic2Patch.gl_color(fadecolor1);
		ic2Patch.fontsize(15);
		ic2Patch.position(1.15, .4, 0.);
		cc2Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		cc2Patch.text("["+loadchars[n]+"]");
		cc2Patch.gl_color(fadecolor1);
		cc2Patch.fontsize(15);
		cc2Patch.position(1., .4, 0.);
	}
	if(ri2n != n){
		this.patcher.remove(cc2Patch);
		cc2Patch = undefined;
		cc2Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		cc2Patch.text("["+loadchars[n]+"]");
		cc2Patch.gl_color(fadecolor1);
		cc2Patch.fontsize(15);
		cc2Patch.position(1, .4, 0.);
	}
	ri2n = n;
}

var ic3Patch = undefined;
var cc3Patch = undefined;
var ri3n = 0;
function initchild3(x){
	var nbticks = Math.round(getsec(5) / 4);
	var n = Math.floor(x/(nbticks/4));

	if(n>3) n = 3;
	if(!ic3Patch && !cc3Patch){ 
		ic3Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		ic3Patch.text("Full ship powering");
		ic3Patch.gl_color(fadecolor1);
		ic3Patch.fontsize(15);
		ic3Patch.position(1.15, .3, 0.);
		cc3Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		cc3Patch.text("["+loadchars[n]+"]");
		cc3Patch.gl_color(fadecolor1);
		cc3Patch.fontsize(15);
		cc3Patch.position(1., .3, 0.);
	}
	if(ri3n != n){
		this.patcher.remove(cc3Patch);
		cc3Patch = undefined;
		cc3Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		cc3Patch.text("["+loadchars[n]+"]");
		cc3Patch.gl_color(fadecolor1);
		cc3Patch.fontsize(15);
		cc3Patch.position(1, .3, 0.);
	}
	ri3n = n;
}

var ic4Patch = undefined;
var cc4Patch = undefined;
var ri4n = 0;
function initchild4(x){
	var nbticks = Math.round(getsec(5) / 4);
	var n = Math.floor(x/(nbticks/4));

	if(n>3) n = 3;
	if(!ic4Patch && !cc4Patch){ 
		ic4Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		ic4Patch.text("Vulture I.A v3.5.2");
		ic4Patch.gl_color(fadecolor1);
		ic4Patch.fontsize(15);
		ic4Patch.position(1.15, .2, 0.);
		cc4Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		cc4Patch.text("["+loadchars[n]+"]");
		cc4Patch.gl_color(fadecolor1);
		cc4Patch.fontsize(15);
		cc4Patch.position(1., .2, 0.);
	}
	if(ri4n != n){
		this.patcher.remove(cc4Patch);
		cc4Patch = undefined;
		cc4Patch = this.patcher.newdefault(50, 50, "jit.gl.text", "2DShapes");
		cc4Patch.text("["+loadchars[n]+"]");
		cc4Patch.gl_color(fadecolor1);
		cc4Patch.fontsize(15);
		cc4Patch.position(1, .2, 0.);
	}
	ri4n = n;
}

/* flag */
var cr = 0;
/* radar() function
 * creates swiping circle on the compass
 */
function radar(){
	/* temporisations are counted in renderbangs ticks */
	if(!cr){
		var r1 = new Circle(-2.45, -.465, .01, white, true);
		r1.drawitfunc = function(){
			if(!this.tempoflag){
				if(this.radius < .24) this.radius += 0.002;
				else {
					this.tempoflag = 1;
					this.tempo = getsec(3); // 4 seconds
					this.radius = .0001;
				}
			} else {
				if(this.tempo != 0) this.tempo--;
				else this.tempoflag = 0;
			}
		};
		changingtoplayer.push(r1);
		cr++;
	}
}

/* loadbar() function
 * creates and animate loadbar
 * (the 4 squares in bottom left)
 * i current tick
 */
function loadbar(i){
	if(i == getsec(5)){
		var lb1 = new Rectangle(-2.118, -.5325, .05 , .05, fadecolor1);
		lb1.drawitfunc = function(){ this.color = fadecolor1; }
		lb1.setrotation(.83)
		changing.push(lb1);
	}

	if(i == getsec(8)){
		var lb2 = new Rectangle(-2.075, -.575, .05 , .05, fadecolor1);
		lb2.drawitfunc = function(){ this.color = fadecolor1; }
		lb2.setrotation(.83)
		lb2.changeflag = 1;
		changing.push(lb2);
	}
	if(i == getsec(15)){
		var lb3 = new Rectangle(-2.035, -.615, .05 , .05, fadecolor1);
		lb3.setrotation(.83)
		lb3.changeflag = 1;
		lb3.blinkflag = 0;
		lb3.drawitfunc = function(){
			this.color = fadecolor1;
			if(tick % getsec(5) == 0){
				this.vsize.x = 0;
				this.vsize.y = 0;			
				this.blinkflag = getsec(1.5);
			} else if(this.blinkflag > 0) this.blinkflag--;
			if(this.blinkflag == 0) {
				this.vsize.x = .05;
				this.vsize.y = .05;	
			}
		};
		changing.push(lb3);
	}
}

/* fixedelems() function
 * creates the "fixed" elements
 * that shouldn't move
 * actually animated at the begining then added to the changing list
 * input it : current clocktick - constant so it starts at 0
 */
function fixedelems(it){
	
	var eventtick = getsec(5);
	
	var dimradar = .3;
	var dimradar2 = .24;
	var width1 = .25;
	var width2 = 1.395;
	var width3 = 4.0;
	var bl1width = .45;
	var bl2width = 1.5;
	var bl3width = .21;
	var bl4width = 4.9;
	
	if(it != undefined && it < getsec(5)){
		dimradar = dimradar / eventtick * it;
		dimradar2 = dimradar2 / eventtick * it;
		width1 = width1 / eventtick * it;
		width2 = width2 / eventtick * it;
		width3 = width3 / eventtick * it;
		bl1width = bl1width / eventtick * it;
		bl2width = bl2width / eventtick * it;
		bl3width = bl3width / eventtick * it;
		bl4width = bl4width / eventtick * it;
	}

	/* TOP LINE PATTERN */
	var tl1 = new Rectangle(0, .55, width2, linec, fadecolor1);
	var tl2 = new Rectangle(-.81, .6, width1, linec, fadecolor1);
	tl2.setrotation(-.4);
	var tl3 = new Rectangle(.81, .6, width1, linec, fadecolor1);
	tl3.setrotation(.4);
	var t14 = new Rectangle(2.92, .649, width3, linec, fadecolor1);
	var t15 = new Rectangle(-2.92, .649, width3, linec, fadecolor1);

	/*RADAR */
	var blcc1 = new Circle(-2.45, -.465, dimradar, fadecolor1);
	var blcc2 = new Circle(-2.45, -.465, (dimradar-linec), [0., 0., 0., 0.]);
	var blcc3 = new Circle(-2.45, -.465, dimradar2, fadecolor2);
		/*COMPASS*/
	var mapl1 = new Rectangle(-2.45, -.465, (2*dimradar2), .006, fadecolor3);
	var mapl2 = new Rectangle(-2.45, -.465, (2*dimradar2), .006, fadecolor3);
	var mapl3 = new Rectangle(-2.45, -.465, (2*dimradar2), .006, fadecolor3);
	var mapl4 = new Rectangle(-2.45, -.465, (2*dimradar2), .006, fadecolor3);
	mapl2.setrotation(1.57);
	mapl3.setrotation(1.57 / 2);
	mapl4.setrotation(1.57 * 1.5);
	
	mapl1.draw();
	mapl2.draw();
	mapl3.draw();
	mapl4.draw();


	/* BOTTOM LINE PATTERN */
	var blcl1 = new Rectangle(-2.1, -.5, bl1width, linec, fadecolor1);
	blcl1.setrotation(-.8);
	var blcl2 = new Rectangle(-2.2, -.5, bl1width, linec, fadecolor1);
	blcl2.setrotation(-.8);
	var blcl3 = new Rectangle(-1.298, -.66, bl2width, linec, fadecolor1);
	var blcl4 = new Rectangle(-0.465, -.719, bl3width, linec, fadecolor1);
	blcl4.setrotation(-.6);
	var blcl5 = new Rectangle(2.068, -.78, bl4width, linec, fadecolor1);
		
	if(it != undefined){
		tl1.draw();
		tl2.draw();
		tl3.draw();
		t14.draw();
		t15.draw();
		mapl1.draw();
		mapl2.draw();
		mapl3.draw();
		mapl4.draw();
		blcc3.draw();
		blcc2.draw();
		blcc1.draw();
		blcl1.draw();
		blcl2.draw();
		blcl3.draw();
		blcl4.draw();
		blcl5.draw();
	} else {
		tl1.drawitfunc = function(){ this.color = fadecolor1; };
		tl2.drawitfunc = function(){ this.color = fadecolor1; };
		tl3.drawitfunc = function(){ this.color = fadecolor1; };
		t14.drawitfunc = function(){ this.color = fadecolor1; };
		t15.drawitfunc = function(){ this.color = fadecolor1; };
		blcl1.drawitfunc = function(){ this.color = fadecolor1; };
		blcl2.drawitfunc = function(){ this.color = fadecolor1; };
		blcl3.drawitfunc = function(){ this.color = fadecolor1; };
		blcl4.drawitfunc = function(){ this.color = fadecolor1; };
		blcl5.drawitfunc = function(){ this.color = fadecolor1; };
		blcc1.drawitfunc = function(){ this.color = fadecolor1; };

		changing.push(tl1);
		changing.push(tl2);
		changing.push(tl3);
		changing.push(t14);
		changing.push(t15);
		changing.push(mapl1);
		changing.push(mapl2);
		changing.push(mapl3);
		changing.push(mapl4);
		changing.push(blcc3);
		changing.push(blcc2);
		changing.push(blcc1);
		changing.push(blcl1);
		changing.push(blcl2);
		changing.push(blcl3);
		changing.push(blcl4);
		changing.push(blcl5);
	}
}

/* structures() function
 * create fixed structures elements with alpha channel = 1.
 * parts of the ship. Shouldn't move, shouldn't be transparent.
 * created once and added to unchanging.
 */
function structures(){
	/* TOP CIRCLE */
	var topc = new Circle(0., 2.2, 1.575, solidcolor);
	var topc2 = new Circle(0., 2.2, 1.505, white);
	var topc3 = new Circle(0., 2.2, 1.5, solidcolor);
	unchanging.push(topc3);
	unchanging.push(topc2);
	unchanging.push(topc);

	/* BOTTOM TRIANGLE */
	var blct = new Triangle(-2.4, -1., solidcolor);
	blct.vertex1.set(.3, 0., 0.);
	blct.vertex2.set(-2., 1.6, 0);
	blct.vertex3.set(-2., 0., 0);
	var blct2 = new Triangle(-2.4, -1., white);
	blct2.vertex1.set(.3, 0., 0.);
	blct2.vertex2.set(-2., 1.6, 0);
	blct2.vertex3.set(-2., 0., 0);
	blct2.size = 0.85;
	var blct3 = new Triangle(-2.4, -1., solidcolor);
	blct3.vertex1.set(.3, 0., 0.);
	blct3.vertex2.set(-2., 1.6, 0);
	blct3.vertex3.set(-2., 0., 0);
	blct3.size = 0.8;
	unchanging.push(blct3);
	unchanging.push(blct2);
	unchanging.push(blct);
}


/* functions */

/* normcolor() function
 * change a list of unnormalized colors or some hexadecimal color
 * with a lot of flexibility
 * input rgba : the color
 */
function normcolor(rgba){
	if(typeof(rgba) == "object") // expect list of values between 0 and 255
		for(var x = 0; x < rgba.length; x++)
			rgba[x] = rgba[x] / 255; 
	else if(typeof(rgba) == "string"){ // expect hexrgba
		var str = rgba; rgba = [];
		if(str[0] == "#") str = str.substring(1);
		for(var x = 0; x <= 4; x++){
			var part = str.substring(0 , 2);
			str = str.substring(2);
			if(!part) part = 255;
			else part = parseInt(part, 16);
			rgba[x] = part;
		}
		rgba = normcolor(rgba);
	}
	return rgba;
}

/* prototypes */
/* function to test x in list */
Object.prototype.in = function(array) {
	for(var i in array)
		if(this == array[i]) return true;
	return false;
}