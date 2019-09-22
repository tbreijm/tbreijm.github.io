function intro() {
	const timeline = new TimelineMax({paused:true, onComplete:start});

	timeline.to($("#brixms"), 0.5, {
		autoAlpha: 0, 
		ease: Back.easeOut,
		onComplete: function () {
			$("#brixms").remove();

			timeline.add("circles");

			const elements = [
				{ name: "structures", colour: "#564AC4", degrees: 300 }, 
				{ name: "roles", colour: "#0080FF", degrees: 240 } ,
				{ name: "constraints", colour: "#40B700", degrees: 0 } , 
				{ name: "behaviours", colour: "#FFCC00", degrees: 180} ,
				{ name: "interactions", colour: "#FF8000", degrees: 60} ,
				{ name: "events", colour: "#D45113", degrees: 120}
			];
			const canvas = document.getElementById("canvas");

			for (let element of elements) {
				const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	
				circle.setAttribute("id", element.name);
				circle.setAttribute("cx", 800);
				circle.setAttribute("cy", 450);
				circle.setAttribute("r", 100);
				circle.setAttribute("fill", element.colour);
				circle.setAttribute("fill-opacity", 0);
	
				canvas.appendChild(circle);

				timeline.to(circle, 0.5, {
					rotation: `-=${element.degrees}`,
					transformOrigin: "50% 50%",
					attr: {"fill-opacity": 1, cx: 1100}
				}, "circles");
			}

			timeline.add("fade");

			for (let element of elements) {
				timeline.to($(`#${element.name}`), 1, {
					attr: {"fill-opacity": 0}, onComplete:function() {$(`#${element.name}`).remove()}
				}, "fade");
			}
		}
	})

	timeline.restart();
}

function start() {
	player();
}