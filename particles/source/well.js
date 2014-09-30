
function Well(x,M,R){
	this.x = x; // position (x,y)
	this.M = M; // gravitational mass
	this.R = R; // radius
}
Well.prototype = {
	isInside: function(pos){
		return (pos.subtract(this.x).euclidLength()-this.R)<1;
	},
	draw:function(){
		canvas.circle(this.x, this.R);
		canvas.circle(this.x, this.R-2);
	}
};
