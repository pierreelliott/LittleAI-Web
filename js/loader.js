function loadLevel() {
	console.log(leveltest);
	var level = JSON.parse(leveltest);

	var levelsButtons, levelsFsm;

	levelsButtons = level.buttons;
	levelsFsm = level.stateMachine;

	for (var button of levelsButtons) {
		createButton(button);
	}
}


// Representation of level 0, the json doesn't work yet
// This level is hardcoded for testing purposes
var leveltest = {
	"buttons" : [
		{ "id": "btn1", "shape": 2 },
		{ "id": "btn2", "shape": 1 }
	],

	"stateMachine": {
		"initial": "e1",
		"events": [
			{ "name": "btn1", "from": "e1", "to": "e1" },
			{ "name": "btn2", "from": "e1", "to": "e1" }
		],
		"callbacks": {
			"onbtn1": function(eventName, from, to, btn) {
				addObsel({ 	group: eventName,
							shape: btn.shape,
							color: ORANGE,
							valence: 0 });
			},
			"onbtn2": function(eventName, from, to, btn) {
				addObsel({ 	group: eventName,
							shape: btn.shape,
							color: GREEN,
							valence: 1 });
			}
		}
	}
};
