import { Role } from '../Component/Role'
import { Point } from '../point'
import Player from './Player'

export default class Papi extends Player {
	constructor(position: Point, optional?: { hp?: number }) {
		const size = { width: 100, height: 100 }
		const hp = optional?.hp || 100

		super(position, size, hp)

		this.addComponents(new Role('archeologist'))
	}

	draw(ctx: CanvasRenderingContext2D) {
		throw new Error('Not implemented yet')
	}
}
