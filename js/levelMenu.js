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
 * anonymous function - Creates fake buttons (just for testing)
 *
 * @returns {void}  Nothing
 */
window.onload = function () {
	// To load directly the "group1" tab
	document.getElementById("defaultOpen").click();

	// Create uneven fake buttons in the tab (just for testing)
	var i, j, groups = document.getElementsByClassName("tabcontent");
	for (i = 0; i < groups.length; i++) {
		for (j = 1; j <= 17-(i+1)*3; j++) {
	        groups[i].append(createLinkLevel(j));
	    }
    }

	// Create a link to a level in the menu
	function createLinkLevel(k) {
		var levelLink = document.createElement("div");
		levelLink.textContent = k;
		levelLink.className = "levelLink";
		return levelLink;
	}
}
