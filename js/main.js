window.addEventListener("load", function() {
	// Initialize all global variables
	var CIRCLE = 1;
	var SQUARE = 2;
	var TRIANGLE = 3;
	var container = document.getElementById('traceContainer');
	var score = document.getElementById('score');
	var btn1 = document.getElementById('btn1');
	var btn2 = document.getElementById('btn2');
	var btn3 = document.getElementById('btn3');
	btn1.addEventListener("click", function() { addObsel(CIRCLE); });
	btn2.addEventListener("click", function() { addObsel(SQUARE); });
	btn3.addEventListener("click", function() { addObsel(TRIANGLE); });

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

	function addObsel(type) {
		if(type == null)
			type = 1;

		console.log("hello");
		var obsel = document.createElement("div");
		obsel.className = "fa fa-2x";
		switch (type) {
			case SQUARE :
				obsel.className += " fa-stop";
				break;
			case TRIANGLE:
				obsel.className += " fa-play fa-rotate-270"
				break;
			case CIRCLE:
			default:
				obsel.className += " fa-circle";
				break;
		}
		container.append(obsel);
	}
});
