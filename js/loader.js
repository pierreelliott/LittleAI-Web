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
    buttons: [
        {
            id: "btn1",
            shape: 2
        },
        {
            id: "btn2",
            shape: 1
        },
		{
            id: "btn3",
            shape: 3
        }
    ],
    stateMachine: {
        "e1": [
            { event: "btn1", to: "e1", action: {f: "createObsel", a: {group: "btn1", shape: 2, color: 3, valence: -1} } },
			{ event: "btn2", to: "e2", action: {f: "createObsel", a: {group: "btn2", shape: 1, color: 5, valence: 0} } },
			{ event: "btn3", to: "e1", action: {f: "createObsel", a: {group: "btn3", shape: 3, color: 2, valence: 1} } }
        ],
		"e2": [
			{ event: "btn1", to: "e2", action: {f: "createObsel", a: {group: "btn1", shape: 2, color: 2, valence: 1} } },
			{ event: "btn2", to: "e1", action: {f: "createObsel", a: {group: "btn2", shape: 1, color: 5, valence: 0} } },
			{ event: "btn3", to: "e2", action: {f: "createObsel", a: {group: "btn3", shape: 3, color: 3, valence: -1} } }
		],

		"initial": "e1"
    }
};
