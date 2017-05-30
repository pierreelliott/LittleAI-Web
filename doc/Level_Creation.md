# How to create a level for Little AI

## Basic description

The file is in JSON format.

There are 4 main fields:
* the level's ID, which should be unique (it is used in i18n files)
* the buttons array, which contains a description (an ID and a shape) of each available buttons
* the "states grouper" field, designed to simplify (and minify) the state machine
* (and lastly) the state machine, which is based on the [state machine framework from basos9 on GitHub][fsm]

[fsm]: https://github.com/basos9/js-fsm "State machine framework documentation"

Do not forget to check already made levels if you're not sure of what you are doing, it might help.

## Fields description

### Level's ID

As said before, it simply is a unique key identifying the level. It is concatenated from the group name and the level name, for example: "group1level1".

### Buttons array

The buttons objects contained in this array have 2 fields: an ID and a shape.

As its name suggests, the button's ID needs to be unique. It also must follow the form 'btnX', where X is the number of the button (for example, 'btn1' for the first button or 'btn10' for the tenth button). *This form has a meaning for the state machine, which will be explained later.*  
The number in the button's ID should always start with 1 (then 2, 3, 4, and so on...).

The shape field is an integer which define the default shape of the button (shape that can be changed later on by the player). You can find the [codes table](./Codes.md) in the 'doc' folder in the GitHub repository.

### "States grouper"

Obsels (interactions result) in the game are separated depending on which buttons they come from, and (in each of these 'groups'), they also are separated depending of which "state of the world" they come from. But the level's state machine may have more states than the real "state of the world" it should represent.  
So, in order to simplify the state machine writing, this field links (for each button) a state machine's state and a corresponding "world's state".

Each button (represented with their ID) is an attribute of this field. And each of them must link __every__ state machine's state to a "real world's" state using the following form:
	"state_Machine's_State":"real_World's_State"

"States grouper" example:
    <pre><code>"states": {
		"btn1": {
			"e1": "type1",
			"e3": "type1",
			"e2": "type2"
		},
		"btn2": {
			"e1": "type1",
			"e2": "type2",
			"e3": "type1"
		}
	}</code></pre>
This code means that for the button 'btn1', the state machine's states 'e1' and 'e3' represent the same "real world's" state.

### State machine

The state machine is represented by multiple states (which are arrays of events) and a property ("initial") which tells the initial state of the state machine.  
This property is always used in already made levels, but may be ignored based on the [state machine framework documentation][fsm].

__Be careful if you want to use the state machine like in the [documentation][fsm], some things might not have been used in the game.__

#### States

A state is an array of events. Each event correspond to the level's buttons (and this construction is the same for each states). This means that if you have 3 buttons, you will always have 3 events for each state of the state machine.

#### Events

An event has:
* a name, which is described by the property "event"
* a destination state (described by the property "to"), it must (of course) be an available state; it can be the same state (if the event doesn't "change Little AI's world" for example)
* an obsel to create, which is described in the property "a", itself contained in the property "action" (the "f" property is needed, and must always be set with "createObsel")

The obsel to create's object contains:
* a "group" property, which is the event/button's name
* a "color" property, which is the default color of this obsel
* a "valence" property, which is the integer used to calculate the score

Example of an event:
	<pre><code>{ "event": "btn1", "to": "e2", "action": {"f": "createObsel", "a": {"group": "btn1", "color": 2, "valence": 1} } }</code></pre>
