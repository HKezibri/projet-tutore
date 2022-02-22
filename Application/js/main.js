//import go from "./nn-controller.js";

function demo_init(){

    // check for WebGL
    
    let type = "WebGL";
    if (!PIXI.utils.isWebGLSupported()) {
	type = "canvas";
    }
    PIXI.utils.sayHello(type);
    
    // Create a Pixi Application
    
    app = new PIXI.Application({
	width: 850,        // default: 800
	height: 500,        // default: 600
	antialias: true,    // default: false
	transparent: false, // default: false
	resolution: 1       // default: 1
    });

    // Load ressources (images for sprites) 
    
    PIXI.Loader.shared
      .add('robot', "assets/nono-small.png")
      .add('cherry', "assets/cherry.png")
      .load(( loader, resources ) => {
	    
	  //make sprites 

	  textures.robot = resources.robot.texture;
	  textures.cherry = resources.cherry.texture;
	  
	  // when finished loading images, start everyting else

	  demo_start();
	  //demo_stop();

	});
}
/*
function demo_stop() {
	document.querySelector("#stop").addEventListener("click", ()=>{
		app.ticker.stop();
	})
}

 */

function demo_reset() {


	nono.reset();
	for (let i=0; i<num_cherries; i++) {
			cherries[i].relocate();
	}
	elapsed =0;
	tics = 0;
     pause = true;
}




function demo_start() {
  
    // Add the canvas (app.view) to the HTML document

	document.body.appendChild(app.view);

    // Set the background

    app.renderer.backgroundColor = 0x000000;
           
    if (! debug ){
	
	// Add food and a robot 
	make_cherries(num_cherries, app.stage) ;
	make_robot(app.stage);
	
    }
    else {
	//DEBUG
	
	let obj = new PIXI.Graphics();
	obj.beginFill(0xff0000);
	obj.drawRect(0, 0,  100 + sensor_range * 0.5,  100 + 20);
	app.stage.addChild(obj);
	obj = new PIXI.Graphics();
	obj.beginFill(0x0000ff);
	obj.drawRect(0, 0, 100, 100);
	app.stage.addChild(obj);
	
	let cherry =  new Cherry(0,100+sensor_range * 0.5, 120, 0 );
	cherries.push ( cherry );
	app.stage.addChild( cherry );
      
	nono = new Robot(100,100,0);        
	app.stage.addChild( nono );
    
    }

    let start = document.querySelector("#start");
	start.onclick = function () {
		console.log(paused);
		if(!paused){
			nono.set_nn_parameter(get_nn_parameter());
			app.ticker.add((delta) => game_loop(delta));
			app.ticker.start();
			//console.log(this.paused);
		}else{
			app.ticker.stop();
			//console.log(this.paused);
		}
		paused = !paused;
	}
    
}

function game_loop(delta) {

	//if (!paused) {
		// update time and tics
		let dt = delta / 60;
		elapsed += dt;
		tics++;

    // robot sens/ act loop 
    if (! debug && (tics % act_rate) == 0){

	// read sensors   
	let sensors = nono.read_sensors();

	// compute controller
	let motor = nono.nero_controller( sensors );
	//console.log(motor);

	//console.log(sensors);
	// move robot
	//nono.move(vl, vr, dt);
	nono.move(motor[0], motor[1], dt);


    }


		// debugging stuff  move robot and then stop
	if (debug && (tics % act_rate) == 0 && tics < 100) {

		let sensors = nono.read_sensors();
		//let motor = [1,1]
		let motor = nono.nero_controller(sensors)
		nono.move(motor[0], motor[1], dt);

		console.log(sensors);
	}
	//}
}







