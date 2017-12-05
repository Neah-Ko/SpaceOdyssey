var Circle = (function() {
	function Circle(x, y, r, color, frame) {
		this.position = new Vector(x, y, 0);
		this.velocity = new Vector(x, y, 0);
		this.radius = r || 1;
		this.radiusv = 0.;
		this.drawflag = 1;
		this.color = color || [1., 1., 1., 1.];
		this.frame = frame || false;
	};

	Circle.prototype = {
		setradius: 
			function(r) {
				this.radius = r;
			},

		getradius:
			function() {
				return this.radius;
			},

		setradiusv: 
			function(v) {
				this.radiusv = v;
			},

		getradiusv:
			function() {
				return this.radiusv;
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

		/* The functions definedrawflag and drawitfunc are meant to get
		instanciated for morphing 2D objects. */

		/*	definedrawflag, the test that should be performed to 
		determine to validity of drawflag. In case of a reducing
		circle it could be function(){ this.drawflag = this.radius > 0; }*/
		definedrawflag:
			function() {
				this.drawflag = 1;
			},

		/* drawitfunc, the action that should be performed each time
		the object is drawn. For exemple, for a reducing circle it can
		be function(){ this.radius -= alpha; }
		*/
		drawitfunc:
			function(){},

		draw:
			function(sketch) {
				/* draw shall only be performed if drawflag is 1 */
				if(this.drawflag){
					if(!sketch) sketch = defaultsketch();
					sketch.moveto(this.position.x, this.position.y, 0.);
					sketch.glcolor(this.color);
					if(!this.frame) sketch.circle(this.radius);
					else sketch.framecircle(this.radius);
					this.drawitfunc();
					this.definedrawflag();
					return 1;
				} else return 0;
				/* else we return 0 to splice the element of the list */
			}
	};

	function createCircleMethod(method) {
		return function(v1, v2) {
			var v = v1.get();
			v[method](v2);
			return v;
		};
	}
	for (var method in Circle.prototype)
		if (Circle.prototype.hasOwnProperty(method) && !Circle.hasOwnProperty(method))
			Circle[method] = createCircleMethod(method);
	return Circle;
}());