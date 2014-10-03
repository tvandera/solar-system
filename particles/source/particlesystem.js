
/* CONSTANTS */
var PI = Math.PI;
var DT = 1/30;
var DTDT = DT*DT;
var GM = 6000;
var MAX_WR = 40;
var MIN_WR = 10;
var WR = 10;
var PR = 5;
var SZ = 20; // scale size of planets and suns
var DS = 70; // scale distance of planets and suns

/* VARIABLES */
var canvas;
var system;
var timer;
var mouse_down = false;
var initial_position = null;
var mouse_position = null;
var mouse_type;
var zoom = 1.0;

function init(){
	canvas = new Canvas('canvas');
	system = new ParticleSystem();
	mouse_down = false;
	initial_position = null;
	mouse_position = null;
        custom_code = null;

        system.solarSystem();

	timer = setInterval(run,1/DT);
}
function run(){
	canvas.clear();

	system.update();
	if(mouse_down && initial_position != null){
		if(mouse_type == "particle"){
			canvas.circle(initial_position,PR);
			canvas.line(initial_position,mouse_position);
		}else{
			var r = initial_position.subtract(mouse_position).euclidLength();
			if(r<MIN_WR){
				r = MIN_WR;
			}else if(r>MAX_WR){
				r = MAX_WR
			}
			canvas.circle(initial_position, r);
			canvas.circle(initial_position, r-2);
		}
	}
}
function reset(){
	clearInterval(timer);
	init();
}
function stop(){
	clearInterval(timer);
}
function ParticleSystem(){
	this.wells = new Array();
	this.particles = new Array();
}
ParticleSystem.prototype = {
	addWell: function(x,r){
		x = x || canvas.randomCoordinate();
		r = r || MIN_WR+((MAX_WR-MIN_WR)*Math.random());
		gm = (GM/WR)*r;
		this.wells.push(new Well(x,gm,r));
	},
	dropWell: function(x){
		if(this.wells.length>0){
			this.wells.pop();
		}
	},
        zoom : function(f) {
                canvas.scale(f);
        },
	addParticle: function(x1,x2,p){
		x1 = x1 || canvas.randomCoordinate();
		x2 = x2 || canvas.randomCoordinate(x1);
                if (p == undefined) p = canvas.randomPlanet();
		this.particles.push(new Particle(x1,x2,p));
	},
	dropParticle: function(){
		if(this.particles.length>0){
			this.particles.pop();
		}
	},
	dropAll: function(){
                this.wells = [];
                this.particles = [];
	},
        solarSystem: function(){
            this.addWell(canvas.center(),MIN_WR);

            for(i=0; i<planets.length; i++) {
                d = DS*Math.log(dists[i]);
                p1 = canvas.center().add([0,d]); 
                p2 = canvas.center().add([-4.5,d]); 
                system.addParticle(p1,p2,i);
            }
        },
        /* for particle p:
         *   for each well:
         *      update force vector 'a' based on
         *         position of p
         *         size of well
         */
        customCode:function(c) {
            this.custom_code = c;
        },
	accumulateForces:function(){
           if (this.custom_code) eval(this.custom_code);
           else
                for(var i=0; this.particles[i]; i++){
                var p = this.particles[i];
                var a = $V([0,0]);
                for(var j=0; this.wells[j]; j++){
                    var well = this.wells[j];
                    var pos = p.getPosition(); 
                    var r = pos.subtract(well.x);
                    var r_len = r.euclidLength();
                    a = a.add(r.scale(-well.M/(r_len*r_len/2)));
                }
                p.setAcceleration(a);
            }
        },
	update:function(){
                this.accumulateForces();
		for(var i=0;this.wells[i];i++){
			this.wells[i].draw();
		}
		for(var i=0; this.particles[i]; i++){
                    this.particles[i].update();
                    this.particles[i].draw();
		}
	},
};



function getMouseCoords(event){
	if(event == null){
		event = window.event; 
	}if(event == null){
		return null; 
	}
	if(event.pageX || event.pageY){
		return $V([event.pageX,event.pageY]);
	}
	return null;
}

function getRadioButtonValue(name) {
    var radios = document.getElementsByName(name);

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

document.onmousedown = function(event){
	var mc=getMouseCoords(event); 
	mouse_down = true;
	initial_position = null;
	if(mc != null && canvas.isInside(mc)){
		mouse_down = true;
		if(getRadioButtonValue('select') == 'well'){
			initial_position = mc;
			mouse_position = mc;
			mouse_type = "well";
		}else{
			initial_position = mc;
			mouse_position = mc;
			mouse_type = "particle";
		}
	}
}
document.onmouseup = function(event){
	var mc= getMouseCoords(event); 
	if(mc != null &&canvas.isInside(mc)){
		if(getRadioButtonValue('select') != 'well'){
                        x2 =initial_position.subtract(initial_position.subtract(mouse_position).scale(1/10));
			system.addParticle(initial_position,x2);

		}else{
			var r = initial_position.subtract(mouse_position).euclidLength();
			if(r<MIN_WR){
				r = MIN_WR;
			}else if(r>MAX_WR){
				r = MAX_WR
			}
			system.addWell(initial_position,r);
		}
	}
	mouse_down = false;
	initial_position = null;
	mouse_position = null;
}
document.onmousemove = function(event){
	if(mouse_down && initial_position != null){
		mouse_position = getMouseCoords(event); 
	}
}

Canvas.prototype.randomCoordinate = function(x){
	var r1 = (Math.random()<0.5?-Math.random():Math.random());
	var r2 = (Math.random()<0.5?-Math.random():Math.random());
	if(x){
		return x.add([3*r1, 3*r2]);
	}else{
		var c = this.center();
		return c.add([c.elementAt(1)*r1,c.elementAt(2)*r2]);
	}
}
