window.addEventListener("load", function () {
	loadObject("","menu", initializeMenu);
	initializeI18n();
});

function initializeGame() {
	var location = window.location.hash.split("#")[1];

	if(isLevel(location)) {
		loadObject(location, "level", loadLevel);
	} else {
		loadObject("group1_level0", "level", loadLevel);
	}
}

window.onhashchange = function() {
	var location = window.location.hash.split("#")[1];
	//console.log(window.location.hash.split("#"));
	if (location !== currentLevel.levelid) {
		if(isLevel(location)) {
			loadObject(location, "level", loadLevel);
		} else {
			loadObject("group1_level0", "level", loadLevel);
		}
	}
};

function loadObject(id = "", type, callback) {
	/* If the object we try to load is stored locally, we return it
	 * Otherwise, we do an ajax call to get, store the object and callback the data
	*/
	console.log(localStorage);
	if (isStored(id)) {
		console.log("Object already stored");
		callback(retrieveObject(id));
	} else {
		switch (type) {
			case "level":
				var levelgroup = levelsInformations.get(id).group;
				var levelfile = levelsInformations.get(id).file;

				console.log("Loading level file");

				ajax("levels/"+levelgroup+"/"+levelfile, function(data) {
					storeObject({key: data.id, object: data});
					callback(data);
				});
				break;
			case "menu":
				console.log("Loading menu file");

				ajax("levels/levels.json", function(data) {
					storeObject({key: "menu", object: data});
					callback(data);
				});
				break;
			default:

		}
	}
}

/**
 * loadLevel - Load the given level in the playground
 * 				After playground's reset, create the buttons and the state machine
 *
 * @param  {type} level JSON object (already parsed) with buttons and state machine data
 * @returns {void}       Nothing
 */
function loadLevel(level) {
	resetPlayground();

	var levelsButtons, levelsFsm,
		menuLink = document.getElementById("menuLink");

	levelsButtons = level.buttons;
	levelsFsm = level.stateMachine;

	StateMachine.prototype.createObsel = function(arg){
		arg.state = level.states[arg.group][this.stmGetStatus()];
	  	addObsel(arg);
    };

	fsm = new StateMachine(levelsFsm);

	for (var button of levelsButtons) {
		createButton(button, fsm);
	}

	menuLink.textContent = translate(level.id);

	currentLevel.finished = false;
	currentLevel.levelid = level.id;

	window.location.hash = level.id;

	openReplayMode();
}

/**
 * resetPlayground - Remove all objects in the trace, reset the score, remove the commands
 *
 * @returns {type}  description
 */
function resetPlayground() {
	var scoreContainer = document.getElementById("score"),
		trace = document.getElementById("traceContainer"),
		commandsContainer = document.getElementById("commands"),
		commandtip = document.getElementById("commandtip");

	scoreContainer.textContent = "0";
	scoreContainer.classList.toggle("finished", false);
	scoreContainer.classList.toggle("alreadyFinished", false);
	// Empty the queue of the score to reset the score's count
	score.length = 0;

	commands.clear();
	obsels.clear();

	trace.textContent = "";

	commandsContainer.textContent = "";
	commandsContainer.append(commandtip);

	/* To do : reset informations panel + world panel */

	currentLevel.trace.length = 0;
	currentLevel.score = 0;

	//replayModeCreated = false;
	//document.getElementById("replayModeContent").innerHTML = "";
	closeInfoPanel();
}

/**
 * exportSave - Export the current level in a JSON format
 *
 * @returns {type}  description
 */
function exportSave() {
	var levelhash = hashCode(JSON.stringify(currentLevel));
	currentLevel.hash = levelhash;
	var uri = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(currentLevel));
	var dlAnchorElem = document.getElementById('downloadAnchorElem');
	dlAnchorElem.setAttribute("href",     uri     );
	dlAnchorElem.setAttribute("download", currentLevel.levelid+".json");
	dlAnchorElem.click();
}

/**
 * importSave - Import a JSON file to load in the playground
 *
 * @param {type} file	String containing the JSON information
 * @returns {type}  description
 */
function importSave(file) {
	var levelToLoad = JSON.parse(file);
	var checksum = levelToLoad.hash;
	delete levelToLoad.hash;
	if(checksum === hashCode(JSON.stringify(levelToLoad))) {
		//console.log(document.getElementById(levelToLoad.levelid).onclick);
		(document.getElementById(levelToLoad.levelid).onclick)(false);
		//document.getElementById(levelToLoad.levelid).click(false);
		levelToLoad.trace.forEach(function(obsel) {
			var button = document.getElementById(obsel.group);
			button.click();
		});
	} else {
		window.alert(translate("save_notValid"));
	}
}

/**
 * loadFile - Load a file
 *
 * @returns {type}  description
 */
function loadFile() {
	var fileinput = document.getElementById("fileinput");
	if(fileinput.files[0] != undefined) {
		var file = fileinput.files[0];

		if (file.type.match('application/json')) {
			var reader = new FileReader();

			reader.onload = function(){
				importSave(reader.result);
			};
			reader.readAsText(file);
    	} else {
			window.alert(translate("save_wrongFormat"));
		}
	}
}
