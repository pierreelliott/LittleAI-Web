/**
 * setLanguage - Define the language of the game
 * 					If the language isn't known, english language will be loaded
 *
 * @param  {type} lang The string code of the language to set (like "fr", "en", ...)
 * @returns {void}      Nothing
 */
function setLanguage(lang) {
	if(!/(fr|en)/.test(lang)) {
		lang = "en";
	}
	console.log("Language: " + lang);
	ajax("i18n/"+lang+".json", function (d) {
		translate = i18n.create(d);
		ajax("levels/levels.json", function(data) {
			initializeMenu(data);
			initializeGame();
		});
	});
}

function initializeI18n() {
	UIRessources.set(level.id, document.getElementById("menuLink"));
}

function updateContent() {
	for(key of UIRessources.keys) {
		UIRessources.get(key).textContent = translate(key);
	}
}
