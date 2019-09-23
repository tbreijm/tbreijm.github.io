class Player {
	constructor() {
		this.timeline = new TimelineMax();
		this.structures = new Set();

		this.boxes = new Map([
			["advisor", {width: '20%', height: '20%', x: '40%', y: '40%'}],
			["button", {width: "5%", height: "5%", x: "3%", y: "90%"}],
			["research", {width: "10%", height: "10%", x: "3%", y: "25%"}],
			["meeting", {width: "10%", height: "10%", x: "3%", y: "45%"}],
			["preparation", {width: "10%", height: "10%", x: "3%", y: "65%"}]
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

		const clickable = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		clickable.setAttribute('id', 'pause_clickable');
		clickable.setAttribute('width', '100%');
		clickable.setAttribute('height', '100%');
		clickable.setAttribute('fill', 'none');
		clickable.setAttribute('pointer-events', 'visible');
		clickable.addEventListener("click", event => this.pauseEvents(event));

		pause.appendChild(clickable);
		return pause;
	}

	slider() {
		const sliderGroup = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		sliderGroup.setAttribute('id', 'slider');
		sliderGroup.setAttribute('x', '10%');
		sliderGroup.setAttribute('width', '80%');
		sliderGroup.setAttribute('y', '90%');
		sliderGroup.setAttribute('height', '5%');
		

		const clickable = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		clickable.setAttribute('id', 'slider_clickable');
		clickable.setAttribute('width', '100%');
		clickable.setAttribute('height', '100%');
		clickable.setAttribute('fill', 'none');
		clickable.setAttribute('pointer-events', 'visible');
		clickable.addEventListener("click", this.sliderEvents.bind(this));

		const slider = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		slider.setAttribute('width', '100%');
		slider.setAttribute('y', '40%');
		slider.setAttribute('height', '20%');
		slider.setAttribute('fill', '#cccccc');

		const progress = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		progress.setAttribute('id', 'progress');
		progress.setAttribute('width', '0%');
		progress.setAttribute('y', '40%');
		progress.setAttribute('height', '20%');
		progress.setAttribute('fill', 'black');

		sliderGroup.appendChild(slider);
		sliderGroup.appendChild(progress);
		sliderGroup.appendChild(clickable);

		return sliderGroup;
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

	sliderEvents(event) {
		const slider = $('#slider')[0];
		const point = slider.createSVGPoint();
		point.x = event.clientX;
		point.y = event.clientY;

		const x = point.matrixTransform(slider.getScreenCTM().inverse()).x;
		const width = slider.width.baseVal.value;

		const percent = Math.round(x * 100.0 / width);
		this.timeline.progress(percent / 100);
	}

	updateProgress() {
		const percent = Math.round(this.timeline.progress() * 100);
		$('#progress')[0].setAttribute("width", `${percent}%`);
	}

	init(model) {
		const self = this;

		self.timeline.eventCallback("onUpdate", this.updateProgress, ["{self}"], self);
		self.timeline.add("init");

		const maxEmployees = [...model.structures.keys()].filter(key => key.startsWith("employee")).length;

		[...model.structures.keys()]
		.forEach(function(key) {
			const structure = model.structures.get(key);

			self.structures.add(key);

			if (key === "advisor") {
				self.fadeIn(image("employee", structure.name, self.boxes.get("advisor"), images.person));
			} else if (key.startsWith("employee")) {
				const id = (structure.id - 1);
				const space = (70.0 - 10*maxEmployees) / (maxEmployees-1);
				const y = 10 * (id+1) + (space*id);
				const box = {width: '10%', height: '10%', x: '70%', y: `${y}%`};

				self.fadeIn(image("employee", structure.name, box, images.person));
			}
		});

		['research', 'meeting', 'preparation'].forEach(
			activity => self.fadeIn(image('activity', activity, self.boxes.get(activity), images[activity])));
	}

	fadeIn(img) {
		const self = this;
		self.canvas.appendChild(img);
		self.timeline.to(img, 0.5, {attr: {opacity: 1}}, "init");
	}

	schedule(model, event) {
		const self = this;

		if (event.interaction.name == "communication") {
			const senderId = event.assignment.get("sender");
			const receiverId = event.assignment.get("receiver");
			
			const sender = model.structures.get(senderId);
			const receiver = model.structures.get(receiverId);

			const senderSVG = $(`#${senderId}`)[0];
			const receiverSVG = $(`#${receiverId}`)[0];

			const start = {
				x: senderSVG.x.baseVal.value + senderSVG.width.baseVal.value / 2,
				y: senderSVG.y.baseVal.value + senderSVG.height.baseVal.value * 0.1,
				width: '5%',
				height: '5%'
			};

			const end = {
				x: receiverSVG.x.baseVal.value + receiverSVG.width.baseVal.value / 2,
				y: receiverSVG.y.baseVal.value + receiverSVG.height.baseVal.value * 0.1,
				width: '5%',
				height: '5%'
			};

			const img = image('communication', 'communication', start, images.communication);
			self.timeline.call(function () {
				document.getElementById("canvas").appendChild(img);
			})
			.to(img, 0.1, {attr: {opacity: 1}})
			.to(img, 0.5, {attr: end})
			.to(img, 0.1, {attr: {opacity: 0}})
			.call(function () {
				$('#communication').remove();
			})
			.to($(`#${receiverId}_text`), 0.5, {text:{value:`${receiver.communications}`}});			

			/*const forward = (senderId == "advisor");

			const obj = event.assignment.get("receiver");
			const count = model.structures.get(obj).communications;

			const box = this.boxes.get(forward ? "communication-forward" : "communication-backward");
			const img = image(`communication`, "communication", box, images.communication);

			self.timeline.call(function () {
				document.getElementById("canvas").appendChild(img);
			})
			.to(img, 0.5, {attr: {opacity: 1}})
			.to(img, 0.5, {attr: this.boxes.get(!forward ? "communication-forward" : "communication-backward")})
			.to(img, 0.5, {attr: {opacity: 0}})
			.call(function () {
				$('#communication').remove();
				//const text = $(`#${obj}_text`)[0];
				//text.textContent = `${count}`;
			})
			.to($(`#${obj}_text`), 0.5, {text:{value:`${count}`}});*/
		}
	}

	stop() {
		const self = this;

		self.timeline
		.call(function() {
			$('#slider_clickable').remove();
			self.timeline.eventCallback("onUpdate", null);
			$('#progress')[0].setAttribute("width", '100%');
		})
		.to($('#pause'), 0.5, {attr: {opacity: 0}})
		.call(function() {
			$('#pause').remove();
			const play = self.playButton();
			self.canvas.appendChild(play);
			self.timeline.to(play, 0.5, {attr: {opacity: 1}})
		});
	}
}