import Entity from './Entity'
import { Vector } from '../../shared/Vector'
import { Point } from '../../types'
import { Role } from '../Role/Role'
import { SkillEffect } from '../SkillEffect'

export type Actions = {
	stale: ActionState
	walk: ActionState
	hit: ActionState
	die: ActionState
}

type ActionState = {
	state: 'not-in-use' | 'in-use' | 'complete'
	durationMs: number
	completeMs: number
}

export type ConstructedSpriteData = {
	presets: { img: HTMLImageElement; sprites: number }
	action: { completeMs: number; durationMs: number } | null
	step: number
}

export class Character extends Entity {
	public atkBar: number = 0
	public effects: SkillEffect[] = []
	public originalPosition: Point

	constructor(
		public name: string,
		public role: Role,
		public lvl: number,
		public stats: Stats,
		public actions: Actions,
		position: Point,
		vector = new Vector(0, 0),
		rotation = 0,
		size = { height: 96, width: 96 }
	) {
		super(
			position,
			size,
			rotation,
			vector
		)

		this.originalPosition = {
			x: position.x,
			y: position.y,
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

	drawBar(ctx: CanvasRenderingContext2D) {
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
			hitbox.width * Math.max(this.stats.hp / this.stats.maxHp, 0),
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
			hitbox.width * Math.max(this.stats.stamina / this.stats.maxStamina, 0),
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
			hitbox.width * Math.max(this.atkBar / 1, 0),
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
	}

	drawCharacter({
		ctx,
		spriteWidth,
		spriteHeight,
		legsSprite,
		bodySprite,
		scaleXMultiplier = 1,
	}: {
		ctx: CanvasRenderingContext2D,
		spriteWidth: number,
		spriteHeight: number,
		legsSprite: ConstructedSpriteData | null,
		bodySprite: ConstructedSpriteData,
		scaleXMultiplier: number
	}) {
		if (legsSprite) {
			ctx.drawImage(
				legsSprite.presets.img,
				spriteWidth * legsSprite.step,
				0,
				spriteWidth,
				spriteHeight,
				scaleXMultiplier * this.position.x - this.size.width / 2,
				this.position.y - this.size.height,
				this.size.width,
				this.size.height
			)
		}

		ctx.drawImage(
			bodySprite.presets.img,
			spriteWidth * bodySprite.step,
			0,
			spriteWidth,
			spriteHeight,
			scaleXMultiplier * this.position.x - this.size.width / 2,
			this.position.y - this.size.height,
			this.size.width,
			this.size.height
		)
	}
	
	drawCharacterOutline({
		ctx,
		spriteWidth,
		spriteHeight,
		legsSprite,
		bodySprite,
		scaleXMultiplier = 1,
		color,
	}: {
		ctx: CanvasRenderingContext2D,
		spriteWidth: number,
		spriteHeight: number,
		legsSprite: ConstructedSpriteData | null,
		bodySprite: ConstructedSpriteData,
		scaleXMultiplier: number,
		color: string,
	}) {
		ctx.shadowColor = color
		ctx.shadowBlur = 0

		const outlineThickness = 2

		const offsetArray = [-outlineThickness, outlineThickness]

		for (let i = 0; i < offsetArray.length; i++) {
			ctx.shadowOffsetX = offsetArray[i]

			for (let j = 0; j < offsetArray.length; j++) {
				ctx.shadowOffsetY = offsetArray[j]

				this.drawCharacter({
					ctx,
					spriteWidth,
					spriteHeight,
					legsSprite,
					bodySprite,
					scaleXMultiplier,
				})
			}
		}

		ctx.shadowOffsetX = 0
		ctx.shadowOffsetY = 0
	}

	constructSpriteData(sprite: Omit<ConstructedSpriteData, 'step'>) {
		const percentProgress =
			sprite.action === null
				? 0
				: sprite.action.durationMs > sprite.action.completeMs
				? (sprite.action.durationMs % sprite.action.completeMs) /
					sprite.action.completeMs
				: sprite.action.durationMs / sprite.action.completeMs
	
		return {
			...sprite,
			step: Math.floor(
				percentProgress * sprite.presets.sprites
			)
		} 
	}
}

export interface Foe extends Character {
	generateStatsFromLvl: Readonly<(lvl: number) => Stats>
}
