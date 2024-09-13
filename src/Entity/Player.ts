import { Health } from '../Component/Health'
import { Point, Size } from '../types'
import Entity from './Entity'

export default class Player extends Entity {
	constructor(position: Point, size: Size, hp: number) {
		super(position, size)

		this.addComponents(new Health(hp))
	}

	draw(ctx: CanvasRenderingContext2D) {
		throw new Error('Not implemented yet')
	}
}
