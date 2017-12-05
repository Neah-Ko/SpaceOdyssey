var Triangle = (function() {
	function Triangle(posx, posy, color, frame) {
		if(!(posx && posy)) this.position = new Vector();
		else this.position = new Vector(posx, posy, 0.);

		this.vertex1 = new Vector();
		this.vertex2 = new Vector();
		this.vertex3 = new Vector();
		this.velocity = new Vector();
		this.size = 1;
		this.sizev = 0;
		this.rotation = 0;
		this.drawflag = 1;
		this.color = color || [1., 1., 1., 1.];
		this.drawfunc = undefined;
		this.frame = frame || false;
	};

	Triangle.prototype = {
		setsize: 
			function(s) {
				this.size = s;
			},
			
		getsize:
			function() {
				return this.size;
			},

		setsizev: 
			function(v) {
				this.sizev = v;
			},
			
		getsizev:
			function() {
				return this.sizev;
			},

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
					sketch.moveto(this.position.x, this.position.y, 0.);
					var v1 = new Vector(this.vertex1.x, this.vertex1.y, 0.);
					var v2 = new Vector(this.vertex2.x, this.vertex2.y, 0.);
					var v3 = new Vector(this.vertex3.x, this.vertex3.y, 0.);
					v1 = rotatev2d(v1, this.rotation);
					v2 = rotatev2d(v2, this.rotation);
					v3 = rotatev2d(v3, this.rotation);
					v1.mult(this.size);
					v2.mult(this.size);
					v3.mult(this.size);
					v1.add(this.position);
					v2.add(this.position);
					v3.add(this.position);
					sketch.glcolor(this.color);
					
					if(!this.frame) sketch.tri(v1.x, v1.y, 0, v2.x, v2.y, 0, v3.x, v3.y, 0);
					else sketch.frametri(v1.x, v1.y, 0, v2.x, v2.y, 0, v3.x, v3.y, 0);
					
					this.drawitfunc();
					this.definedrawflag();
					return 1;
				} else return 0;
			}
	};
// stuff to make it all work
	function createTriangleMethod(method) {
		return function(v1, v2) {
			var v = v1.get();
			v[method](v2);
			return v;
		};
	}
	for (var method in Triangle.prototype)
		if (Triangle.prototype.hasOwnProperty(method) && !Triangle.hasOwnProperty(method))
		  	Triangle[method] = createTriangleMethod(method);
	return Triangle;
}());