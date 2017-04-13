window.addEventListener("load", function() {
	/* ======== Initialize all global variables ======== */
	var CIRCLE = 1, SQUARE = 2, TRIANGLE = 3; // Define the shapes' value
	var CIRCLE_SHAPE = "fa-circle", SQUARE_SHAPE = "fa-stop", TRIANGLE_SHAPE = "fa-play fa-rotate-270"; // Define the shapes
	var SHAPES = [CIRCLE_SHAPE, SQUARE_SHAPE, TRIANGLE_SHAPE];

	// Important elements in the DOM (which will be used later)
	var container = document.getElementById('traceContainer'),
	score = document.getElementById('score'),
	commands = document.getElementById('commands');

	var btns = []; // To store all the commands' buttons
	var i;
	// Create the buttons
	for(i = 0; i < 3; i++) {
		createButtons(i+1);
	}

	function createButtons(btnId) {
		var span = document.createElement("span");
		var btn = {element: span, shape: btnId}; // To test all shapes
		// A button is an element in the DOM + a shape
		btn.element.id = "btnn"+btnId;
		btn.element.className = "shape fa fa-5x " + getShape(btnId);
		// On click, print its shape in the trace
		btn.element.addEventListener("click", function() { addObsel(btn.element, btn.shape); });
		btn.element.addEventListener("contextmenu", function(e) { e.preventDefault(); console.log("Hello1"); changeShape(btn, (btn.shape+1)%3+1); })

		commands.append(btn.element); // Add the button element in the DOM
	}

	// # need to handle the case where the type is undefined
	function addObsel(btn, type) {
		if(type == null) // Just in case something goes wrong
			type = 1;

		// Put a class with the button's id to track its shapes in the trace
		var classbtn = btn.id + " obsel fa fa-2x " + getShape(type);

		// Create the element which will host the icon
		var obsel = document.createElement("div");
		var icon = document.createElement("span");
		icon.className = classbtn;
		obsel.append(icon); // Add the icon to the trace
		container.append(obsel); // Add the icon to the trace
		container.scrollTop = container.scrollHeight; // To scroll down the trace
	}

	function changeShape(btnObject, newShape) {
		// Function to change buttons' shape
		console.log("Hello2");
		if(btnObject.shape == newShape)
			{ return; }
		console.log("Hello3"); // Test
		console.log("CurrShape: "+getShape(btnObject.shape)+ " /NewShape: "+getShape(newShape));

		btnObject.element.className = btnObject.element.className.replace(getShape(btnObject.shape), getShape(newShape)); // Change its visual shape
		btnObject.shape = newShape; // Change the value of its shape

		updateObsels(btnObject); // Update all obsels related to this button
	}

	function updateObsels(btnObject) {
		var obsels = traceContainer.querySelectorAll("."+btnObject.element.id);
		obsels.forEach(function(obsel, index, array) {

			array[index] = obsel;
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
});
