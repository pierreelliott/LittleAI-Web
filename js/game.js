/**
 * createButton - Creates the buttons (the DOM element and the object)
 *
 * @param  {type} buttonInfo The number of the button (1-> the first button, 2 -> the second, ...)
 * @returns {void}       Nothing
 */
function createButton(buttonInfo, fsm) {
	var btn = createButtonModel(buttonInfo.id, buttonInfo.shape);
	var onClickCallback = function() {
		fsm.stmOnEvent(btn.id);
	};
	var onContextMenuCallback = function() {
		e.preventDefault();
		changeShape(btn, (btn.shape+1)%3+1);
	};
	var btnView = createButtonView(btn, onClickCallback, onContextMenuCallback);

	commands.set(btn.id, btn);

	// Initialize the obsel's Map
	obsels.set(btn.id, new Map() );

	document.getElementById("commands").append(btnView); // Add the button element in the DOM
}

/**
 * createButtonView - Create the visual of a button
 *
 * @param  {type} buttonModel           description
 * @param  {type} onClickCallback       description
 * @param  {type} onContextMenuCallback description
 * @return {type}                       description
 */
function createButtonView(buttonModel, onClickCallback, onContextMenuCallback) {
	var icon = document.createElement("span"); // Node which will hold the FA icon
	var div = document.createElement("div");

	icon.id = buttonModel.id;
	icon.className = "shape fa fa-5x " + getShape(buttonModel.shape);

	icon.addEventListener("click", onClickCallback);
	icon.addEventListener("contextmenu", onContextMenuCallback);

	buttonModel.element = icon;
	div.className = "command";
	div.append(icon);

	return div;
}

/**
 * createButtonModel - Create a JS object containing all information about a button
 *
 * @param  {type} buttonId    ID of the button
 * @param  {type} buttonShape Shape of the button
 * @return {type}
 */
function createButtonModel(buttonId, buttonShape) {
	var btn = {id: buttonId, element: "", shape: buttonShape};
	return btn;
}

function createObselModel(obShape, obColor, obGroup, obState, obValence) {
	var obsel = {
		element: "",
		color: obColor,
		shape: obShape,
		group: obGroup,
		state: obState,
		valence: obValence
	};
	return obsel;
}

function createObselView(obModel, onContextMenuCallback, onClickCallback) {
	var obselContainer = document.createElement("div");
	var icon = document.createElement("span");
	var valence = document.createElement("span");

	// Put a class with the button's id to track its shapes in the trace
	icon.className = obModel.group + " " + obModel.state + " obsel fa fa-2x "
		+ getShape(obModel.shape) + " " + getColor(obModel.color);
	icon.addEventListener("contextmenu", onContextMenuCallback);
	obModel.element = icon;

	valence.textContent = obModel.valence;
	valence.className = "valence " + checkValence(obsel.valence);

	// Add the obsel and the valence to their container in the trace
	obselContainer.className = "interactionResult";
	obselContainer.append(obsel.element);
	obselContainer.append(valence);

	return obselContainer;
}

/**
 * addObsel - Creates obsels in the trace
 *
 * @param  {type} reaction An object representing the informations needed for the obsel (the group, the shape, the color, the valence)
 * @returns {void}     Nothing
 */
function addObsel(reaction) {
	var traceContainer = document.getElementById("traceContainer");

	var color = getSameObselsColor(reaction.group, reaction.state);
	var shape = commands.get(reaction.group).shape;

	if(color == undefined) {
		color = reaction.color;
		obsels.get(reaction.group).set(reaction.state, []);
	}

	var obsel = createObselModel(shape, color, reaction.group, reaction.state, reaction.valence);
	var onContextMenuCallback = function() {
		e.preventDefault();
		changeColor(obsel, (obsel.color+1)%5+1);
	};
	var obselView = createObselView(obsel, onContextMenuCallback, null);

	// Add the obsel to its group (i.e, obsels which come from the same button and the same interaction)
	obsels.get(obsel.group).get(obsel.state).push(obsel);
	currentLevel.trace.push(obsel);

	// Update the score of the player, with the new obsel added
	updateScore(obsel);

	traceContainer.append(obselView); // Add the obsel's container to the trace
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

	if(typeof groupObsels !== undefined) {
		sameObsels = groupObsels.get(state);

		if(typeof sameObsels !== undefined && sameObsels.length > 0) {
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
	var traceContainer = document.getElementById("traceContainer");
	var traceObsels = traceContainer.querySelectorAll("."+obselObject.group+"."+obselObject.state);
	traceObsels.forEach(function(obsel) {
		obsel.className = obsel.className.replace(getColor(obselObject.color), getColor(newColor));
	});

	var tabObsels = obsels.get(obselObject.group).get(obselObject.state);
	tabObsels.forEach(function(obsel) {
		obsel.color = newColor;
	});
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
	var traceContainer = document.getElementById("traceContainer");
	var traceObsels = traceContainer.querySelectorAll("."+btnObject.id);
	traceObsels.forEach(function(obsel) {
		obsel.className = obsel.className.replace(getShape(btnObject.shape), getShape(newShape));
	});

	var tabObsels = obsels.get(btnObject.id);
	tabObsels.forEach(function(value, key) {
		value.forEach(function(obsel) {
			obsel.shape = newShape;
		});
	});
}

/**
 * updateScore - Update the player's score, based on the last 10 obsels and their valence
 *
 * @param  {obsel} newObsel The last obsel that will be added to the queue
 * @returns {void}          Nothing
 */
function updateScore(newObsel) {
	var scoreContainer = document.getElementById("score");
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


	if(scoreSum >= 10) { // Might be replaced by "currentLevel.winningScore"
		scoreContainer.classList.toggle("finished", true);
		scoreContainer.classList.toggle("alreadyFinished", false);

		if(!currentLevel.finished) {
			currentLevel.finished = true;
			winLevel();
		}
	} else {
		if(currentLevel.finished) {
			scoreContainer.classList.toggle("alreadyFinished", true);
			scoreContainer.classList.toggle("finished", false);
		}
	}

	currentLevel.score = scoreSum;
}

function winLevel() {
	currentLevel.finished = true;
}
