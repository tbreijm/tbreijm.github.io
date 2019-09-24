class Scenes {
	constructor() {
		this.communications = new TimelineMax();
		this.movements = new TimelineMax();
		this.activities = new TimelineMax();
	}

	timelines() {
		return [this.communications, this.movements, this.activities];
	}

	clear() {
		this.timelines().forEach(tl => tl.clear);
	}

	communication(model, event) {
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
		this.communications.call(function () {
			document.getElementById("canvas").appendChild(img);
		})
		.to(img, 0.1, {attr: {opacity: 1}})
		.to(img, 0.4, {attr: end})
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
		console.log(distribution);

		const researchSVG = $("#research")[0];
		const meetingSVG = $("#meeting")[0];
		const preparation = $("preparation")[0];

		//this.activities.to(researchSVG, 1, {attr: {scale:3, transformOrigin:"50% 50%"}}).delay(3).to(researchSVG, 1, {scale:1})
	}
}