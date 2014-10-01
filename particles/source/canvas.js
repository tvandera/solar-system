
 // Jupiter (69,911 km / 43,441 miles) – 1,120% the size of Earth
 // Saturn (58,232 km / 36,184 miles) – 945% the size of Earth
 // Uranus (25,362 km / 15,759 miles) – 400% the size of Earth
 // Neptune (24,622 km / 15,299 miles) – 388% the size of Earth
 // Earth (6,371 km / 3,959 miles)
 // Venus (6,052 km / 3,761 miles) – 95% the size of Earth
 // Mars (3,390 km / 2,460 miles) – 53% the size of Earth
 // Mercury (2,440 km / 1,516 miles) – 38% the size of Earth

var planets = [ "mercury", "mars", "venus", "earth", "neptune", "uranus", "saturn", "jupiter"];
var sizes = [ 0.3511, 0.8708, 0.9177, 0.4888, 10.2866, 8.6717, 3.6776, 3.5635 ];
var dists = [ 8.33, 15.57, 21.53, 32.80, 111.99, 205.67, 413.09, 648.10 ];
var images = new Array();

function Canvas(id){
	this.canvas = document.getElementById(id);

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 200;

	this.ctx = this.canvas.getContext('2d');
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.fill_color = "orange";
	this.stroke_color = "yellow";

        var count = planets.length;
        for(i = 0; i < count; i++) {
            images[i] = new Image();
            images[i].src = planets[i] + ".png";
        }

        sun = new Image();
        sun.src = "sun.png";
}
Canvas.prototype={
	center: function(){
		return $V([this.width/2,this.height/2]);
	},
        randomPlanet: function() {
		return Math.floor(Math.random() * planets.length);
	},
	randomCoordinate: function(){
		var r1 = (Math.random()<0.5?-Math.random():Math.random());
		var r2 = (Math.random()<0.5?-Math.random():Math.random());
		var c = this.center();
		return c.add([c.elementAt(1)*r1/2,c.elementAt(2)*r2/2]);
	},
	isInside: function(p){
		return (p.elementAt(1)>0 && p.elementAt(2)>0 && p.elementAt(1) < this.width && p.elementAt(2) < this.height);
	},
	clear: function(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	},
        sun : function(p,r){
            var sz = WR*r;
            this.ctx.drawImage(sun, p.elementAt(1) - sz/2, p.elementAt(2) - sz/2, sz, sz);
        },
        planet : function(i,p){
            var sz = WR*sizes[i];
            this.ctx.drawImage(images[i], p.elementAt(1) - sz/2, p.elementAt(2) - sz/2, sz, sz);
        },
	circle: function(p,r){
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.stroke_color;
		this.ctx.fillStyle = this.fill_color;
		this.ctx.moveTo(p.elementAt(1)+r,p.elementAt(2));
		this.ctx.arc(p.elementAt(1), p.elementAt(2), r, 0, 2*PI, true);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.restore();
	},
	line: function(x1,x2){
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.stroke_color;
		this.ctx.moveTo(x1.elementAt(1),x1.elementAt(2));
		this.ctx.lineTo(x2.elementAt(1),x2.elementAt(2));
		this.ctx.stroke();
		this.ctx.restore();
	},
	ellipse: function(a,b,r,c){
		var a_b = a.subtract(b);
		var q = a_b.scale( 1+(r/a_b.euclidLength()) );

		var a1 = b.add(q);
		var b1 = a.subtract(q);
		
		var a_a1 = a.subtract(a1);
		var a_a11 = a_a1.elementAt(1);
		var a_a12 = a_a1.elementAt(2);
		
		var b_b1 = b.subtract(b1);
		var b_b11 = b_b1.elementAt(1);
		var b_b12 = b_b1.elementAt(2);
		
		var c1 = b1.add([-1.2*b_b12,1.2*b_b11]);
		var c2 = a1.add([1.2*a_a12,-1.2*a_a11]);
		var c3 = a1.add([-1.2*a_a12,1.2*a_a11]);
		var c4 = b1.add([1.2*b_b12,-1.2*b_b11]);
		
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.fillStyle = c;
		this.ctx.moveTo(b1.elementAt(1),b1.elementAt(2));
		this.ctx.bezierCurveTo(c1.elementAt(1),c1.elementAt(2),c2.elementAt(1),c2.elementAt(2)  ,a1.elementAt(1),a1.elementAt(2));
		this.ctx.bezierCurveTo(c3.elementAt(1),c3.elementAt(2),c4.elementAt(1),c4.elementAt(2)  ,b1.elementAt(1),b1.elementAt(2));
		this.ctx.fill();
		this.ctx.strokeStyle = this.stroke_color;
		this.ctx.stroke();
		this.ctx.restore();
	}
};
