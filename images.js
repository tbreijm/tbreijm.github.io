const images = {
	play: {
		style: {
			fill:"#cccccc",
			stroke:"none",
			opacity: 0
		},
		viewBox: "0 0 357 357",
		paths: [],
		polygons: [
			"38.25,0 38.25,357 318.75,178.5"
		]
	},
	person: {
		style: {
			fill:"black",
			stroke:"none",
			opacity: 0,
		},
		viewBox: "0 0 512 512",
		paths: [
			'M437.02,330.98c-27.883-27.882-61.071-48.523-97.281-61.018C378.521,243.251,404,198.548,404,148C404,66.393,337.607,0,256,0S108,66.393,108,148c0,50.548,25.479,95.251,64.262,121.962c-36.21,12.495-69.398,33.136-97.281,61.018C26.629,379.333,0,443.62,0,512h40c0-119.103,96.897-216,216-216s216,96.897,216,216h40C512,443.62,485.371,379.333,437.02,330.98z M256,256c-59.551,0-108-48.448-108-108S196.449,40,256,40c59.551,0,108,48.448,108,108S315.551,256,256,256z'
		],
		polygons: []
	},
	communication: {
		style: {
			fill:"black",
			stroke:"none",
			opacity: 0,
		},
		viewBox: "-21 -47 682.66669 682",
		paths: [
			'm552.011719-1.332031h-464.023438c-48.515625 0-87.988281 39.464843-87.988281 87.988281v283.972656c0 48.414063 39.300781 87.816406 87.675781 87.988282v128.863281l185.191407-128.863281h279.144531c48.515625 0 87.988281-39.472657 87.988281-87.988282v-283.972656c0-48.523438-39.472656-87.988281-87.988281-87.988281zm50.488281 371.960937c0 27.835938-22.648438 50.488282-50.488281 50.488282h-290.910157l-135.925781 94.585937v-94.585937h-37.1875c-27.839843 0-50.488281-22.652344-50.488281-50.488282v-283.972656c0-27.84375 22.648438-50.488281 50.488281-50.488281h464.023438c27.839843 0 50.488281 22.644531 50.488281 50.488281zm0 0',
			'm171.292969 131.171875h297.414062v37.5h-297.414062zm0 0',
			'm171.292969 211.171875h297.414062v37.5h-297.414062zm0 0',
			'm171.292969 291.171875h297.414062v37.5h-297.414062zm0 0'
		],
		polygons: []
	}
}

function image(type, id, box, image) {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute("id", id);
	svg.setAttribute("class", type);
	svg.setAttribute("viewBox", image.viewBox);
	
	Object.keys(box).forEach(key => svg.setAttribute(key, box[key]));
	Object.keys(image.style).forEach(key => svg.setAttribute(key, image.style[key]));

	image.paths.map(function(path) {
		const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		p.setAttribute("d", path);
		return p;
	}).forEach(path => svg.appendChild(path));

	image.polygons.map(function(polygon) {
		const p = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
		p.setAttribute("points", polygon);
		return p;
	}).forEach(polygon => svg.appendChild(polygon));
	
	return svg;
}