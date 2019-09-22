function player() {
	const play = image("playerButton", "play", boxes.get("play"), images.play);
	play.addEventListener("click", play, false);
	play.handleEvent = playEvents;
	document.getElementById("canvas").appendChild(play);
	timeline.to(".playerButton", 0.5, {attr: {opacity: 1}});

	function playEvents(event) {
		switch (event.type){
			case "click":
				reset();
				break;
		}
	}

	function pauseEvents(event) {
		switch (event.type){
			case "click":
				timeline.pause();
				break;
		}
	}

	function reset() {
		timeline.clear();

		$.getJSON("/definition.json", function(data) {
			$('#canvas').empty();
			structures.clear();
			document.getElementById("canvas").appendChild(play);
			timeline.add("loaded");
			timeline.play("loaded");
			simulate(data);
		});
	}
}