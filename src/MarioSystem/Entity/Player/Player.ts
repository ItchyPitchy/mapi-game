import { Point } from '../../../types'
import { Vector } from '../../../shared/Vector'
import { Entity } from '../Entity'
import { Gravitational } from '../../Component/Gravitational'
import { Collidable } from '../../Component/Collidable'
import {
	ascendDrawnGunBodyPresets,
	ascendDrawnGunLegsPresets,
	descendDrawnGunBodyPresets,
	descendDrawnGunLegsPresets,
	drawGunBodyPresets,
	jumpDrawnGunBodyPresets,
	jumpLegsPresets,
	sprintStowedGunBodyPresets,
	sprintStowedGunLegsPresets,
	spriteHeight,
	spriteWidth,
	staleDrawnGunBodyPresets,
	staleStandingLegsPresets,
	staleStowedGunBodyPresets,
	stoweGunBodyPresets,
	walkDrawnGunBodyPresets,
	walkLegsPresets,
} from './PlayerSprites'

export type Actions = {
	walk: ActionState
	sprint: ActionState
	draw: ActionState
	stowe: ActionState
	jump: ActionState
	ascend: ActionState
	descend: ActionState
	crouch: ActionState
}

type ActionState = {
	state: 'not-in-use' | 'in-use' | 'complete'
	durationMs: number
	completeMs: number
}

export class Player extends Entity {
	public direction: 'left' | 'right' = 'left'
	public actions: Actions = {
		walk: { state: 'not-in-use', durationMs: 0, completeMs: 1125 },
		sprint: { state: 'not-in-use', durationMs: 0, completeMs: 1000 },
		draw: { state: 'not-in-use', durationMs: 0, completeMs: 750 },
		stowe: { state: 'not-in-use', durationMs: 0, completeMs: 750 },
		jump: { state: 'not-in-use', durationMs: 0, completeMs: 600 },
		ascend: { state: 'not-in-use', durationMs: 0, completeMs: 1000 },
		descend: { state: 'not-in-use', durationMs: 0, completeMs: 1000 },
		crouch: { state: 'not-in-use', durationMs: 0, completeMs: 1000 },
	}
	public weapon: { state: 'not-drawn' | 'drawn' } = {
		state: 'drawn',
	}

	constructor(position: Point, size = { height: 140, width: 100 }) {
		super(position, size, new Vector(0, 0), [
			new Gravitational(1000),
			new Collidable(0, false),
		])
	}

	calculateHitbox(): { x: number; y: number; width: number; height: number } {
		const ratio = 0.5
		const x = this.position.x - (this.size.width / 2) * ratio
		const y = this.position.y - this.size.height
		const width = this.size.width - this.size.width * ratio
		const height = this.size.height

		return { x, y, width, height }
	}

	decideBodySprite(): {
		presets: { img: HTMLImageElement; sprites: number }
		action: { completeMs: number; durationMs: number } | null
	} {
		switch (true) {
			case this.actions.ascend.state === 'in-use':
				return {
					presets: ascendDrawnGunBodyPresets,
					action: this.actions.ascend,
				}
			case this.actions.descend.state === 'in-use':
				return {
					presets: descendDrawnGunBodyPresets,
					action: this.actions.descend,
				}
			case this.actions.jump.state === 'in-use' &&
				this.weapon.state === 'drawn':
				return { presets: jumpDrawnGunBodyPresets, action: this.actions.jump }
			case this.actions.jump.state === 'in-use' &&
				this.weapon.state === 'not-drawn':
				return { presets: jumpDrawnGunBodyPresets, action: this.actions.jump }
			case this.actions.stowe.state === 'in-use':
				return { presets: stoweGunBodyPresets, action: this.actions.stowe }
			case this.actions.draw.state === 'in-use':
				return { presets: drawGunBodyPresets, action: this.actions.draw }
			case this.actions.walk.state === 'in-use' &&
				this.weapon.state === 'drawn':
				return { presets: walkDrawnGunBodyPresets, action: this.actions.walk }
			case this.actions.walk.state === 'in-use' &&
				this.weapon.state === 'not-drawn':
				return { presets: walkDrawnGunBodyPresets, action: this.actions.walk }
			case this.actions.sprint.state === 'in-use' &&
				this.weapon.state === 'drawn':
				return {
					presets: sprintStowedGunBodyPresets,
					action: this.actions.sprint,
				}
			case this.actions.sprint.state === 'in-use' &&
				this.weapon.state === 'not-drawn':
				return {
					presets: sprintStowedGunBodyPresets,
					action: this.actions.sprint,
				}
			case this.weapon.state === 'drawn':
				return { presets: staleDrawnGunBodyPresets, action: null }
			case this.weapon.state === 'not-drawn':
				return { presets: staleStowedGunBodyPresets, action: null }
			default:
				return { presets: staleStowedGunBodyPresets, action: null }
		}
	}

	decideLegsSprite(): {
		presets: { img: HTMLImageElement; sprites: number }
		action: { completeMs: number; durationMs: number } | null
	} {
		switch (true) {
			case this.actions.ascend.state === 'in-use':
				return {
					presets: ascendDrawnGunLegsPresets,
					action: this.actions.ascend,
				}
			case this.actions.descend.state === 'in-use':
				return {
					presets: descendDrawnGunLegsPresets,
					action: this.actions.descend,
				}
			case this.actions.jump.state === 'in-use' &&
				this.weapon.state === 'drawn':
				return { presets: jumpLegsPresets, action: this.actions.jump }
			case this.actions.jump.state === 'in-use' &&
				this.weapon.state === 'not-drawn':
				return { presets: jumpLegsPresets, action: this.actions.jump }
			case this.actions.walk.state === 'in-use' &&
				this.weapon.state === 'drawn':
				return { presets: walkLegsPresets, action: this.actions.walk }
			case this.actions.walk.state === 'in-use' &&
				this.weapon.state === 'not-drawn':
				return { presets: walkLegsPresets, action: this.actions.walk }
			case this.actions.sprint.state === 'in-use' &&
				this.weapon.state === 'drawn':
				return {
					presets: sprintStowedGunLegsPresets,
					action: this.actions.sprint,
				}
			case this.actions.sprint.state === 'in-use' &&
				this.weapon.state === 'not-drawn':
				return {
					presets: sprintStowedGunLegsPresets,
					action: this.actions.sprint,
				}
			default:
				return { presets: staleStandingLegsPresets, action: null }
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.save()

		// const hitbox = this.calculateHitbox()

		// ctx.strokeStyle = 'yellow'
		// ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height)
		// ctx.stroke()

		ctx.imageSmoothingEnabled = false

		let scaleXMultiplier = 1

		console.log(this.direction)
		if (this.direction === 'right') scaleXMultiplier = -1
		if (this.direction === 'left') scaleXMultiplier = 1

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

		ctx.restore()
	}
}
