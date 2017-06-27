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

function hashCode(text) {
  var hash = 0, i, chr;
  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr   = text.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/**
 * ajax - Do ajax call. Retrieve the JSON at the url and send it to the callback function
 *
 * @param  {type} url      Relative URL where take the json
 * @param  {type} callback The function to use (and pass the file to) when the file is loaded
 * @param  {type} async False to make it synchronous, true otherwise
 * @returns {type}          description
 */
function ajax(data_url, callback, async) {
	if(async !== undefined && async === false) {
		async = false;
	} else {
		async = true;
	}

	$.getJSON(data_url, function (data,status,xhr) {
		if(status === "success") {
			//var data_parsed = JSON.parse(data);
			callback(data);
		} else {
			console.log("Error " + status);
		}
	});
/*


	/*if(async !== undefined && async === false) {
		async = false;
	} else {
		async = true;
	}
	var req = new XMLHttpRequest();
	req.open("GET", url, async);
	req.onerror = function() {
		console.log("Fail to load "+url);
	};
	req.onload = function() {
		if (req.status === 200) {
			//console.log("Rep : "+req.responseText);
			var data = JSON.parse(req.responseText);
			callback(data);
		} else {
			console.log("Error " + req.status);
		}
	};
	req.send();*/
}
