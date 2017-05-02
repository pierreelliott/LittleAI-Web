/**
 * @file Provides utility functions
 * @name Utility
 * @author Pierre-Elliott Thiboud <pierreelliott.thiboud@gmail.com>
 */
 
/**
 * getShape - Return the shape associated with the specified number
 *
 * @param  {number} shapeNumber Global variable defining a shape
 * @returns {string}             A CSS class specifying the shape requested
 */
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

/**
 * getColor - Return the class corresponding to the color number passed in parameter
 *
 * @param  {number} colorNumber Global variable defining a color
 * @returns {string}             A CSS class specyfing the color requested
 */

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

/**
 * checkValence - Check the value of the valence (and the score too) to return green if its positive, red if negative, and white if not
 *
 * @param  {number} valence The value to check (if positive, negative or null)
 * @returns {string}         The color corresponding to its type (positive, negative or null)
 */
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
