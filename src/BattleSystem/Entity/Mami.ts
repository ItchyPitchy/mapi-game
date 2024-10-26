import Entity from '../../shared/Entity'
import { Point } from '../../types'
import { role } from '../Role/Role'
import { Character } from './Character'
import spritesheet from '../../assets/mami_spritesheet.png'

export class Mami extends Entity implements Character {
	public name = 'Mami'
	public role = role.medic
	public hp
	public effects = []
	public spritesheet = new Image()

	constructor(
		public lvl: number,
		public stats: Stats,
		position: Point,
		rotation = 0,
		size = { height: 96, width: 96 }
	) {
		super(position, size, rotation)

		this.spritesheet.src = spritesheet
		this.hp = stats.maxHp
	}

	draw(
		{
			ctx,
			offsetX = 0,
			offsetY = 0,
		}: {
			ctx: CanvasRenderingContext2D
			offsetX?: number
			offsetY?: number
		},
		selected = false
	) {
		ctx.save()
		ctx.translate(offsetX, offsetY)

		ctx.imageSmoothingEnabled = false

		if (selected) {
			ctx.shadowColor = 'yellow'
			ctx.shadowBlur = 0

			const outlineThickness = 2

			const offsetArray = [-outlineThickness, outlineThickness]

			for (let i = 0; i < offsetArray.length; i++) {
				ctx.shadowOffsetX = offsetArray[i]

				for (let j = 0; j < offsetArray.length; j++) {
					ctx.shadowOffsetY = offsetArray[j]

					ctx.drawImage(
						this.spritesheet,
						this.position.x - this.size.width / 2,
						this.position.y - this.size.height,
						this.size.width,
						this.size.height
					)
				}
			}
		}

		ctx.drawImage(
			this.spritesheet,
			this.position.x - this.size.width / 2,
			this.position.y - this.size.height,
			this.size.width,
			this.size.height
		)

		ctx.resetTransform()
		ctx.restore()
	}
}
