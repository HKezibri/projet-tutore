const robot_speed = 500;
const act_rate    = 10;

const sensor_range   = 100;
const sensor_fov     = Math.PI/6;
const sensor_angles  = [ -Math.PI/8, Math.PI/8]; 

let paused = false;
const bias_value = 1;

const num_cherries = 50;
      
let app;

const textures     = {};
const cherries     = [];
let nono = null;

let elapsed = 0.0;
let tics    = 0;


const debug = false; // fix the number of cherries to 1

