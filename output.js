const timeline = new TimelineMax();
const structures = new Set();

function output({model, event}) {
	if (event) {
		cleanUp(model);
		initialise(model);
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

			if (structure.name.startsWith("autowalk")) {
				addAutowalk(structure);
			} else if (structure.name.startsWith("traveller-")) {
				addTraveller(structure);
			}
		});
}

function modify(model) {
	const keys = [...model.structures.keys()].filter(structure => structures.has(structure));
	
	keys.forEach(function(key) {
		const structure = model.structures.get(key);

		if (structure.name.startsWith("traveller-")) {
			moveTraveller(structure);
		}
	});
}

function addAutowalk(autowalk) {
	const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	rect.setAttribute("id", autowalk.name);
	rect.setAttribute("x", autowalk.start * 100);
	rect.setAttribute("y", 600);
	rect.setAttribute("width", (autowalk.end - autowalk.start) * 100);
	rect.setAttribute("height", 10);
	rect.setAttribute("fill", "black");

	document.getElementById("canvas").appendChild(rect);
	structures.add(autowalk.name);
}

function addTraveller(traveller) {
	const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	rect.setAttribute("id", traveller.name);
	rect.setAttribute("x", traveller.location * 100);
	rect.setAttribute("y", 540);
	rect.setAttribute("width", 10);
	rect.setAttribute("height", 50);
	rect.setAttribute("fill", "black");

	document.getElementById("canvas").appendChild(rect);
	structures.add(traveller.name);
	timeline.add(traveller.name, "-="+timeline.time());
}

function moveTraveller(traveller) {
	timeline.to($(`#${traveller.name}`), 5, {x:traveller.location * 100}, traveller.name);
}