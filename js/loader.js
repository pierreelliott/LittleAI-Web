window.addEventListener("load", function () {
	ajax("levels/group1/level_0.json", loadLevel);
});

function loadLevel(level) {
	var levelsButtons, levelsFsm;

	resetPlayground();

	levelsButtons = level.buttons;
	levelsFsm = level.stateMachine;

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
	var score = document.getElementById("score"),
		trace = document.getElementById("traceContainer"),
		commands = document.getElementById("commands"),
		commandtip = document.getElementById("commandtip");

	score.textContent = "0";
	if(score.classList.contains("white")) { score.classList.toggle("white"); }
	if(score.classList.contains("red")) { score.classList.toggle("red"); }
	if(score.classList.contains("green")) { score.classList.toggle("green"); }

	trace.textContent = "";

	commands.textContent = "";
	commands.append(commandtip);

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
		console.log("Échec de chargement "+url);
	};
	req.onload = function() {
		if (req.status === 200) {
			var data = JSON.parse(req.responseText);
			callback(data);
		} else {
			console.log("Erreur " + req.status);
		}
	};
	req.send();
}
