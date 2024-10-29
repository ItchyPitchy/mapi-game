import { Component } from './Component'

export class Collidable extends Component {
	constructor(public restitution: number, public stationary: boolean = true) {
		super()
	}
}
