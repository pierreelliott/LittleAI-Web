window.addEventListener("load", function () {
	var userLang = navigator.language || navigator.userLanguage;
	setLanguage(userLang);
	ajax("levels/levels.json", initializeMenu);
	ajax("levels/group1/level_0.json", loadLevel);
});

/**
 * setLanguage - Define the language of the game
 * 					If the language isn't known, english language will be loaded
 *
 * @param  {type} lang The string code of the language to set (like "fr", "en", ...)
 * @returns {void}      Nothing
 */
function setLanguage(lang) {
	if(!/(fr|en)/.test(lang)) {
		lang = "en";
	}
	console.log("'i18n/"+lang+".json'");
	ajax("i18n/"+lang+".json", function (d) {
		translate = i18n.create(d);
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
 * @returns {type}  description
 */
function importSave() {

}

/**
 * loadFile - Load a file
 *
 * @returns {type}  description
 */
function loadFile() {
	
}

/**
 * ajax - Do ajax call. Retrieve the JSON at the url and send it to the callback function
 *
 * @param  {type} url      Relative URL where take the json
 * @param  {type} callback The function to use (and pass the file to) when the file is loaded
 * @returns {type}          description
 */
function ajax(url, callback) {
	var req = new XMLHttpRequest();
	req.open("GET", url);
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
	req.send();
}
