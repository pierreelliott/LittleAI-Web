window.addEventListener("load", () => {
	var userLang = navigator.language || navigator.userLanguage;
	setLanguage(userLang);
});

function initializeGame() {
	var location = window.location.hash.split("#")[1];
	try {
		var levelLink = document.getElementById(location);
		levelLink.click();
	} catch (e) {
		console.log("Error: URL not recognized.");
		ajax("levels/group1/level_0.json", loadLevel);
	}
}

window.addEventListener("onhashchange", () => {
	var location = window.location.hash.split("#")[1];
	//console.log(window.location.hash.split("#"));
	if (location !== currentLevel.levelid) {
		if(location !== "" && document.getElementById(location) !== undefined) {
			// FIXME Doesn't work
			(document.getElementById(location).onclick)();
		} else {
			ajax("levels/group1/level_0.json", loadLevel);
		}
	}
});

/**
 * setLanguage - Define the language of the game
 * 					If the language isn't known, english language will be loaded
 *
 * @param  {type} lang_code The string code of the language to set (like "fr", "en", ...)
 * @returns {void}      Nothing
 */
function setLanguage(lang_code) {
	lang = "en";
	if(/(fr)/.test(lang_code)) {
		lang = "fr";
	}
	console.log("Language: " + lang);
	ajax("i18n/"+lang+".json", function (d) {
		var translateFunction = i18n.create(d);
		translate = function(text, element) {
			if(element === undefined || element === null) {
				return translateFunction(text);
			} else {
				element.setAttribute("translate", text);
				element.textContent = translateFunction(text);
			}
		};
		
		ajax("levels/levels.json", function(data) {
			initializeMenu(data);
			initializeGame();
		});
	});
}

/**
 * loadLevel - Load the given level in the playground
 * 				After playground's reset, create the buttons and the state machine
 *
 * @param  {type} level JSON object (already parsed) with buttons and state machine data
 * @returns {void}       Nothing
 */
function loadLevel(level) {
	var levelsButtons, levelsFsm,
		menuLink = document.getElementById("menuLink");

	resetPlayground();

	trace.defineMap(level.states);

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

	translate(level.id, menuLink);
	// menuLink.textContent = translate(level.id);
	// menuLink.setAttribute("translate", level.id);
	currentLevel.finished = false;
	currentLevel.levelid = level.id;

	window.location.hash = level.id;

	//openReplayMode();
}

/**
 * resetPlayground - Remove all objects in the trace, reset the score, remove the commands
 *
 * @returns {type}  description
 */
function resetPlayground() {
	resetScore();

	var commandsContainer = document.getElementById("commands"),
		commandtip = document.getElementById("commandtip");

	commands.clear();
	obsels.clear();

	trace.reset();

	commandsContainer.textContent = "";
	commandsContainer.append(commandtip);

	/* To do : reset informations panel + world panel */

	currentLevel.trace.length = 0;
	currentLevel.score = 0;

	replayModeCreated = false;
	document.getElementById("replayModeContent").innerHTML = "";
	closeInfoPanel();
}

function resetScore() {
	resetScoreView();
	// Empty the queue of the score to reset the score's count
	score.length = 0;
}
function resetScoreView() {
	var scoreContainer = document.getElementById("score");
	scoreContainer.textContent = "0";
	scoreContainer.classList.toggle("finished", false);
	scoreContainer.classList.toggle("alreadyFinished", false);
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
