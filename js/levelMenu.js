/* Open when someone clicks on the span element */
function openNav() {
	document.getElementById("levelMenu").style.height = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
	document.getElementById("levelMenu").style.height = "0%";
}

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

/* Function which create fake buttons (just for testing) */
window.onload = function () {
	// To load directly the "group1" tab
	document.getElementById("defaultOpen").click();

	var i, j, groups = document.getElementsByClassName("tabcontent");
	for (i = 0; i < groups.length; i++) {
		for (j = 1; j <= 17-(i+1)*3; j++) {
	        groups[i].append(createLinkLevel(j));
	    }
    }

	function createLinkLevel(j) {
		var levelLink = document.createElement("div");
		levelLink.textContent = j;
		levelLink.className = "levelLink";
		return levelLink;
	}
}
