const trace = Object.freeze(new Trace(document.getElementById("traceContainer")));

function Trace(DOMElem) {
	var dom = DOMElem;
	var array = [];
	var obselsMap = new Map();

	Object.defineProperties( this, { "dom": {
      get() { return dom; }
    }});

	this.reset = function() {
		dom.textContent = "";
		obselsMap.clear();
		array.length = 0;
	}

	this.add = function(obsel) {
		dom.append(obsel.view);
		dom.scrollTop = dom.scrollHeight; // To scroll down the trace

		array.push(obsel);
		obselsMap.get(obsel.group).map.get(obsel.state).array.push(obsel);
	}

	// Correctly generate the map containing all obsels
	this.defineMap = function(file) {
		for(btn in file) {
			obselsMap.set(btn, {shape : "", map: new Map()});
			for(state in file[btn]) {
				var map = obselsMap.get(btn).map;
				map.set(state, {color: "", array: []});
			}
		}
	}

	this.setShape = function(button, newShape) {
		obselsMap.get(button.id).shape = newShape;
		// TODO Update every obsel
	}

	this.setColor = function(obsel, newColor) {
		obselsMap.get(obsel.group).map.get(obsel.state).color = newColor;
		// TODO Update every obsel
	}

	this.getColorOf = function(group, state) {
		return obselsMap.get(group).map.get(state).color;
	}

	this.getShapeOf = function(group) {
		return obselsMap.get(group).shape;
	}
}

/**
 * createButton - Creates the buttons (the DOM element and the object)
 *
 * @param  {type} buttonInfo The number of the button (1-> the first button, 2 -> the second, ...)
 * @returns {void}       Nothing
 */
function createButton(buttonInfo, fsm) {
	var btn = new Button(buttonInfo.id, buttonInfo.shape);
	var onClickCallback = function() {
		fsm.stmOnEvent(btn.id);
	};
	var onContextMenuCallback = function(e) {
		e.preventDefault();
		changeShape(btn, (btn.shape+1)%3+1);
	};
	btn.createView(onContextMenuCallback, onClickCallback);

	commands.set(btn.id, btn);

	// Initialize the obsel's Map
	obsels.set(btn.id, new Map() );

	document.getElementById("commands").append(btn.view); // Add the button element in the DOM
}

function Button(buttonID, buttonShape) {
	var id = buttonID, shape = buttonShape;
	var view = "!";

	Object.defineProperties( this, { "id": {
      get() { return id; }, set(newValue) { id = newValue; }
    }});
	Object.defineProperties( this, { "shape": {
      get() { return shape; }, set(newValue) { shape = newValue; }
    }});
	Object.defineProperties( this, { "element": {
      get() { return element; }, set(newValue) { element = newValue; }
    }});
	Object.defineProperties( this, { "view": {
      get() { return view; }, set(newValue) { view = newValue; }
    }});

	var self = this;

	this.createView = function(onContextMenuCallback, onClickCallback) {
		self.element = document.createElement("span"); // Node which will hold the FA icon
		self.view = document.createElement("div");

		self.element.id = self.id;
		self.element.className = "shape fa fa-5x " + getShape(self.shape);

		self.element.addEventListener("click", onClickCallback);
		self.element.addEventListener("contextmenu", onContextMenuCallback);

		self.view.className = "command";
		self.view.append(self.element);
	}

	this.changeShape = function(newShape) {
		// TODO
	}
}

function isHTMLElement(element) {
	return (HTMLElement && element instanceof HTMLElement);
}

