(function (global, factory) {
	typeof exports === 'object' &&
	typeof module !== 'undefined' ? factory(exports) :
			typeof define === 'function' &&
			define.amd ? define(['exports'], factory) :
				(factory( (global.LittleAI = global.LittleAI || {}) ));
}(this, (function (exports) { 'use strict';

var trace;

exports.Trace = function(DOMElem) {
	if(trace === undefined || trace === null) {
		trace = Object.freeze(new Trace(DOMElem));
	}
	return trace;
}

})));


const trace = Object.freeze(new Trace(document.getElementById("traceContainer")));

function Trace(DOMElem) {
	var dom = DOMElem;
	var array = [];
	var obselsMap = new Map();
	var manageView = true;

	Object.defineProperties( this, {
		"dom": {
      get() { return dom; }
    },
		"hasView": { // Use it
			get() { return manageView; },
			set(newVal) { manageView = !!newVal; }
		}});

	this.reset = function() {
		if(manageView) {
			dom.textContent = "";
		}
		obselsMap.clear();
		array.length = 0;
	}

	this.add = function(obsel) {
		if(manageView) {
			dom.append(obsel.view);
			dom.scrollTop = dom.scrollHeight; // To scroll down the trace
		}

		array.push(obsel);
		var mapVal = obselsMap.get(obsel.group).map.get(obsel.state);
		mapVal.array.push(obsel);
		if(mapVal.color === undefined) {
			mapVal.color = obsel.color;
		}
	}

	// Correctly generate the map containing all obsels
	this.defineMap = function(file) {
		for(btn in file) {
			obselsMap.set(btn, {shape : undefined, map: new Map()});
			for(state in file[btn]) {
				var map = obselsMap.get(btn).map;
				map.set(state, {color: undefined, array: []});
			}
		}
	}

	this.setShape = function(button, newShape) {
		obselsMap.get(button.id).shape = newShape;
		obselsMap.get(button.id).map.forEach(function(e) {
			e.array.forEach(function(obsel) {
				obsel.shape = newShape;
			});
		});
	}

	this.setColor = function(obsel, newColor) {
		obselsMap.get(obsel.group).map.get(obsel.state).color = newColor;
		obselsMap.get(obsel.group).map.get(obsel.state).array.forEach(function(e) {
			e.color = newColor;
		});
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
		var shape = nextShape(btn.shape);
		changeShape(btn, shape);
		btn.shape = shape;
	};
	btn.createView(onContextMenuCallback, onClickCallback);
	trace.setShape(btn, btn.shape);

	commands.set(btn.id, btn);

	document.getElementById("commands").append(btn.view); // Add the button element in the DOM
}

function Button(buttonID, buttonShape) {
	var id = buttonID, shape = buttonShape;
	var view = undefined;
	var element;

	Object.defineProperties( this, {
		"id": {
      get() { return id; },
			set(newValue) { id = newValue; }
    },
		"shape": {
      get() { return shape; },
			set(newValue) { changeShape(newValue); shape = newValue; }
    },
		"element": {
	      get() { return element; },
				set(newValue) { element = newValue; }
    },
		"view": {
	      get() { return view; },
				set(newValue) { view = newValue; }
    }
	});

	this.createView = function(onContextMenuCallback, onClickCallback) {
		element = document.createElement("span"); // Node which will hold the FA icon
		view = document.createElement("div");

		element.id = id;
		element.className = "shape fa fa-5x " + getShape(shape);

		element.addEventListener("click", onClickCallback);
		element.addEventListener("contextmenu", onContextMenuCallback);

		view.className = "command";
		view.append(element);
	}

	function changeShape (newShape) {
		element.className = element.className
			.replace(getShape(shape), getShape(newShape));
	}
}

function isHTMLElement(element) {
	return (element && HTMLElement && element instanceof HTMLElement);
}

