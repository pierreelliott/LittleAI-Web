/* ================ Utility functions ============== */

/** Return the shape associated with the specified number */
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
			shape = CIRCLE_SHAPE;
			break;
	}
	return shape;
}

/** Return the class corresponding to the color number passed in parameter */
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
			color = "white";
			break;
	}
	return color;
}

/** Check the value of the valence (and the score too) to return green if its positive, red if negative, and white if not */
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
