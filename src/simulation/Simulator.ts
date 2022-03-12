import {debounceTime, Subject, takeUntil} from 'rxjs'
import {Simulation} from './Simulation'

const simulator = (simulation: Simulation, completionTime: number) => {
	const graph = simulation.initialState
	const stop: Subject<boolean> = new Subject<boolean>()

	const actionSubscription = graph.changes.pipe(
		takeUntil(stop)
	).subscribe((change) => {
		const actions = simulation.applications.filter(_ => _.condition(change, graph)).map(_ => _.action)
		for (const action of actions) {
			action(change, graph)
		}
	})

	const transmissionSubscription = graph.changes.pipe(
		takeUntil(stop),
		debounceTime(completionTime)
	).subscribe(() => {
		for (const transmission of simulation.transmissions) {
			transmission.send(transmission.serialise(graph))
		}

		if (simulation.termination(graph)) {
			stop.next(true)
		} else {
			simulation.progression(graph)
		}
	})

	simulation.progression(graph)

	return {
		stop,
		actionSubscription,
		transmissionSubscription,
	}
}

export {
	simulator
}