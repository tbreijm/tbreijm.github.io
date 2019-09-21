const timeline = new TimelineMax();
const structures = new Set();

const boxes = new Map([
	["employee-0", {width: 200, height: 200, x: 700, y: 300}],
	["employee", {width: 200, height: 200, x: 1200, y: 300}],
	["communication-forward", {width: 50, height: 50, x: 775, y: 275}],
	["communication-backward", {width: 50, height: 50, x: 1275, y: 275}],
	["play", {width: "5%", height: "5%", x: "5%", y: "90%"}]
])

function buildPlayer() {
	timeline.add("player");

	const play = image("playerButton", "play", boxes.get("play"), images.play);
	document.getElementById("canvas").appendChild(play);
	play.addEventListener("click", play, false);
	play.handleEvent = function(event) {
		switch (event.type){
			case "click":
				timeline.play("loaded");
				break;
		}
	}

	timeline.staggerTo(".playerButton", 0.5, {attr: {opacity: 1}, onComplete: function() {
		console.log("player loaded");
		timeline.add("loaded").pause();
		$.getJSON("/definition.json", function(data) {
			simulate(data);
		});
	}}, 0.1);
}

function output({model, event}) {
	if (event) {
		cleanUp(model);
		initialise(model);
		effect(event);
		modify(model);

		structures.clear();
		[...model.structures.keys()].forEach(structure => structures.add(structure));
	} else {
		initialise(model);
	}
}

function cleanUp(model) {
	for (let structure of structures) {
		if (!model.structures.has(structure)) {
			timeline.to($(`#${structure}`), 1, {autoAlpha: 0, ease: Back.easeOut, onComplete: function() {
				$(`#${structure}`).remove();
			}})
		}
	}
}

function initialise(model) {
	[...model.structures.keys()]
		.filter(structure => !structures.has(structure))
		.forEach(function(key) {
			const structure = model.structures.get(key);

			structures.add(key);

			var img;

			if (key === "employee-0") {
				img = image("employee", structure.name, boxes.get("employee-0"), images.person);
			} else if (key.startsWith("employee-")) {
				img = image("employee", structure.name, boxes.get("employee"), images.person);
			}

			if (img) {
				document.getElementById("canvas").appendChild(img);
				timeline.to(img, 0.5, {attr: {opacity: 1}});
			}
		});
}

function modify(model) {
	const keys = [...model.structures.keys()].filter(structure => structures.has(structure));
	
	keys.forEach(function(key) {
		const structure = model.structures.get(key);

		if (key.startsWith("employee-")) {
			// set text of employee to structure.communications
		}
	});
}

function effect(event) {
	if (event.interaction.name == "communication") {
		const senderId = event.assignment.get("sender");
		const forward = (senderId == "employee-0");

		const box = boxes.get(forward ? "communication-forward" : "communication-backward");
		const img = image(`communication`, "communication", box, images.communication);
		document.getElementById("canvas").appendChild(img);
		timeline.to(img, 0.5, {attr: {opacity: 1}})
		.to(img, 0.5, {attr: boxes.get(!forward ? "communication-forward" : "communication-backward")})
		.to(img, 0.5, {attr: {opacity: 0}, onComplete: function() {}});
	}
}