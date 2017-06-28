function initializeStorage() {
	if (typeof(Storage) === "undefined") {
		console.log("HTML5 default local storage isn't supported");
		localStorage = new Map();
		localStorage.setItem = localStorage.set;
		localStorage.getItem = localStorage.get;
	}
}

function storeObject(data) {
	var object = data.object;
	if (data.object !== null && typeof data.object === 'object') {
		try {
			object = JSON.stringify(object);
		} catch(e) {
			return false;
		}
	}

	localStorage.setItem(data.key, object);

	return true;
}

function retrieveObject(key, isJSON = true) {
	var object = localStorage.getItem(key);
	if(isJSON && object !== null) {
		object = JSON.parse(object);
	}
	return object;
}

function isStored(key) {
	var data  = localStorage.getItem(key);
	if (data === null) {
		return false;
	} else {
		return true;
	}
}
