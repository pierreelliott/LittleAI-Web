window.addEventListener("load", function() {
	/* ======== Initialize all global variables ======== */
	var CIRCLE = 1, SQUARE = 2, TRIANGLE = 3; // Define the shapes' value
	var CIRCLE_SHAPE = "fa-circle", SQUARE_SHAPE = "fa-stop", TRIANGLE_SHAPE = "fa-play fa-rotate-270"; // Define the shapes
	var WHITE = 1, GREEN = 2, RED = 3, BLUE = 4, ORANGE = 5;

	// Important elements in the DOM (which will be used later)
	var traceContainer = document.getElementById("traceContainer"),
		scoreContainer = document.getElementById("score"),
		commands = document.getElementById("commands");

	var btns = []; // To store all the commands' buttons
	var obsels = new Map(); // To store all obsels currently in the trace
					 // it is the only way to store obsels' objects and not just the DOM elements
	var score = [];
	var i;
	// Create the buttons
	for(i = 0; i < 3; i++) {
		createButton(i+1);
	}

	function createButton(btnId) {
		var span = document.createElement("span");
		var div = document.createElement("div");

		var btn = {element: span, shape: btnId}; // To see all shapes
		// A button is an element in the DOM + a shape
		btn.element.id = "btn"+btnId;
		btn.element.className = "shape fa fa-5x " + getShape(btnId);
		// On click, print its shape in the trace
		btn.element.addEventListener("click", function() { addObsel(btn.element, btn.shape); });
		btn.element.addEventListener("contextmenu", function(e) { e.preventDefault(); changeShape(btn, (btn.shape+1)%3+1); });

		obsels.set(btn.element.id, []);

		div.className = "command";

		div.append(btn.element);
		commands.append(div); // Add the button element in the DOM
	}

	// # need to handle the case where the type is undefined
	function addObsel(btn, type) {
		if(type == null) { // Just in case something goes wrong
			type = 1;
		}

		// Create the element which will host the icon
		var obselContainer = document.createElement("div");
		var icon = document.createElement("span");
		var valence = document.createElement("span");

		// Put a class with the button's id to track its shapes in the trace
		icon.className = btn.id + " obsel fa fa-2x " + getShape(type) + " " + getColor(getSameObselsColor(btn.id));
		valence.textContent = -1;
		valence.className = "valence " + checkValence(-1); // Change the color of the text depending of the valence (positive, negative or null)
		var obsel = {element: icon, color: WHITE, group: btn.id, valence: -1};

		obsel.element.addEventListener("contextmenu", function(e) { e.preventDefault(); changeColor(obsel, (obsel.color+1)%5+1); });

		var sameGroupObsels = obsels.get(btn.id);
		sameGroupObsels.push(obsel);
		obsels.set(btn.id, sameGroupObsels);

		updateScore(obsel);

		obselContainer.append(obsel.element);
		obselContainer.append(valence);

		traceContainer.append(obselContainer); // Add the obsel to the trace
		traceContainer.scrollTop = traceContainer.scrollHeight; // To scroll down the trace
	}

	function getSameObselsColor(id) {
		var color = -1;
		var obselsGroup = obsels.get(id);
		var firstObsel = obselsGroup[0];
		if(firstObsel != undefined) {
			color = firstObsel.color;
		}

		if(color < WHITE || color > ORANGE || color == undefined) { 	// If there's no similar obsel in the trace, the color will be white
			color = WHITE;
		}
		return color;
	}

	function changeColor(obsel, newColor) {
		if(obsel.color == newColor)
			{ return; }

		obsel.element.className = obsel.element.className.replace(getColor(obsel.color), getColor(newColor)); // Change its color
		updateObselsColor(obsel, newColor); // Update all obsels in the same group
		obsel.color = newColor; // Change the value of its color
	}

	// # Need to refactor, there might be a better way to do it
	function updateObselsColor(obselObject, newColor) {
		var traceObsels = traceContainer.querySelectorAll("."+obselObject.group);
		traceObsels.forEach(function(obsel) {
			obsel.className = obsel.className.replace(getColor(obselObject.color), getColor(newColor));
		});

		var tabObsels = obsels.get(obselObject.group);
		tabObsels.forEach(function(obsel) {
			obsel.color = newColor;
		})
	}


	function changeShape(btnObject, newShape) {
		// Function to change buttons' shape
		if(btnObject.shape == newShape)
			{ return; }

		btnObject.element.className = btnObject.element.className.replace(getShape(btnObject.shape), getShape(newShape)); // Change its visual shape
		updateObselsShape(btnObject, newShape); // Update all obsels related to this button
		btnObject.shape = newShape; // Change the value of its shape
	}

	function updateObselsShape(btnObject, newShape) {
		var obsels = traceContainer.querySelectorAll("."+btnObject.element.id);
		obsels.forEach(function(obsel) {
			obsel.className = obsel.className.replace(getShape(btnObject.shape), getShape(newShape));
		});
	}

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

		scoreColor = checkValence(scoreSum);
	}


	/* ================ Utility functions ============== */

	// Quick way to return the shape
	function getShape(shapeNumber) {
		var shape = "";
		switch(shapeNumber) {
			case CIRCLE:
				shape = CIRCLE_SHAPE;
				break;
			case SQUARE :
				shape = SQUARE_SHAPE;
				break;
			case TRIANGLE:
				shape = TRIANGLE_SHAPE;
				break;
			default:
				shape = "undefined";
				break;
		}
		return shape;
	}

	function getColor(colorNumber) {
		var color = "";
		switch(colorNumber) {
			case WHITE:
				color = "white";
				break;
			case GREEN :
				color = "green";
				break;
			case RED :
				color = "red";
				break;
			case BLUE :
				color = "blue";
				break;
			case ORANGE :
				color = "orange";
				break;
			default:
				color = "undefined";
				break;
		}
		return color;
	}

	function checkValence(valence) {
		var color = "";

		if(valence < 0) {
			color = "red";
		} else if (valence > 0) {
			color = "green";
		} else {
			color = "white";
		}

		return color;
	}
});
