import { Point } from '../../point'
import { Component } from './Component'

export class Damage extends Component {
	constructor(public points: number, public hitPosition: Point, public hitDirection: 'left' | 'right', public triggerInMs = 0) {
		super()
	}
}
