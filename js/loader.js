window.addEventListener("load", function () {
	initializeApp();
});

function initializeApp() {
	initializeI18n();
	var userLang = navigator.language || navigator.userLanguage;
	setLanguage(userLang);
	initializeMenu();
	initializeGame()
}

function initializeGame() {
	var location = window.location.hash.split("#")[1];
	try {
		var levelLink = document.getElementById(location);
		levelLink.click();
	} catch (e) {
		console.log("Error: URL not recognized.");
		loadLevel("group1_level0");
	}
}

window.onhashchange = function() {
	var location = window.location.hash.split("#")[1];
	//console.log(window.location.hash.split("#"));
	if (location !== currentLevel.levelid) {
		if(location !== "" && document.getElementById(location) !== undefined) {
			(document.getElementById(location).onclick)();
		} else {
			loadLevel("group1_level0");
		}
	}
};

function loadObject(id) {
	if (isStored(id)) {
		return retrieveObject(id);
	} else {
		if (/^group\d+_level\d+$/.test(id)) {
			var levelgroup = levelsInformations.get(id).group;
			var levelfile = levelsInformations.get(id).file;

			ajax("levels/"+levelgroup+"/"+levelfile, function(data) {
				storeObject({key: data.id, object: data});
				loadLevel(id);
			});
		} else if (/menu/.test(id)) {
			ajax("levels/levels.json", function(data) {
				storeObject({key: data.id, object: data});
				initializeMenu();
			});
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
function loadLevel(levelid) {
	var level = loadObject(levelid);

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
