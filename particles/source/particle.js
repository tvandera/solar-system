
function Particle(x,old_x) {
	this.x = x;
	this.old_x = old_x;
	this.a;
        this.fill_color = 'blue';
}

Particle.prototype = {
	update: function(){
		var temp_x = this.x;
                this.x = this.a.scale(DT*DT).add( temp_x.scale(2).subtract(this.old_x) );
		this.old_x = temp_x;
		
	},
	getPosition: function(){
		return this.x;
	},
	setAcceleration:function(a){
		this.a = a;
	},
	draw: function(){
		//canvas.ellipse(this.x,this.old_x,PR,this.fill_color);
                canvas.planet(this.x, PR);
	}
};


