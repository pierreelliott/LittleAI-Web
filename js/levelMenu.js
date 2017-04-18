window.addEventListener("load", function() {
	var link = document.getElementById("levelMenuLink");
	var closeBtn = document.getElementById("levelMenuCloseButton");
	link.addEventListener("click", openNav);
	closeBtn.addEventListener("click", closeNav);

	/* Open when someone clicks on the span element */
	function openNav() {
		document.getElementById("myNav").style.height = "100%";
	}

	/* Close when someone clicks on the "x" symbol inside the overlay */
	function closeNav() {
		document.getElementById("myNav").style.height = "0%";
	}
});
