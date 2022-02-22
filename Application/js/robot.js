function make_robot(parent) {
    nono = new Robot( Math.random() * app.renderer.width,
		      Math.random() * app.renderer.height,
		      Math.random() * Math.PI*2 );
    
    parent.addChild( nono );
}

class Sensor extends PIXI.Graphics {

    constructor(x, y, r, range, fov) {
    
	// position : x,y
	// oriantation : r (radians)
	// max range : range  
	// angle of view : fov (radians) 

	super();
	this.moveTo(x,y);
	this.beginFill(0xaaaaaa);
	this.lineStyle(1, 0x444444, 1);
	this.min_angle = r - fov/2;
	this.max_angle = r + fov/2;
	this.range = range;
	this.arc(x, y, range, this.min_angle, this.max_angle)
	this.endFill();
	this.name = "Sensor";
	this.alpha = .3;
	
    }
    
    read( angle, dist ) {
	
	// check if angle falls within our bounds 
	
	if (angle < this.max_angle && angle > this.min_angle)
	    return 1 - dist / this.range;
	return Infinity;
	
    }
}

class Robot extends PIXI.Container {

    constructor(x, y, r) {

	super();
    
	// The sprite image 

	this.sprite = new PIXI.Sprite(textures.robot);
	this.sprite.x = x;
	this.sprite.y = y;
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	this.sprite.name = "Robot sprite";

	// Properties 

	this.robot_w = this.sprite.width;
	this.robot_h = this.sprite.height;
	this.name = "Robot";
	this.x = x;//-this.robot_w/2;
	this.y = y;//-this.robot_h/2;
	this.pivot.x = x;
	this.pivot.y = y;
	this.rotation = r;
	this.param_go = get_nn_parameter();
	
	// The sensors

	this.sensors = [];
	this.sensor_values = [];
	for (let i=0; i<sensor_angles.length; i++) {
	    let s = new Sensor(x, y, sensor_angles[i],
			       sensor_range, sensor_fov);
	    this.sensors.push(s);
	    this.sensor_values.push(0);
	}

	//Neuronr controller parametres
	this.nn_parametres = [10, 0, 0, 10];


	// add all to this container 
	for (let i=0; i<this.sensors.length; i++) 
	    this.addChild(this.sensors[i]);

	this.addChild(this.sprite);
    }

    read_sensors(){
	
	// check if a cherry is within the circle sensor_range
	const hits = [];
	
	for (let i=0; i<num_cherries; i++) {
	    let dist=Math.sqrt((cherries[i].x-this.x)**2 +
			       (cherries[i].y-this.y)**2);
	    if (dist<sensor_range && dist != 0 )
		hits.push([cherries[i], dist]);
	}


	// reset sensor values 
	for (let j=0; j<this.sensors.length; j++)
	    this.sensor_values[j] = Infinity;
	
	// for all hits check where they fall
	for (let i=0; i<hits.length; i++) {
	    
	    const cherry = hits[i][0] ;
	    const dist   = hits[i][1] ;
	    
	    // get position & angle of cherry i in nono coordinate system 
	    let x = this.sprite.toLocal(cherry.position).x;
	    let y = this.sprite.toLocal(cherry.position).y;
	    let a = Math.atan2(y,x);

	    // are we very close then eat the cherry
	    if (x < (this.robot_w+cherry.width)/2 &&
		x > -(this.robot_w+cherry.width)/2 &&
		y < (this.robot_h+cherry.height)/2 &&
		y > -(this.robot_h+cherry.height)/2 ){

		// eat 
		cherry.relocate();
		
	    } else {
	    
		// get readings and update  
		for (let j=0; j<this.sensors.length; j++){
		    let s = this.sensors[j];
		    
		    this.sensor_values[j] = Math.min(this.sensor_values[j],
						     s.read( a , dist ))
		}
	    }
	}

	// replace infinity by zeros
	for (let j=0; j<this.sensors.length; j++)
	    if (this.sensor_values[j] === Infinity)
		this.sensor_values[j] = 0;
	return this.sensor_values;
    }
   
    
    move(vl, vr, delta) {

	// handle vl=vr 
	if (Math.abs(vr-vl) < 10e-16){
	    if(Math.random() < 0.5)
		vl+=10e-8;
	    else
		vr+=10e-8;
	}

	vl *= robot_speed;
	vr *= robot_speed;
	
	let R = (this.robot_w*(vr+vl)) / (2*(vr-vl));
	let w = (vr-vl) / this.robot_w
	let icc = {x : this.x - R * Math.sin(this.rotation),
		   y : this.y + R * Math.cos(this.rotation) }

	let x =
	    Math.cos(w*delta) * (this.x-icc.x) -
	    Math.sin(w*delta) * (this.y-icc.y) + icc.x;
	
	let y =
	    Math.sin(w*delta) * (this.x-icc.x) +
	    Math.cos(w*delta) * (this.y-icc.y) + icc.y;

	let t = this.rotation + w * delta;
	
	
	this.x = x;
	this.y = y;
	this.rotation = t;
	this.updateTransform();
	//console.log(x, y, t);

	this.check_bounds();
    }

    reset(){
		this.x = Math.random() * app.renderer.width;
		this.y = Math.random() * app.renderer.height;
		this.rotation = Math.random() * Math.PI*2;
		this.updateTransform();
	}

    check_bounds(){

	if (this.x>app.renderer.width)
	    this.x -= app.renderer.width;
	if (this.x<0)
	    this.x += app.renderer.width;

	if (this.y>app.renderer.height)
	    this.y -= app.renderer.height;
	if (this.y<0)
	    this.y += app.renderer.height;

    }

    random_controller(sensors) {
	
	let dice = Math.random();

	// move straight 
	let vl = 1;
	let vr = 1;

	// but once in wihile turn randomly
	if (dice < 0.2){
	    if (dice < 0.1)
	    	vr = -vr ;
	    else 
		vl = -vl ;
	}

	return [vl,vr];
    }


	set_nn_parameter(param) {
		this.nn_parametres = param;
		//console.log(this.nn_parametres);
	}


    nero_controller(sensors){
		let vr;
		let vl;

    	//console.log(sensors);

		//vr = Math.tanh(sensors[0] * this.nn_parametres[0] + this.nn_parametres[2] * sensors[1]);
		//vl = Math.tanh( this.nn_parametres[1] * sensors[0] + sensors[1] * this.nn_parametres[3] );
		vr = Math.tanh(sensors[0] * this.nn_parametres[0] +
						this.nn_parametres[2] * sensors[1] + bias_value);
		vl = Math.tanh(sensors[0] * this.nn_parametres[1] +
						this.nn_parametres[3] * sensors[1] + bias_value);


		return [vr, vl];
	}

    straight_controller() {
		return [1,1];
    }

    
 
}
