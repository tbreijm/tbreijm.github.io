class Scenes {
	constructor() {
		this.communications = new TimelineMax();
		this.movements = new TimelineMax();
		this.activities = new TimelineMax();
		this.activitiesCount = 0;
	}

	timelines() {
		return [this.communications, this.movements, this.activities];
	}

	clear() {
		this.timelines().forEach(tl => tl.clear);
		this.activitiesCount = 0;
	}

	communication(model, event) {
		const senderId = event.assignment.get("sender");
		const receiverId = event.assignment.get("receiver");
		
		const sender = model.structures.get(senderId);
		const receiver = model.structures.get(receiverId);

		const senderSVG = $(`#${senderId}`)[0];
		const receiverSVG = $(`#${receiverId}`)[0];

		const start = {
			x: senderSVG.x.baseVal.value + senderSVG.width.baseVal.value * 0.75,
			y: senderSVG.y.baseVal.value - senderSVG.height.baseVal.value * 0.5,
			width: '5%',
			height: '5%'
		};

		const end = {
			x: receiverSVG.x.baseVal.value + receiverSVG.width.baseVal.value * 0.75,
			y: receiverSVG.y.baseVal.value - receiverSVG.height.baseVal.value * 0.5,
			width: '5%',
			height: '5%'
		};

		const img = image('communication', 'communication', start, images.communication);
		this.communications.call(function () {
			document.getElementById("canvas").appendChild(img);
		})
		.to(img, 0.1, {attr: {opacity: 1}})
		.to(img, 0.2, {attr: end})
		.to(img, 0.1, {attr: {opacity: 0}})
		.call(function () {
			$('#communication').remove();
		})
		.to($(`#${receiverId}_text`), 0.4, {text:{value:`${receiver.communications}`}});
	}

	movement(model, event) {
		const advisor = model.structures.get("advisor");
		const advisorSVG = $("#advisor")[0];
		this.movements.to(advisorSVG, 1, {attr: {x: `${advisor.x}%`, y: `${advisor.y}%`}});
	}

	work(model, event) {
		const distribution = new Map(model.structures.get("advisor").distribution);

		const researchSVG = $("#research")[0];
		const meetingSVG = $("#meeting")[0];
		const preparationSVG = $("#preparation")[0];

		const base = {width: 10, height: 10, x: 10};

		function box(box, y) {
			return {attr: {
				fill: "black", width: "10%", height: "10%", x: "10%", y: `${y}%`
			}};
		}

		function build(box, factor, y) {
			const newW = box.width * (2 * factor);
			const newH = box.height * (2 * factor);

			const colour = (factor > 0.5) ? '#40B700' : ((factor > 0.3) ? '#FFCC00' : '#D45113');

			return {attr: {
				fill: colour,
				width: `${newW}%`,
				height: `${newH}%`,
				x: `${box.x - (newW - box.width)/2}%`,
				y: `${y - (newH - box.height)/2}%`
			}};
		}

		const label = `activities_${this.activitiesCount}`;

		this.activities.add(label);

		this.activities.to(researchSVG, 0.5, build(base, distribution.get("research"), 25), label)
			.delay(2, `${label}+=1`)
			.to(researchSVG, 0.5, box(base, 25), `${label}+=2.5`);

		this.activities.to(meetingSVG, 0.5, build(base, distribution.get("meeting"), 45), label)
			.delay(2, `${label}+=1`)
			.to(meetingSVG, 0.5, box(base, 45), `${label}+=2.5`);

		this.activities.to(preparationSVG, 0.5, build(base, distribution.get("preparation"), 65), label)
			.delay(2, `${label}+=1`)
			.to(preparationSVG, 0.5, box(base, 65), `${label}+=2.5`);

		this.activitiesCount += 1;
	}
}