
function Particle(x,old_x,p) {
	this.x = x;
	this.old_x = old_x;
	this.a;
        this.planet = p;
}

Particle.prototype = {
	update: function(){
                if (this.a != undefined) {
		var temp_x = this.x;
                this.x = this.a.scale(DT*DT).add( temp_x.scale(2).subtract(this.old_x) );
		this.old_x = temp_x;
                }
		
	},
	getPosition: function(){
		return this.x;
	},
	setAcceleration:function(a){
		this.a = a;
	},
	draw: function(){
                canvas.planet(this.planet, this.x, PR);
	}
};


