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
	ajax("i18n/"+lang+".json", function (data) {
		storeObject({key: lang, object: data});
		translate = i18n.create(data);
		updateContent();
	});
}

function initializeI18n() {
	var menuLink = document.getElementById("menuLink");
	// Doesn't work
	menuLink.addEventListener("change", function () {
		menuLink.textContent = translate(menuLink.textContent);
	})

	var userLang = navigator.language || navigator.userLanguage;
	setLanguage(userLang);
}

function updateContent() {
	for(var key of UIRessources.keys()) {
		if(/(^group\d+_level\d+$|^group\d+$)/.test(key)) {
			UIRessources.get(key).textContent = translate(key);
		}
	}
}
