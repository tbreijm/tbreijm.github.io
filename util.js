function deepCopy(value) {
	return JSON.parse(JSON.stringify(value));
}

function applyMutableRole(structure, role) {
	let data = {};

	function addProperty(name, value, writable) {
		Object.defineProperty(data, name, {
			value: value,
			enumerable: true,
			writable: !!writable,
			configurable: false
		})
	}

	function primitive(value) {
		return (typeof value !== "function" && typeof value !== "object")
	}

	addProperty("deactivated", false, true);

	for (let a of role.attributes) {
		const value = structure[a.name];

		if (a.name in data) {
			continue;
		} else if (primitive(value)) {
			addProperty(a.name, value, a.writable);
		} else if (a.writable) {
			addProperty(a.name, deepCopy(value), true);
		} else {
			addProperty(a.name, Object.freeze(deepCopy(value)), false);
		}
	}

	return Object.seal(data);
}

function applyImmutableRole(structure, role) {
	let data = {};

	for (let a of role.attributes) {
		const value = structure[a.name];

		if (typeof value === "function" || typeof value === "object") {
			Object.defineProperty(data, a.name, { 
				value: Object.freeze(deepCopy(value))
			})
		}
		else {
			Object.defineProperty(data, a.name, { 
				value: value
			})
		}
	}

	return Object.freeze(data);
}
