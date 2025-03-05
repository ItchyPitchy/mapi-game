import { Point } from '../../../types'
import { Vector } from '../../../shared/Vector'
import { Entity } from '../Entity'
import { Gravitational } from '../../Component/Gravitational'
import { Collidable } from '../../Component/Collidable'
import { dyingZombieV1FullBodyPresets, dyingZombieV1StaleFullBodyPresets, staleZombieV1BodyPresets, walkZombieV1BodyPresets, walkZombieV1LegsPresets } from './ZombieSprites'
import { IStats, Stats } from '../../Component/Stats'

const spriteWidth = 30
const spriteHeight = 30

export type Actions = {
	stale: ActionState
	walk: ActionState
	die: ActionState
}

type ActionState = {
	state: 'not-in-use' | 'in-use' | 'complete'
	durationMs: number
	completeMs: number
}

export class ZombieV1 extends Entity {
	public direction: 'left' | 'right' = 'right'
	public actions: Actions = {
		stale: { state: 'in-use', durationMs: 0, completeMs: 2250 },
		walk: { state: 'not-in-use', durationMs: 0, completeMs: 1000 },
		die: { state: 'not-in-use', durationMs: 0, completeMs: 1000 }
	}

	constructor(position: Point, size = { height: 140, width: 140 }) {
		const stats: Omit<IStats, 'maxHp' | 'maxMana'> = {
			strength: 1,
			dexterity: 1,
			intelligence: 1,
			speed: 1,
			hp: 100,
			mana: 100,
		}

		super(position, size, new Vector(0, 0), [
			new Gravitational(1000),
			new Collidable('mob', ['wall']),
			new Stats(stats)
		])
	}

	calculateHitbox(): { x: number; y: number; width: number; height: number } {
		const ratio = 0.2
		const x = this.position.x - (this.size.width / 2) * ratio
		const y = this.position.y - this.size.height
		const width = this.size.width - this.size.width * (1 - ratio)
		const height = this.size.height

		return { x, y, width, height }
	}

	decideBodySprite(): {
		presets: { img: HTMLImageElement; sprites: number }
		action: { completeMs: number; durationMs: number } | null
	} {
		switch (true) {
			case this.actions.die.state === 'in-use': {
				return { presets: dyingZombieV1FullBodyPresets, action: this.actions.die }
			}
			case this.actions.die.state === 'complete': {
				return { presets: dyingZombieV1StaleFullBodyPresets, action: null }
			}
			case this.actions.walk.state === 'in-use': {
				return { presets: walkZombieV1BodyPresets, action: this.actions.walk }
			}
			default:
				return { presets: staleZombieV1BodyPresets, action: this.actions.stale }
		}
	}

	decideLegsSprite(): {
		presets: { img: HTMLImageElement; sprites: number }
		action: { completeMs: number; durationMs: number } | null
	} | null {
		if (this.actions.die.state === 'in-use' || this.actions.die.state === 'complete') return null

		switch (true) {
			case this.actions.walk.state === 'in-use': {
				return { presets: walkZombieV1LegsPresets, action: this.actions.walk }
			}
			default:
				return null
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.save()

		const hitbox = this.calculateHitbox()

		// ctx.strokeStyle = 'yellow'
		// ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height)
		// ctx.stroke()

		// const barHeight = 10

		// ctx.fillStyle = 'grey'
		// ctx.fillRect(
		// 	hitbox.x,
		// 	hitbox.y - barHeight * 2,
		// 	hitbox.width,
		// 	barHeight,
		// )

		// ctx.fillStyle = 'red'
		// ctx.fillRect(
		// 	hitbox.x,
		// 	hitbox.y - barHeight * 2,
		// 	hitbox.width * (this.getComponent(Stats).hp / this.getComponent(Stats).maxHp),
		// 	barHeight,
		// )

		// ctx.fillStyle = 'grey'
		// ctx.fillRect(
		// 	hitbox.x,
		// 	hitbox.y - barHeight,
		// 	hitbox.width,
		// 	barHeight,
		// )

		// ctx.fillStyle = 'blue'
		// ctx.fillRect(
		// 	hitbox.x,
		// 	hitbox.y - barHeight,
		// 	hitbox.width * (this.getComponent(Stats).mana / this.getComponent(Stats).maxMana),
		// 	barHeight,
		// )

		// ctx.lineWidth = 2
		// ctx.strokeStyle = 'yellow'
		// ctx.strokeRect(
		// 	hitbox.x,
		// 	hitbox.y - barHeight * 2,
		// 	hitbox.width,
		// 	barHeight,
		// )
		
		// ctx.strokeStyle = 'yellow'
		// ctx.strokeRect(
		// 	hitbox.x,
		// 	hitbox.y - barHeight,
		// 	hitbox.width,
		// 	barHeight,
		// )

		ctx.imageSmoothingEnabled = false

		let scaleXMultiplier = 1

		if (this.direction === 'left') scaleXMultiplier = -1
		if (this.direction === 'right') scaleXMultiplier = 1

		ctx.scale(scaleXMultiplier, 1)

		const bodySprite = this.decideBodySprite()

		const bodyPercentProgress =
			bodySprite.action === null
				? 0
				: bodySprite.action.durationMs > bodySprite.action.completeMs
				? (bodySprite.action.durationMs % bodySprite.action.completeMs) /
				  bodySprite.action.completeMs
				: bodySprite.action.durationMs / bodySprite.action.completeMs

		const bodySpriteStep = Math.floor(
			bodyPercentProgress * bodySprite.presets.sprites
		)

		ctx.drawImage(
			bodySprite.presets.img,
			spriteWidth * bodySpriteStep,
			0,
			spriteWidth,
			spriteHeight,
			scaleXMultiplier * this.position.x - this.size.width / 2,
			this.position.y - this.size.height,
			this.size.width,
			this.size.height
		)

		const legsSprite = this.decideLegsSprite()

		if (legsSprite) {
			const legsPercentProgress =
				legsSprite.action === null
					? 0
					: legsSprite.action.durationMs > legsSprite.action.completeMs
					? (legsSprite.action.durationMs % legsSprite.action.completeMs) /
						legsSprite.action.completeMs
					: legsSprite.action.durationMs / legsSprite.action.completeMs
	
			const legsSpriteStep = Math.floor(
				legsPercentProgress * legsSprite.presets.sprites
			)
	
			ctx.drawImage(
				legsSprite.presets.img,
				spriteWidth * legsSpriteStep,
				0,
				spriteWidth,
				spriteHeight,
				scaleXMultiplier * this.position.x - this.size.width / 2,
				this.position.y - this.size.height,
				this.size.width,
				this.size.height
			)
		}

		ctx.restore()
	}
}
