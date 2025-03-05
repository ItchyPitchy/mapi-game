import Entity from '../../shared/Entity'
import { Vector } from '../../shared/Vector'
import { Point } from '../../types'
import { role } from '../Role/Role'
import { Actions, Character } from './Character'
import spritesheet from '../../assets/papi_spritesheet.png'

import {
	drawGunBodyPresets,
	spriteHeight,
	spriteWidth,
	staleStandingLegsPresets,
	staleStowedGunBodyPresets,
	walkDrawnGunBodyPresets,
	walkLegsPresets,
} from '../../MarioSystem/Entity/Player/PlayerSprites'

export class Papi extends Entity implements Character {
	public name = 'Papi'
	public role = role.archeologist
	public atkBar = 0
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
		public stats: Stats,
		position: Point,
		rotation = 0,
		size = { height: spriteHeight * 4, width: spriteWidth * 4 }
	) {
		super(position, size, rotation)

		this.originalPosition = {
			x: position.x,
			y: position.y
		}
		// this.spritesheet.src = spritesheet
	}

	calculateHitbox(): { x: number; y: number; width: number; height: number } {
		const ratio = 1
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
			case this.actions.walk.state === 'in-use':
				return { presets: walkDrawnGunBodyPresets, action: this.actions.walk }
			case this.actions.hit.state === 'in-use':
				return { presets: drawGunBodyPresets, action: this.actions.hit }
			default:
				return { presets: staleStowedGunBodyPresets, action: this.actions.stale }
		}
	}

	decideLegsSprite(): {
		presets: { img: HTMLImageElement; sprites: number }
		action: { completeMs: number; durationMs: number } | null
	} {
		switch (true) {
			case this.actions.walk.state === 'in-use':
				return { presets: walkLegsPresets, action: this.actions.walk }
			case this.actions.hit.state === 'in-use':
				return { presets: staleStandingLegsPresets, action: this.actions.hit }
			default:
				return { presets: staleStandingLegsPresets, action: this.actions.stale }
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
		dt: number,
		selected = false,
		focused = false
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

		let scaleXMultiplier = 1

		// if (this.direction === 'right') scaleXMultiplier = -1
		// if (this.direction === 'left') scaleXMultiplier = 1

		ctx.scale(scaleXMultiplier, 1)

		const legsSprite = this.decideLegsSprite()

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

		if (selected) {
			ctx.shadowColor = 'green'
			ctx.shadowBlur = 0

			const outlineThickness = 2

			const offsetArray = [-outlineThickness, outlineThickness]

			for (let i = 0; i < offsetArray.length; i++) {
				ctx.shadowOffsetX = offsetArray[i]

				for (let j = 0; j < offsetArray.length; j++) {
					ctx.shadowOffsetY = offsetArray[j]

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
				}
			}
		}
		
		if (focused) {
			ctx.shadowColor = 'yellow'
			ctx.shadowBlur = 0

			const outlineThickness = 4

			const offsetArray = [-outlineThickness, outlineThickness]

			for (let i = 0; i < offsetArray.length; i++) {
				ctx.shadowOffsetX = offsetArray[i]

				for (let j = 0; j < offsetArray.length; j++) {
					ctx.shadowOffsetY = offsetArray[j]

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
				}
			}
		}

		ctx.shadowOffsetX = 0
		ctx.shadowOffsetY = 0

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

		// if (selected) {
		// 	ctx.shadowColor = 'yellow'
		// 	ctx.shadowBlur = 0

		// 	const outlineThickness = 2

		// 	const offsetArray = [-outlineThickness, outlineThickness]

		// 	for (let i = 0; i < offsetArray.length; i++) {
		// 		ctx.shadowOffsetX = offsetArray[i]

		// 		for (let j = 0; j < offsetArray.length; j++) {
		// 			ctx.shadowOffsetY = offsetArray[j]

		// 			ctx.drawImage(
		// 				this.spritesheet,
		// 				this.position.x - this.size.width / 2,
		// 				this.position.y - this.size.height,
		// 				this.size.width,
		// 				this.size.height
		// 			)
		// 		}
		// 	}
		// }

		// ctx.drawImage(
		// 	this.spritesheet,
		// 	this.position.x - this.size.width / 2,
		// 	this.position.y - this.size.height,
		// 	this.size.width,
		// 	this.size.height
		// )

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
