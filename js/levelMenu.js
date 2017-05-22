/**
 * @file Provides functions to manage the menu overlay
 * @name Menu Management
 * @author Pierre-Elliott Thiboud <pierreelliott.thiboud@gmail.com>
 */

/**
 * openNav - Open the menu when the user click on the level's link
 *
 * @returns {void}  Nothing
 */
function openNav() {
	document.getElementById("levelMenu").style.height = "100%";
}

/**
 * closeNav - Close the menu when someone clicks on the "x" symbol inside the menu overlay
 *
 * @returns {void}  Nothing
 */
function closeNav() {
	document.getElementById("levelMenu").style.height = "0%";
}

/**
 * openTab - Open a tab (corresponding to a group of levels) in the menu overlay
 *
 * @param  {event} evt   The triggered event
 * @param  {string} group The ID of the tabcontent it will display
 * @returns {void}       Nothing
 */
function openTab(evt, group) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(group).style.display = "block";
    evt.currentTarget.className += " active";
}

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
	button.textContent = translate(group.id);
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

	levelLink.textContent = translate(level.id);
	levelLink.className = "levelLink";
	levelLink.id = groupName + level.id;
	levelLink.onclick = function() {
		ajax("levels/"+groupName+"/"+level.file, loadLevel);
		closeNav();
	};

	return levelLink;
}
