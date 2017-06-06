function closeInfoPanel() {
	document.getElementById("infoPanel").style.display = "none";
}

function openInfoPanel() {
	document.getElementById("infoContent").style.display = "block";
	document.getElementById("replayModeContent").style.display = "none";
	document.getElementById("infoPanel").style.display = "block";
}

function openReplayMode() {
	document.getElementById("infoContent").style.display = "none";
	document.getElementById("replayModeContent").style.display = "block";
	document.getElementById("infoPanel").style.display = "block";

	if(!replayModeCreated) {
		initializeReplayMode();
		replayModeCreated = true;
	}
}
