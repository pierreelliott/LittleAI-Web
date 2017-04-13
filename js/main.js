window.addEventListener("load", function() {
	/* ======== Initialize all global variables ======== */
	var CIRCLE = 1, SQUARE = 2, TRIANGLE = 3; // Define the shapes' value

	// Important elements in the DOM (which will be used later)
	var container = document.getElementById('traceContainer'),
	score = document.getElementById('score'),
	commands = document.getElementById('commands');

	var btns = []; // To store all the commands' buttons
	var i;
	// Create the buttons
	for(i = 0; i < 3; i++) {
		var span = document.createElement("span");
		var btn = {"element": span, "shape": CIRCLE};
		// A button is an element in the DOM + a shape
		btn.element.id = "btn"+(i+5);
		btn.element.className = "shape fa fa-5x fa-circle";
		// On click, print its shape in the trace
		btn.element.addEventListener("click", function() { addObsel(btn.element, btn.shape); });

		btns[i] = btn;
		commands.append(btn.element); // Add the button element in the DOM
	}
	var btn1 = document.getElementById('btn1');
	var btn2 = document.getElementById('btn2');
	var btn3 = document.getElementById('btn3');
	btn1.addEventListener("click", function() { addObsel(this, CIRCLE); });
	btn2.addEventListener("click", function() { addObsel(this, SQUARE); });
	btn3.addEventListener("click", function() { addObsel(this, TRIANGLE); });

	btn1.addEventListener("contextmenu", function(e) { e.preventDefault(); changeShape(btn1); })

	/*var canvas = document.getElementById('trace');
	var ctx = canvas.getContext('2d');

	// Make sure the canvas get the width size of its parent
	ctx.canvas.width = container.getBoundingClientRect().width;
	ctx.canvas.height = 0;

	ctx.rect(10, 10, 150, 100);
	ctx.strokeStyle = '#003300';
	ctx.stroke();*/

	/*var centerX = ctx.canvas.width / 2;
	var posY = ctx.canvas.height / 2;
	btn.addEventListener("click", addItem);
	ctx.rect(centerX - 80, posY - 50, 150, 100);
	ctx.strokeStyle = '#003300';
	ctx.stroke();*/

	function addObsel(btn, type) {

		if(type == null) // Just in case something goes wrong
			type = 1;

		// Put a class with the button's id to track its shapes in the trace
		var classbtn = btn.id + " fa fa-2x ";

		// Create the element which will host the icon
		var obsel = document.createElement("div");
		// The different icons used
		switch (type) {
			case SQUARE :
				classbtn += "fa-stop";
				break;
			case TRIANGLE:
				classbtn += "fa-play fa-rotate-270"; // Need to rotate it to look like a triangle
				break;
			case CIRCLE:
			default:
				classbtn += "fa-circle";
				break;
		}
		obsel.className = classbtn;
		container.append(obsel); // Add the icon to the trace
		container.scrollTop = container.scrollHeight; // To scroll down the trace
	}

	function changeShape(btn) {
		// Function to change buttons' shape
	}
});
