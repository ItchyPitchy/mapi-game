import { Component } from './Component'

export class Collidable extends Component {
	public collisionLeft = false
	public collisionRight = false
	public collisionTop = false
	public collisionBottom = false

	constructor(public restitution: number, public stationary: boolean = true) {
		super()
	}
}