function Obsel(obShape, obColor, obGroup, obState, obValence) {
	var shape = obShape, color = obColor, group = obGroup,
	state = obState, valence = obValence, element = "";
	var view = "";
	var isInTrace = false;

	Object.defineProperties( this, { "shape": {
      get() { return shape; }, set(newValue) { shape = newValue; }
    }});
	Object.defineProperties( this, { "color": {
      get() { return color; }, set(newValue) { color = newValue; }
    }});
	Object.defineProperties( this, { "group": {
      get() { return group; }, set(newValue) { group = newValue; }
    }});
	Object.defineProperties( this, { "state": {
      get() { return state; }, set(newValue) { state = newValue; }
    }});
	Object.defineProperties( this, { "valence": {
      get() { return valence; }, set(newValue) { valence = newValue; }
    }});
	Object.defineProperties( this, { "element": {
      get() { return element; }, set(newValue) { element = newValue; }
    }});
	Object.defineProperties( this, { "view": {
      get() { return view; }, set(newValue) { view = newValue; }
    }});
	Object.defineProperties( this, { "isInTrace": {
      get() { return isInTrace; }, set(newValue) { isInTrace = newValue; }
    }});

	var self = this;

	// FIXME
	// (not used)
	this.getView = function(onContextMenuCallback, onClickCallback) {
		if( isHTMLElement(element) ) {
			return element;
		} else {
			self.createView(onContextMenuCallback, onClickCallback);
			return self.view;
		}
	};

	// FIXME Put this method in conformity with the new way it is handled
		// (ie, by the Trace object)
	this.changeColor = function(newColor) {
		changeColor(self, newColor);
	}

	this.createView = function(onContextMenuCallback, onClickCallback) {
		self.view = document.createElement("div");
		self.element = document.createElement("span");
		var valence = document.createElement("span");

		// Put a class with the button's id to track its shapes in the trace
		self.element.className = self.group + " " + self.state + " obsel fa fa-2x "
			+ getShape(self.shape) + " " + getColor(self.color);
		self.element.addEventListener("contextmenu", onContextMenuCallback);

		valence.textContent = self.valence;
		valence.className = "valence " + checkValence(self.valence);

		// Add the obsel and the valence to their container in the trace
		self.view.className = "interactionResult";
		self.view.append(self.element);
		self.view.append(valence);
	}
}

/**
 * addObsel - Creates obsels in the trace
 *
 * @param  {type} reaction An object representing the informations needed for the obsel (the group, the shape, the color, the valence)
 * @returns {void}     Nothing
 */
function addObsel(reaction) {
	var color = getSameObselsColor(reaction.group, reaction.state);
	var shape = commands.get(reaction.group).shape;

	if(color == undefined) {
		color = reaction.color;
		obsels.get(reaction.group).set(reaction.state, []);
	}

	var obsel = new Obsel(shape, color, reaction.group, reaction.state, reaction.valence);
	var onContextMenuCallback = function(e) {
		e.preventDefault();
		console.log(obsel.color);
		console.log(nextColor(obsel.color));
		obsel.changeColor((obsel.color+1)%5+1);
	};
	obsel.createView(onContextMenuCallback, null);

	// Add the obsel to its group (i.e, obsels which come from the same button and the same interaction)
	// obsels.get(obsel.group).get(obsel.state).push(obsel);
	currentLevel.trace.push(obsel);

	// Update the score of the player, with the new obsel added
	updateScore(obsel);

	trace.add(obsel); // Add the obsel's container to the trace
}

function nextColor(color) {
	return (color+1)%5 + 1;
}

/**
 * getSameObselsColor - Return the color of obsels which belong to the same group
 *
 * @param  {type} id The id of the group to check
 * @returns {type}    The number of the color of same group obsels or WHITE otherwise
 */
function getSameObselsColor(id, state) {
	return trace.getColorOf(id, state);

	// var groupObsels = obsels.get(id), sameObsels, firstObsel;
	//
	// if(typeof groupObsels !== undefined && groupObsels.size !== 0) {
	// 	sameObsels = groupObsels.get(state);
	//
	// 	if(typeof sameObsels !== undefined && sameObsels.length > 0) {
	// 		firstObsel = sameObsels[0];
	// 		return firstObsel.color;
	// 	} else {
	// 		return undefined;
	// 	}
	// } else {
	// 	return undefined;
	// }
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
	console.log("Changing color");
	console.log(obsel.color);
	obsel.color = newColor; // Change the value of its color
	console.log(obsel.color);
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
