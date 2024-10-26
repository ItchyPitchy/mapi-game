import Entity from '../../shared/Entity'
import { Point } from '../../types'
import { role } from '../Role/Role'
import { Foe } from './Character'
import spritesheet from '../../assets/zombie_spritesheet.png'

export class Zombie extends Entity implements Foe {
	public size = {
		height: 100,
		width: 100,
	}
	public name = 'Zombie'
	public role = role.zombie
	public hp
	public stats
	public effects = []
	public spritesheet = new Image()

	constructor(
		public lvl: number,
		position: Point,
		rotation = 0,
		size = { height: 50, width: 50 }
	) {
		super(position, size, rotation)

		this.spritesheet.src = spritesheet

		const stats = this.generateStatsFromLvl(lvl)
		this.hp = stats.maxHp
		this.stats = stats
	}

	generateStatsFromLvl(lvl: number): Stats {
		const baseMissChance = 0.4
		const baseTakeHitChance = 0.9

		return {
			maxHp: 40 * lvl,
			maxStamina: 40 * lvl,
			strength: 1 * lvl,
			intelligence: 1 * lvl,
			hitRate: 1 - baseMissChance * lvl,
			dodgeChance: 1 - baseTakeHitChance * lvl,
		}
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
