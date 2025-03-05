import Entity from '../../shared/Entity'
import { Vector } from '../../shared/Vector'
import { Point } from '../../types'
import { role } from '../Role/Role'
import { Actions, Foe } from './Character'
import spritesheet from '../../assets/zombie_spritesheet.png'

export class Zombie extends Entity implements Foe {
	public size = {
		height: 100,
		width: 100,
	}
	public name = 'Zombie'
	public role = role.zombie
	public atkBar = 0
	public stats
	public effects = []
	public spritesheet = new Image()
	public originalPosition
	public vector: Vector = new Vector(0, 0)
	public actions: Actions = {
		stale: { state: 'in-use', durationMs: 0, completeMs: 1125 },
		walk: { state: 'not-in-use', durationMs: 0, completeMs: 1125 },
		hit: { state: 'not-in-use', durationMs: 0, completeMs: 750 },
	}

	constructor(
		public lvl: number,
		position: Point,
		rotation = 0,
		size = { height: 50, width: 50 }
	) {
		super(position, size, rotation)

		this.spritesheet.src = spritesheet

		const stats = this.generateStatsFromLvl(lvl)
		this.originalPosition = {
			x: position.x,
			y: position.y
		}
		this.stats = stats
	}

	generateStatsFromLvl(lvl: number): Stats {
		const baseMissChance = 0.4
		const baseTakeHitChance = 0.9

		return {
			hp: 40 * lvl,
			maxHp: 40 * lvl,
			stamina: 40 * lvl,
			maxStamina: 40 * lvl,
			strength: 1 * lvl,
			intelligence: 1 * lvl,
			hitRate: 1 - baseMissChance * lvl,
			dodgeChance: 1 - baseTakeHitChance * lvl,
			speed: 1 * lvl,
		}
	}

	calculateHitbox(): { x: number; y: number; width: number; height: number } {
		const ratio = 1
		const x = this.position.x - (this.size.width / 2) * ratio
		const y = this.position.y - this.size.height
		const width = this.size.width - this.size.width * (1 - ratio)
		const height = this.size.height

		return { x, y, width, height }
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
		dt: number,
		selected = false,
		focused =  false
	) {
		ctx.save()
		ctx.translate(offsetX, offsetY)

		const hitbox = this.calculateHitbox()

		const barHeight = 10
		
		ctx.fillStyle = 'grey'
		ctx.fillRect(
			hitbox.x,
			hitbox.y - barHeight * 3,
			hitbox.width,
			barHeight,
		)

		ctx.fillStyle = 'red'
		ctx.fillRect(
			hitbox.x,
			hitbox.y - barHeight * 3,
			hitbox.width * (this.stats.hp / this.stats.maxHp),
			barHeight,
		)

		ctx.fillStyle = 'grey'
		ctx.fillRect(
			hitbox.x,
			hitbox.y - barHeight * 2,
			hitbox.width,
			barHeight,
		)

		ctx.fillStyle = 'blue'
		ctx.fillRect(
			hitbox.x,
			hitbox.y - barHeight * 2,
			hitbox.width * (this.stats.stamina / this.stats.maxStamina),
			barHeight,
		)
		
		ctx.fillStyle = 'grey'
		ctx.fillRect(
			hitbox.x,
			hitbox.y - barHeight,
			hitbox.width,
			barHeight,
		)

		ctx.fillStyle = 'green'
		ctx.fillRect(
			hitbox.x,
			hitbox.y - barHeight,
			hitbox.width * (this.atkBar / 1),
			barHeight,
		)

		ctx.lineWidth = 2
		
		ctx.strokeStyle = 'yellow'
		ctx.strokeRect(
			hitbox.x,
			hitbox.y - barHeight * 3,
			hitbox.width,
			barHeight,
		)
		
		ctx.strokeStyle = 'yellow'
		ctx.strokeRect(
			hitbox.x,
			hitbox.y - barHeight * 2,
			hitbox.width,
			barHeight,
		)
		
		ctx.strokeStyle = 'yellow'
		ctx.strokeRect(
			hitbox.x,
			hitbox.y - barHeight,
			hitbox.width,
			barHeight,
		)

		ctx.imageSmoothingEnabled = false

		if (selected) {
			ctx.shadowColor = 'green'
			ctx.shadowBlur = 0

			const outlineThickness = 4

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

		if (focused) {
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

		if (this.actions.stale.state === 'in-use')
			this.actions.stale.durationMs += dt * 1000
		if (this.actions.walk.state === 'in-use')
			this.actions.walk.durationMs += dt * 1000
		if (this.actions.hit.state === 'in-use')
			this.actions.hit.durationMs += dt * 1000

		if (this.actions.hit.durationMs >= this.actions.hit.completeMs)
			this.actions.hit.state = 'complete'
	}
}
