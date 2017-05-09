window.addEventListener("load", function () {
	//loadLevel();
	ajax("levels/level001.json");
});

function loadLevel(level) {
	var levelsButtons, levelsFsm;

	levelsButtons = level.buttons;
	levelsFsm = level.stateMachine;

	fsm = new StateMachine(levelsFsm);

	for (var button of levelsButtons) {
		createButton(button, fsm);
	}
}

function ajax(url) {
	var req = new XMLHttpRequest();
	req.open("GET", url);
	req.onerror = function() {
		console.log("Échec de chargement "+url);
	};
	req.onload = function() {
		if (req.status === 200) {
			var data = JSON.parse(req.responseText);
			//callback(data);
			loadLevel(data);
		} else {
			console.log("Erreur " + req.status);
		}
	};
	req.send();
}
