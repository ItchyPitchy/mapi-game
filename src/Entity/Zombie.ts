import { Point, Size } from '../types'
import Foe from './Foe'

export default class Zombie extends Foe {
	constructor(position: Point, size: Size, hp: number) {
		super(position, size, hp)
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.save()
		ctx.fillStyle = '#00f'
		ctx.beginPath()
		ctx.arc(
			this.position.x,
			this.position.y,
			this.size.height / 2,
			0,
			2 * Math.PI
		)
		ctx.fill()
		ctx.restore()
	}
}
