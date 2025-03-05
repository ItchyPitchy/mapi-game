import { Point, Size } from '../types'

export type Constructor<T> = new (...args: any[]) => T

export default class Entity {
	constructor(public position: Point, public size: Size, public rotation = 0) {}

	distanceTo(position: Point) {
		return Math.sqrt(
			Math.pow(this.position.x - position.x, 2) +
				Math.pow(this.position.y - position.y, 2)
		)
	}

	draw(
		_: {
			ctx: CanvasRenderingContext2D
			offsetX?: number
			offsetY?: number
		},
		dt: number,
		selected?: boolean,
		focused?: boolean
	) {
		throw new Error('#draw not implemented yet!')
	}
}
