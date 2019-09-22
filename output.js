const timeline = new TimelineMax();
const structures = new Set();

const boxes = new Map([
	["employee-0", {width: 200, height: 200, x: 700, y: 300}],
	["employee", {width: 200, height: 200, x: 1200, y: 300}],
	["communication-forward", {width: 50, height: 50, x: 775, y: 250}],
	["communication-backward", {width: 50, height: 50, x: 1275, y: 250}],
	["play", {width: "5%", height: "5%", x: "5%", y: "90%"}]
])

function output({model, event}) {
	if (event) {
		cleanUp(model);
		initialise(model);
		effect(model, event);

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

function effect(model, event) {
	if (event.interaction.name == "communication") {
		const senderId = event.assignment.get("sender");
		const forward = (senderId == "employee-0");

		const obj = event.assignment.get("receiver");
		const count = model.structures.get(obj).communications;
		
		const func = function () {
			const text = $(`#${obj}_text`)[0];
			text.textContent = `${count}`;
		}

		const box = boxes.get(forward ? "communication-forward" : "communication-backward");
		const img = image(`communication`, "communication", box, images.communication);
		document.getElementById("canvas").appendChild(img);

		timeline.to(img, 0.5, {attr: {opacity: 1}})
		.to(img, 0.5, {attr: boxes.get(!forward ? "communication-forward" : "communication-backward")})
		.to(img, 0.5, {attr: {opacity: 0}, onComplete: func});
	}
}