function Obsel(obShape, obColor, obGroup, obState, obValence) {
	var shape = obShape, color = obColor, group = obGroup,
	state = obState, valence = obValence, element = undefined;
	var view = undefined;
	var isInTrace = false;

	Object.defineProperties( this, {
		"shape": {
      get() { return shape; },
			set(newValue) { changeShape(newValue); shape = newValue; }
    },
		"color": {
	      get() { return color; },
				set(newValue) { changeColor(newValue); color = newValue; }
    },
		"group": {
	      get() { return group; }, set(newValue) { group = newValue; }
    },
		"state": {
	      get() { return state; }, set(newValue) { state = newValue; }
    },
		"valence": {
	      get() { return valence; }, set(newValue) { valence = newValue; }
    },
		"element": {
	      get() { return element; }, set(newValue) { element = newValue; }
    },
		"view": {
	      get() { return view; }, set(newValue) { view = newValue; }
    },
		"isInTrace": {
	      get() { return isInTrace; }, set(newValue) { isInTrace = !!newValue; }
    }
	});

	var self = this;

	// FIXME
	// (not used)
	this.getView = function(onContextMenuCallback, onClickCallback) {
		if( isHTMLElement(view) ) {
			return view;
		} else {
			self.createView(onContextMenuCallback, onClickCallback);
			return view;
		}
	};

	function changeColor(newColor) {
		element.classList.toggle(getColor(color), false);
		element.classList.toggle(getColor(newColor), true);
	}

	function changeShape (newShape) {
		element.className = element.className
			.replace(getShape(shape), getShape(newShape));
		// Can't use "element.classList.toggle()"
		// because it doesn't support multiple classes (ie, Triangle shape)
	}

	this.createView = function(onContextMenuCallback, onClickCallback) {
		view = document.createElement("div");
		element = document.createElement("span");
		var valenceView = document.createElement("span");

		// Put a class with the button's id to track its shapes in the trace
		element.className = group + " " + state + " obsel fa fa-2x "
			+ getShape(shape) + " " + getColor(color);
		element.addEventListener("contextmenu", onContextMenuCallback);

		valenceView.textContent = valence;
		valenceView.className = "valence " + checkValence(valence);

		// Add the obsel and the valence to their container in the trace
		view.className = "interactionResult";
		view.append(element);
		view.append(valenceView);
	}
}

/**
 * addObsel - Creates obsels in the trace
 *
 * @param  {type} reaction An object representing the informations needed for the obsel (group, state, shape, color, valence)
 * @returns {void}     Nothing
 */
function addObsel(reaction) {
	var color = trace.getColorOf(reaction.group, reaction.state);
	var shape = trace.getShapeOf(reaction.group);

	if(color == undefined) {
		color = reaction.color;
	}

	var obsel = new Obsel(shape, color, reaction.group, reaction.state, reaction.valence);
	var onContextMenuCallback = function(e) {
		e.preventDefault();
		changeColor(obsel, nextColor(obsel.color));
	};
	obsel.createView(onContextMenuCallback, null);

	currentLevel.trace.push(obsel);

	// Update the score of the player, with the new obsel added
	updateScore(obsel);

	trace.add(obsel); // Add the obsel's container to the trace
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
	trace.setColor(obsel, newColor);
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

	trace.setShape(btnObject, newShape);
}

function Score(DOMElem, options) {
	var dom = DOMElem;
	var queue = [];
	var value = options.valueByDefault || 0;
	var finishValue = options.finishValue || 10;
	var onFinish = options.onFinish || function() { console.log("Level completed"); };

	this.update = function(newObsel) {
		queue.push(newObsel);
		while(score.length > 10) {
			score.shift();	// This method isn't a perfect implementation for a queue
							// but it's more practical and works well with small size arrays
		}
		updateValue();
		isFinished();
		if(value >= finishValue) {
			onFinish();
		}
	}

	function isFinished() {
		if(scoreSum >= finishValue) { // Might be replaced by "currentLevel.winningScore"
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
	}

	function updateValue() {
		var scoreSum = 0;
		for (var obsel of score) {
			scoreSum += obsel.valence;
		}
		value = scoreSum;
	}
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
