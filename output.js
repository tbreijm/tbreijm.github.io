function output({model, event}) {
	function info(event) {
		const info = document.createElement("ul");
		const name = document.createElement("li");
		name.appendChild(document.createTextNode(`Interaction: ${event.interaction.name}`));
		info.appendChild(name);

		if ("structures" in event) {
			const structures = document.createElement("li");
			const text = [...event.structures].join(', ');
			structures.appendChild(document.createTextNode(`Structures: ${text}`));
			info.appendChild(structures);
		}

		if ("assignment" in event) {
			const assignment = document.createElement("li");
			const text = [...event.assignment].map(([k, v]) => `${v} => ${k}`).join(', ');
			assignment.appendChild(document.createTextNode(`Assignments: ${text}`));
			info.appendChild(assignment);
		}

		return info;
	}

	const list = document.getElementById("list");
	const changes = document.createElement("li");
	
	changes.appendChild(document.createTextNode(`Interaction: ${event.interaction.name}`));
	const parent = document.createElement("ul");

	deepCopy([...model.structures.values()]).forEach(function(structure)
	{
		const structureLI = document.createElement("li");
		const structureUL = document.createElement("ul");

		for (let key of Object.keys(structure)) {
			const li = document.createElement("li");
			li.appendChild(document.createTextNode(`${key}: ${structure[key]}`));
			structureUL.appendChild(li);
		}

		structureLI.appendChild(structureUL);
		parent.appendChild(structureLI);
	})

	changes.appendChild(info(event));
	changes.appendChild(parent);
	list.appendChild(changes);
}