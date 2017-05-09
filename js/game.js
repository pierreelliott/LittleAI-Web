/* ======== Initialize all global variables ======== */
var CIRCLE = 1, SQUARE = 2, TRIANGLE = 3; // Define the shapes' value
var CIRCLE_SHAPE = "fa-circle", SQUARE_SHAPE = "fa-stop", TRIANGLE_SHAPE = "fa-play fa-rotate-270"; // Define the shapes
var WHITE = 1, GREEN = 2, RED = 3, BLUE = 4, ORANGE = 5;

// Important elements in the DOM (which will often be used later)
var traceContainer = document.getElementById("traceContainer"),
	scoreContainer = document.getElementById("score");

var obsels = new Map(); // To store all obsels currently in the trace
				 		// it is the only way to store obsels' objects and not just the DOM elements
						// Obsels are stored by groups (a group is the button which created the obsel and the interaction associated)

// Some sort of queue, to store the last 10 obsels
var score = [];

window.addEventListener("load", function () {
	// This will be the function which will handle the levels and their initialization in the game's field
	/*var i;
	// Create the buttons
	for(i = 0; i < 3; i++) {
		createButton(i+1);
	}*/
	loadLevel();
});

/**
 * createButton - Creates the buttons (the DOM element and the object)
 *
 * @param  {type} buttonInfo The number of the button (1-> the first button, 2 -> the second, ...)
 * @returns {void}       Nothing
 */
function createButton(buttonInfo, fsm) {
	var icon = document.createElement("span"); // Node which will hold the FA icon
	var div = document.createElement("div");
	var func = buttonInfo.id;

	/**
	 * @name {button} button
	 * @description JS object containing informations about a button like : its DOM element, its shape
	 */
	var btn = {id: buttonInfo.id, element: icon, shape: buttonInfo.shape}; // To see all shapes, shape is initialized with btnId (just for tests)
	// A button is an element in the DOM + a shape

	btn.element.id = btn.id;
	btn.element.className = "shape fa fa-5x " + getShape(btn.shape);

	// On click, print its shape in the trace
	btn.element.addEventListener("click", function() {
		//addObsel({ group: btn.id, shape: btn.shape, color: WHITE, valence: Math.pow(-1,btn.shape) });
		fsm.stmOnEvent(btn.id);
	 });
	// On right click, change the shape of the button
	btn.element.addEventListener("contextmenu", function(e) { e.preventDefault(); changeShape(btn, (btn.shape+1)%3+1); });

	// Initialize the obsel's Map
	obsels.set(btn.id, new Map() );

	div.className = "command";

	div.append(btn.element);
	document.getElementById("commands").append(div); // Add the button element in the DOM
}

/**
* btn :  */

/**
 * addObsel - Creates obsels in the trace
 *
 * @param  {type} reaction An object representing the informations needed for the obsel (the group, the shape, the color, the valence)
 * @returns {void}     Nothing
 */
function addObsel(reaction) {
	// # need to handle the case where the shape is undefined, it shouldn't happen but we never know
	/*if(btn.shape == null) { // Just in case something goes wrong
		btn.shape = 1;
	}*/

	// Create the element which will host the icon
	var obselContainer = document.createElement("div");
	var icon = document.createElement("span");
	var valence = document.createElement("span");
	var color = getSameObselsColor(reaction.group, reaction.state);

	if(color == undefined) {
		color = reaction.color;
		obsels.get(reaction.group).set(reaction.state, []);
	}

	// Put a class with the button's id to track its shapes in the trace
	icon.className = reaction.group + " " + reaction.state + " obsel fa fa-2x " + getShape(reaction.shape) + " " + getColor(color);

	/**
	 * @name {obsel} obsel
	 * @description JS object containing informations about an obsel like : its DOM element, its color, its group (ie, which button created it), its valence
	 */
	var obsel = {element: icon, color: color, group: reaction.group, state: reaction.state, valence: reaction.valence};
	valence.textContent = obsel.valence;
	valence.className = "valence " + checkValence(obsel.valence); // Change the color of the text depending of the valence (positive, negative or null)

	// On right click, change the color of the obsel (+ all obsels in the same group)
	obsel.element.addEventListener("contextmenu", function(e) { e.preventDefault(); changeColor(obsel, (obsel.color+1)%5+1); });

	// Add the obsel to its group (i.e, obsels which come from the same button and the same interaction)
	obsels.get(obsel.group).get(obsel.state).push(obsel);

	// Update the score of the player, with the new obsel added
	updateScore(obsel);

	// Add the obsel and the valence to their container in the trace
	obselContainer.append(obsel.element);
	obselContainer.append(valence);

	traceContainer.append(obselContainer); // Add the obsel's container to the trace
	traceContainer.scrollTop = traceContainer.scrollHeight; // To scroll down the trace
}

