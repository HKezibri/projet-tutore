

function make_cherries(count, parent) {

    for (let i =0; i<count; i++){
	let cherry = new Cherry( i,
				 Math.random() * app.renderer.width,
				 Math.random() * app.renderer.height,
				 Math.random() * Math.PI * 2 );
	
	cherries.push( cherry );
	parent.addChild( cherry );

    }
}

class Cherry extends PIXI.Sprite {

    constructor(id, x, y, r) {
	super(textures.cherry);
	this.id = id;
	this.x = x;
	this.y = y;
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.scale.x = .5;
	this.scale.y = .5;
	this.rotation = r;
	this.name = "Cherry number "+id;
	this.tagged = false;
    }

    relocate(){
      
      this.x = Math.random() * app.renderer.width;
      this.y = Math.random() * app.renderer.height;
      this.rotation = Math.random() * Math.PI * 2 ;

    }

    
    
}


