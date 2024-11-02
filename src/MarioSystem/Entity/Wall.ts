import { Point, Size } from '../../types'
import { Collidable } from '../Component/Collidable'
import { Entity } from './Entity'

export class Wall extends Entity {
	constructor(position: Point, size: Size) {
		super(position, size)

		this.addComponents(new Collidable(0))
	}

	calculateHitbox(): { x: number; y: number; width: number; height: number } {
		const x = this.position.x
		const y = this.position.y
		const width = this.size.width
		const height = this.size.height

		return { x, y, width, height }
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.save()

		ctx.fillStyle = 'black'
		ctx.fillRect(
			this.position.x,
			this.position.y,
			this.size.width,
			this.size.height
		)

		ctx.fillStyle = 'orange'
		ctx.strokeRect(
			this.position.x,
			this.position.y,
			this.size.width,
			this.size.height
		)
		ctx.stroke()

		// const hitbox = this.calculateHitbox()

		// ctx.strokeStyle = 'yellow'
		// ctx.strokeRect(
		// 	hitbox.x + 1,
		// 	hitbox.y + 1,
		// 	hitbox.width - 2,
		// 	hitbox.height - 2
		// )
		// ctx.stroke()

		ctx.restore()
	}
}
