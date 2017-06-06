/* ======== Initialize all global variables ======== */
var CIRCLE = 1, SQUARE = 2, TRIANGLE = 3; // Define the shapes' value
var CIRCLE_SHAPE = "fa-circle", SQUARE_SHAPE = "fa-stop", TRIANGLE_SHAPE = "fa-play fa-rotate-270"; // Define the shapes
var WHITE = 1, GREEN = 2, RED = 3, BLUE = 4, ORANGE = 5;


var obsels = new Map(); // To store all obsels currently in the trace
				 		// it is the only way to store obsels' objects and not just the DOM elements
						// Obsels are stored by groups (a group is the button which created the obsel and the interaction associated)
var commands = new Map();

var translate;

var replayModeCreated = false;

// Some sort of queue, to store the last 10 obsels
var score = [];

var currentLevel = {
	levelid: "",
	score: 0,
	trace: []
};

var userSave;
