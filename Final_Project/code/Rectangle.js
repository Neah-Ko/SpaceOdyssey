var Rectangle = (function() {
	function Rectangle(posx, posy, sizex, sizey, color) {
		/* vector position : center point */
		this.vp = new Vector(posx, posy, 0.);
		/* vector size */
		this.vsize = new Vector(sizex, sizey, 0.);
		/* c1-c4 : corners */
		this.c1 = new Vector();
		this.c2 = new Vector();
		this.c3 = new Vector();
		this.c4 = new Vector();

		/* env vars */
		this.rotation = 0;
		this.drawflag = 1;
		this.color = color || [1., 1., 1., 1.];
	};

	Rectangle.prototype = {
		setrotation: 
			function(theta) {
				this.rotation = theta;
			},

		getrotation:
			function() {
				return this.rotation;
			},

		setdrawflag: 
			function(f) {
				this.drawflag = f;
			},

		getdrawflag:
			function() {
				return this.drawflag;
			},

		setcolor:
			function(r, g, b, a) {
				this.color = [r, g, b, a];
			},

		definedrawflag:
			function() {
				this.drawflag = 1;
			},

		drawitfunc:
			function(){},

		draw:
			function(sketch) {
				if(this.drawflag){
					if(!sketch) sketch = defaultsketch();
					/* corners */
					this.c1 = new Vector(this.vp.x - (this.vsize.x / 2),
										 this.vp.y + (this.vsize.y / 2),
										 0.);
					this.c2 = new Vector(this.vp.x + (this.vsize.x / 2),
										 this.vp.y + (this.vsize.y / 2),
										 0.);
					this.c3 = new Vector(this.vp.x + (this.vsize.x / 2),
										 this.vp.y - (this.vsize.y / 2),
										 0.);
					this.c4 = new Vector(this.vp.x - (this.vsize.x / 2),
										 this.vp.y - (this.vsize.y / 2),
										 0.);
					if(this.rotation){
						var c1temp = new Vector(this.c1.x - this.vp.x,
												this.c1.y - this.vp.y,
							                    0.);
						c1temp = rotatev2d(c1temp, this.rotation);
						c1temp.add(this.vp);
						this.c1 = c1temp;
						var c2temp = new Vector(this.c2.x - this.vp.x,
												this.c2.y - this.vp.y,
							                    0.);
						c2temp = rotatev2d(c2temp, this.rotation);
						c2temp.add(this.vp);
						this.c2 = c2temp;
						var c3temp = new Vector(this.c3.x - this.vp.x,
												this.c3.y - this.vp.y,
							                    0.);
						c3temp = rotatev2d(c3temp, this.rotation);
						c3temp.add(this.vp);
						this.c3 = c3temp;
						var c4temp = new Vector(this.c4.x - this.vp.x,
												this.c4.y - this.vp.y,
							                    0.);
						c4temp = rotatev2d(c4temp, this.rotation);
						c4temp.add(this.vp);
						this.c4 = c4temp;
					}
					sketch.glcolor(this.color);
					// quad <x1> <y1> <z1> <x2> <y2> <z2> <x3> <y3> <z3> <x4> <y4> <z4>
					sketch.quad(this.c1.x, this.c1.y, 0,  // top left
								this.c2.x, this.c2.y, 0,  // top right
								this.c3.x, this.c3.y, 0,  // bottom right 
								this.c4.x, this.c4.y, 0); // bottom left
					
					this.drawitfunc();
					this.definedrawflag();
					return 1;
				} else return 0;
			}
	};

	function createRectangleMethod(method) {
		return function(v1, v2) {
			var v = v1.get();
			v[method](v2);
			return v;
		};
	}
	for (var method in Rectangle.prototype)
		if (Rectangle.prototype.hasOwnProperty(method) && !Rectangle.hasOwnProperty(method))
			Rectangle[method] = createRectangleMethod(method);
	return Rectangle;
}());