/**
 * getSameObselsColor - Return the color of obsels which belong to the same group
 *
 * @param  {type} id The id of the group to check
 * @returns {type}    The number of the color of same group obsels or WHITE otherwise
 */
function getSameObselsColor(id, state) {
	var groupObsels = obsels.get(id), sameObsels, firstObsel;

	if(typeof groupObsels !== 'undefined') {
		sameObsels = groupObsels.get(state);

		if(typeof sameObsels !== 'undefined' && sameObsels.length > 0) {
			firstObsel = sameObsels[0];
			return firstObsel.color;
		} else {
			return undefined;
		}
	} else {
		return undefined;
	}
}

/**
 * changeColor - Change the color of an obsel
 *
 * @param  {obsel} obsel    [Obsel object]{@link obsel}
 * @param  {number} newColor The new color the obsel will be
 * @returns {void}          Nothing
 */
function changeColor(obsel, newColor) {
	// If the new color is the same than the old, do nothing
	if(obsel.color == newColor)
		{ return; }

	// Replace the old class color with the new one
	obsel.element.className = obsel.element.className.replace(getColor(obsel.color), getColor(newColor)); // Change its color
	updateObselsColor(obsel, newColor); // Update all obsels in the same group
	obsel.color = newColor; // Change the value of its color
}

/**
 * updateObselsColor - Update all obsels color in the same group as the one in parameter
 *
 * @param  {obsel} obselObject [Obsel object]{@link obsel}
 * @param  {number} newColor    The new color obsels will be
 * @returns {void}             Nothing
 */
// There might be a better way to do it
function updateObselsColor(obselObject, newColor) {
	var traceObsels = traceContainer.querySelectorAll("."+obselObject.group+"."+obselObject.state);
	traceObsels.forEach(function(obsel) {
		obsel.className = obsel.className.replace(getColor(obselObject.color), getColor(newColor));
	});

	var tabObsels = obsels.get(obselObject.group).get(obselObject.state);
	tabObsels.forEach(function(obsel) {
		obsel.color = newColor;
	})
}

/**
 * changeShape - Change the shape of a button
 *
 * @param  {button} btnObject [Button object]{@link button}
 * @param  {number} newShape  The new shape the button will be
 * @returns {void}           Nothing
 */
function changeShape(btnObject, newShape) {
	// If the new shape is the same than the old, then do nothing
	if(btnObject.shape == newShape)
		{ return; }

	btnObject.element.className = btnObject.element.className.replace(getShape(btnObject.shape), getShape(newShape)); // Change its visual shape
	updateObselsShape(btnObject, newShape); // Update all obsels related to this button
	btnObject.shape = newShape; // Change the value of its shape
}

/**
 * updateObselsShape - Update all obsels related to the button passed in parameter
 *
 * @param  {button} btnObject [Button object]{@link button}
 * @param  {number} newShape  The new shape obsels related to this button will be
 * @returns {void}           Nothing
 */
function updateObselsShape(btnObject, newShape) {
	var obsels = traceContainer.querySelectorAll("."+btnObject.element.id);
	obsels.forEach(function(obsel) {
		obsel.className = obsel.className.replace(getShape(btnObject.shape), getShape(newShape));
	});
}

/**
 * updateScore - Update the player's score, based on the last 10 obsels and their valence
 *
 * @param  {obsel} newObsel The last obsel that will be added to the queue
 * @returns {void}          Nothing
 */
function updateScore(newObsel) {
	var scoreSum = 0;
	var scoreColor = "";

	score.push(newObsel);
	while(score.length > 10) {
		score.shift();	// This method isn't a perfect implementation for a queue
						// but it's more practical and works well with small size arrays
	}

	for (var obsel of score) {
		scoreSum += obsel.valence;
	}
	scoreContainer.textContent = scoreSum;

	// Change the color of the score depending of its value
	scoreColor = checkValence(scoreSum);

	// If the score doesn't have the proper color, removes all its possible colors and add the proper one
	if(!scoreContainer.classList.contains(scoreColor)) {
		if(scoreContainer.classList.contains("white")) { scoreContainer.classList.toggle("white"); }
		if(scoreContainer.classList.contains("red")) { scoreContainer.classList.toggle("red"); }
		if(scoreContainer.classList.contains("green")) { scoreContainer.classList.toggle("green"); }

		scoreContainer.classList.toggle(scoreColor);
	}
}
