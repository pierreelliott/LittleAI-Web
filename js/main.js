window.addEventListener("load", function() {
	/* ======== Initialize all global variables ======== */
	var CIRCLE = 1, SQUARE = 2, TRIANGLE = 3; // Define the shapes' value
	var CIRCLE_SHAPE = "fa-circle", SQUARE_SHAPE = "fa-stop", TRIANGLE_SHAPE = "fa-play fa-rotate-270"; // Define the shapes
	var WHITE = 1, GREEN = 2, RED = 3, BLUE = 4, ORANGE = 5;

	// Important elements in the DOM (which will be used later)
	var container = document.getElementById('traceContainer'),
		score = document.getElementById('score'),
		commands = document.getElementById('commands');

	var btns = []; // To store all the commands' buttons
	var obsels = []; // To store all obsels currently in the trace
					 // it is the only way to store obsels' objects and not just the DOM elements
	var i;
	// Create the buttons
	for(i = 0; i < 3; i++) {
		createButton(i+1);
	}

	function createButton(btnId) {
		var span = document.createElement("span");
		var btn = {element: span, shape: btnId}; // To see all shapes
		// A button is an element in the DOM + a shape
		btn.element.id = "btn"+btnId;
		btn.element.className = "shape fa fa-5x " + getShape(btnId);
		// On click, print its shape in the trace
		btn.element.addEventListener("click", function() { addObsel(btn.element, btn.shape); });
		btn.element.addEventListener("contextmenu", function(e) { e.preventDefault(); changeShape(btn, (btn.shape+1)%3+1); })

		commands.append(btn.element); // Add the button element in the DOM
	}

	// # need to handle the case where the type is undefined
	function addObsel(btn, type) {
		if(type == null) // Just in case something goes wrong
			type = 1;

		// Create the element which will host the icon
		var obselContainer = document.createElement("div");
		var icon = document.createElement("span");

		// Put a class with the button's id to track its shapes in the trace
		icon.className = btn.id + " obsel fa fa-2x " + getShape(type) + " " + getColor(getSameObselsColor(btn.id));
		var obsel = {element: icon, color: WHITE, group: btn.id};
		obsel.element.addEventListener("contextmenu", function(e) { e.preventDefault(); changeColor(obsel, (obsel.color+1)%5+1); });
		obselContainer.append(obsel.element);
		obsels.push(obsel); // Add the obsel to the global array, repertoring all obsels in the trace

		container.append(obselContainer); // Add the obsel to the trace
		container.scrollTop = container.scrollHeight; // To scroll down the trace
	}

	function getSameObselsColor(id) {
		var color = -1;
		color = obsels.forEach(function(obsel) {
			var color1 = -1;
			if(obsel.group == id) {
				color = obsel.color;
				console.log("color (fe) : "+color);
				return color1;
			}
		});
		console.log("Color : "+color);
		if(color < WHITE || color > ORANGE || color == undefined) { 		// If there's no similar obsel in the trace, the color will be white
			color = WHITE
		}
		console.log("Before return : "+color);
		return color;
	}

	function changeColor(obsel, newColor) {
		if(obsel.color == newColor)
			{ return; }

		obsel.element.className = obsel.element.className.replace(getColor(obsel.color), getColor(newColor)); // Change its color
		updateObselsColor(obsel, newColor); // Update all obsels in the same group
		obsel.color = newColor; // Change the value of its color
	}

	function updateObselsColor(obselObject, newColor) {
		var obsels = traceContainer.querySelectorAll("."+obselObject.group);
		obsels.forEach(function(obsel) {
			obsel.className = obsel.className.replace(getColor(obselObject.color), getColor(newColor));
		});
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
});
