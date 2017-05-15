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

	ajax("i18n/"+lang+".json", i18n.translator.add);
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
	menuLink.textContent = level.id;

	fsm = new StateMachine(levelsFsm);

	for (var button of levelsButtons) {
		createButton(button, fsm);
	}
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
	if(scoreContainer.classList.contains("white")) { scoreContainer.classList.toggle("white"); }
	if(scoreContainer.classList.contains("red")) { scoreContainer.classList.toggle("red"); }
	if(scoreContainer.classList.contains("green")) { scoreContainer.classList.toggle("green"); }
	// Empty the queue of the score to reset the score's count
	score.length = 0;

	commands.clear();
	obsels.clear();

	trace.textContent = "";

	commandsContainer.textContent = "";
	commandsContainer.append(commandtip);

	/* To do : reset informations panel + world panel */
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
