function simulate(definition) {
	const model = build(definition);
	player.init(model);

	const functions = {
		count: function(name) {
			return [...model.structures.keys()].filter(k => k.startsWith(name)).length
		},
		create: function(name, attributes) {
			const count = [...model.structures.keys()].filter(k => k.startsWith(name)).length;
			const structureName = `${name}-${count}`;
			const structure = deepCopy(attributes);
			structure["name"] = structureName;
			model.structures.set(structureName, structure);
		},
		remove: function(name) {
			model.structures.delete(name);
		}
	};

	var events = detect(model, functions);

	while (events.length > 0) {
		events.forEach(event => {
			execute(model, functions, event)
			player.schedule(model, event);
		})
		events = detect(model, functions);
	}

	player.stop();
}

function detect(model, functions) {
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
		return cartesian(... lists).map(function(product) {
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
				return new Function("{count, create, remove}", ...constraint.roles, `return ${constraint.condition};`)(
					functions, ... constraint.roles.map(role => 
						applyImmutableRole(model.structures.get(event.assignment.get(role)), 
							model.roles.get(role))
					)
				);
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

function execute(model, functions, event) {
	event.interaction.behaviours.map(function(b) {
		const behaviour = model.behaviours.get(b);
		const values = behaviour.roles.map(role => applyMutableRole(
			model.structures.get(event.assignment.get(role)), 
			model.roles.get(role)));

		new Function("{count, create, remove}", ...behaviour.roles, `${behaviour.action};`)(functions, ... values)

		behaviour.roles.forEach(function(role, index){
			const value = values[index];
			const structure = model.structures.get(event.assignment.get(role));
			model.roles.get(role).attributes.forEach(function(attribute) {
				if (attribute.writable) {
					structure[attribute.name] = value[attribute.name];
				}
			})
		})

		const removal = values.map((value, i) => [model.structures.get(event.assignment.get(behaviour.roles[i])), value.deactivated])
			.filter(([s, t]) => t)
			.map(([s, t]) => s.name);
		removal.forEach(s => model.structures.delete(s));
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