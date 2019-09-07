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

function simulate(definition) {
	const model = build(definition);
	var events = detect(model);

	while (events.length > 0) {
		events.forEach(event => {
			execute(model, event)
			output({model, event});
		})
		events = detect(model);
	}
}

function detect(model) {
	function index(roles, structures) {
		function isSubset(subset, set) {
			return [...subset].every(k => set.has(k));
		}

		const roleAttributesMap = new Map(roles.map(role => 
			[role, new Set(model.roles.get(role).attributes.map(a => a.name))]));
		const structureAttributesMap = new Map([...structures.keys()].map(structure => 
			[structure, new Set(Object.keys(structures.get(structure)))]));

		return new Map(roles.map(function(role) {
			const roleAttributes = roleAttributesMap.get(role);

			return [
				role,
				new Set([...structures.keys()].filter(function(structure) {
					return isSubset(roleAttributes, structureAttributesMap.get(structure));
				}))
			]
		}))
	}

	function collectRoles(interaction) {
		const behaviourRoles = interaction.behaviours.flatMap(behaviour => model.behaviours.get(behaviour).roles);
		const constraintRoles = interaction.constraints.flatMap(constraint => model.constraints.get(constraint).roles);

		return [...new Set([...behaviourRoles, ...constraintRoles])];
	}

	function coarsePhase(interaction, roles, roleStructuresMap) {
		const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
		const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

		const lists = roles.map(r => [... roleStructuresMap.get(r)]);
		return events = cartesian(... lists).map(function(product) {
			const structures = [product].flat();

			return {
				interaction: interaction,
				structures: [... new Set(structures)],
				assignment: new Map(structures.map((structure, index) => [roles[index], structure]))
			}
		});
	}

	function finePhase(events) {
		return events.filter(event => 
			event.interaction.constraints.every(function(c) {
				const constraint = model.constraints.get(c);
				return new Function(constraint.roles, `return ${constraint.condition};`)(
					... constraint.roles.map(role => 
						applyImmutableRole(model.structures.get(event.assignment.get(role)), 
							model.roles.get(role))
					)
				)
			})
		);
	}

	return [...model.interactions.keys()].flatMap(function(key) {
		const interaction = model.interactions.get(key);
		const roles = collectRoles(interaction);
		const roleStructuresMap = index(roles, model.structures);
		return finePhase(coarsePhase(interaction, roles, roleStructuresMap));
	})
}

function execute(model, event) {
	event.interaction.behaviours.map(function(b) {
		const behaviour = model.behaviours.get(b);
		const values = behaviour.roles.map(role => applyMutableRole(
			model.structures.get(event.assignment.get(role)), 
			model.roles.get(role)));

		new Function(behaviour.roles, `${behaviour.action};`)(... values)

		behaviour.roles.forEach(function(role, index){
			const value = values[index];
			const structure = model.structures.get(event.assignment.get(role));
			model.roles.get(role).attributes.forEach(function(attribute) {
				if (attribute.writable) {
					structure[attribute.name] = value[attribute.name];
				}
			})
		})
	})
}

function build(definition) {
	let model = {};

	function index(entities) {
		return new Map(entities.map(e => [e.name, e]));
	}

	Object.defineProperty(model, "structures", {
			value: index(definition.structures),
			enumerable: true,
			writable: true,
			configurable: false
	});

	Object.defineProperty(model, "roles", {
			value: index(definition.roles),
			enumerable: true,
			writable: false,
			configurable: false
	});

	Object.defineProperty(model, "behaviours", {
			value: index(definition.behaviours),
			enumerable: true,
			writable: false,
			configurable: false
	});

	Object.defineProperty(model, "constraints", {
			value: index(definition.constraints),
			enumerable: true,
			writable: false,
			configurable: false
	});

	Object.defineProperty(model, "interactions", {
			value: index(definition.interactions),
			enumerable: true,
			writable: false,
			configurable: false
	});	

	return Object.seal(model);
}
