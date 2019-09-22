class Player {
	constructor() {
		this.timeline = new TimelineMax();
		this.structures = new Set();

		this.boxes = new Map([
			["employee-0", {width: 200, height: 200, x: 700, y: 300}],
			["employee", {width: 200, height: 200, x: 1200, y: 300}],
			["communication-forward", {width: 50, height: 50, x: 775, y: 250}],
			["communication-backward", {width: 50, height: 50, x: 1275, y: 250}],
			["button", {width: "5%", height: "5%", x: "5%", y: "90%"}]
		])
	}

	canvas(name) {
		this.canvas = document.getElementById(name);
		this.timeline.repeat(-1).repeatDelay(0.5)
			.to("#brixms", 1.5, {scale:1.2, transformOrigin: "50% 50%"})
			.to("#brixms", 1.5, {scale:1})
	}

	intro() {
		const self = this;

		const elements = [
			{ name: "structures", colour: "#564AC4", degrees: 300 }, 
			{ name: "roles", colour: "#0080FF", degrees: 240 } ,
			{ name: "constraints", colour: "#40B700", degrees: 0 } , 
			{ name: "behaviours", colour: "#FFCC00", degrees: 180} ,
			{ name: "interactions", colour: "#FF8000", degrees: 60} ,
			{ name: "events", colour: "#D45113", degrees: 120}
		];

		const circles = elements.map(element => self.buildIntroCircle(element));

		self.timeline.clear().repeat(0).add("circles", 0.5)
			.add("fade", 1)
			.add("load", 1.5)

		self.timeline.to($("#brixms"), 0.5, {autoAlpha: 0, ease: Back.easeOut, onComplete: function() {
			$("#brixms").remove();
			circles.forEach(function(circle, index) {
				self.canvas.appendChild(circle)

				self.timeline.to(circle, 0.5, {
					rotation: `-=${elements[index].degrees}`,
					transformOrigin: "50% 50%",
					attr: {"fill-opacity": 1, cx: 1100}
				}, "circles").to(circle, 0.5, {attr: {"fill-opacity": 0}}, "fade");
			});
		}}).call(self.load, [], self, "load");
	}

	buildIntroCircle(element) {
		const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	
		circle.setAttribute("id", element.name);
		circle.setAttribute("class", 'circles');
		circle.setAttribute("cx", 800);
		circle.setAttribute("cy", 450);
		circle.setAttribute("r", 100);
		circle.setAttribute("fill", element.colour);
		circle.setAttribute("fill-opacity", 0);
	
		return circle;
	}

	load() {
		$('#canvas').empty();
		this.canvas.appendChild(this.playButton());
		this.canvas.appendChild(this.slider());
		this.timeline.to("#play", 0.5, {attr: {opacity: 1}});
	}

	playButton() {
		const play = image("playerButton", "play", this.boxes.get("button"), images.play);
		play.addEventListener("click", event => this.playEvents(event));
		return play;
	}

	pauseButton() {
		const pause = image("playerButton", "pause", this.boxes.get("button"), images.pause);
		pause.addEventListener("click", event => this.pauseEvents(event));
		return pause;
	}

	slider() {
		const slider = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		slider.setAttribute('x', '10%');
		slider.setAttribute('width', '80%');
		slider.setAttribute('y', '92%');
		slider.setAttribute('height', '10');
		slider.setAttribute('fill', '#cccccc');

		return slider;
	}

	playEvents(event) {
		const self = this;

		this.timeline.clear();

		$.getJSON("/definition.json", function(data) {
			$('#canvas').empty();
			self.structures.clear();
			self.canvas.appendChild(self.pauseButton());
			self.canvas.appendChild(self.slider());
			self.timeline.add("loaded");
			self.timeline.play("loaded");
			simulate(data);
		});
	}

	pauseEvents(event) {
		this.timeline.paused(!this.timeline.paused());
	}

	init(model) {
		const self = this;

		[...model.structures.keys()]
		.filter(structure => !self.structures.has(structure))
		.forEach(function(key) {
			const structure = model.structures.get(key);

			self.structures.add(key);

			var img;

			if (key === "employee-0") {
				img = image("employee", structure.name, self.boxes.get("employee-0"), images.person);
			} else if (key.startsWith("employee-")) {
				img = image("employee", structure.name, self.boxes.get("employee"), images.person);
			}

			if (img) {
				self.canvas.appendChild(img);
				self.timeline.to(img, 0.5, {attr: {opacity: 1}});
			}
		});
	}

	schedule(model, event) {
		if (event.interaction.name == "communication") {
			const senderId = event.assignment.get("sender");
			const forward = (senderId == "employee-0");

			const obj = event.assignment.get("receiver");
			const count = model.structures.get(obj).communications;

			const box = this.boxes.get(forward ? "communication-forward" : "communication-backward");
			const img = image(`communication`, "communication", box, images.communication);

			this.timeline.call(function () {
				document.getElementById("canvas").appendChild(img);
			})
			.to(img, 0.5, {attr: {opacity: 1}})
			.to(img, 0.5, {attr: this.boxes.get(!forward ? "communication-forward" : "communication-backward")})
			.to(img, 0.5, {attr: {opacity: 0}})
			.call(function () {
				$('#communication').remove();
				const text = $(`#${obj}_text`)[0];
				text.textContent = `${count}`;
			});
		}
	}

	stop() {
		const self = this;

		self.timeline
		.to($('#pause'), 0.5, {attr: {opacity: 0}})
		.call(function() {
			$('#pause').remove();
			const play = self.playButton();
			self.canvas.appendChild(play);
			self.timeline.to(play, 0.5, {attr: {opacity: 1}})
		});
	}
}