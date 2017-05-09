function loadLevel() {
	console.log(leveltest);
	//var level = JSON.parse(leveltest);

	var levelsButtons, levelsFsm;

	levelsButtons = leveltest.buttons;
	levelsFsm = leveltest.stateMachine;

	fsm = new StateMachine(levelsFsm);

	for (var button of levelsButtons) {
		console.log("Create btn "+button.id+", shape: "+button.shape);
		createButton(button, fsm);
	}
}


// Representation of level 0, the json doesn't work yet
// This level is hardcoded for testing purposes
var leveltest = {
    "buttons": [
        {
            id: "btn1",
            shape: SQUARE
        },
        {
            id: "btn2",
            shape: CIRCLE
        }
    ],
    "stateMachine": {
        "e1": [
            {
                event: "btn1",
                to: "e1",
                action: {
					f: "createObsel",
					a: {
						group: "btn1",
						shape: SQUARE,
						color: ORANGE,
						valence: 0
					}
				}
            },
			{
				event: "btn2",
                to: "e1",
                action: {
					f: "createObsel",
					a: {
						group: "btn2",
						shape: CIRCLE,
						color: GREEN,
						valence: 1
					}
				}
			}
        ],

		"initial": "e1"
    }
};
