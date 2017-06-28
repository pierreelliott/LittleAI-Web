/**
 * @file Provides functions to manage the menu overlay
 * @name Menu Management
 * @author Pierre-Elliott Thiboud <pierreelliott.thiboud@gmail.com>
 */

/**
 * initializeMenu - Creates the tab navigation of the menu based on the configuration file
 *
 * @param  {json} levels Configuration file. It describes the groups and the levels inside each of them
 * @returns {type}        Nothing
 */
function initializeMenu(levels) {
	var index = document.getElementById("menuTabIndex"),
		container = document.getElementById("menuTab");

	for(var group of levels.groups) {
		createGroup(group, index, container);
	}

	initializeGame();

	// Open the tab content of the first group
	index.querySelector(".tablinks").click();
}

/**
 * createGroup - Creates a group in the tab navigation
 *
 * @param  {type} group     Information about the group (name, levels inside)
 * @param  {type} index     Reference to the index of the tab DOM element
 * @param  {type} container Reference to tab DOM element
 * @returns {type}           Nothing
 */
function createGroup(group, index, container) {
	var button = document.createElement("button"),
		content = document.createElement("div");

	button.className = "tablinks";
	button.onclick = function(event) { openTab(event, group.id); };
	//button.textContent = group.id;
	UIRessources.set(group.id, button);
	index.append(button);

	content.id = group.id;
	content.className = "tabcontent";

	for(var level of group.levels) {
		content.append(createLinkLevel(group.id, level));
	}

	container.append(content);
}

/**
 * createLinkLevel - Creates a link to load a level
 *
 * @param  {type} groupName Name of the parent group
 * @param  {type} levelName Name of the level's file
 * @returns {type}           Nothing
 */
function createLinkLevel(groupName, level) {
	var levelLink = document.createElement("div");

	UIRessources.set(level.id, levelLink);
	levelLink.className = "levelLink";
	levelLink.id = level.id;
	levelLink.onclick = function() {
		loadLevel(level.id);
		closeNav();
	};

	ajax("levels/"+groupName+"/"+level.file, function(data) {
		storeObject({key: data.id, object: data});
	});

	levelsInformations.set(level.id, {id: level.id, group: groupName, file: level.file});

	return levelLink;
}
