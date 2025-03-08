import { Vector } from '../../shared/Vector'
import { Point } from '../../types'
import { role } from '../Role/Role'
import { Actions, Character, ConstructedSpriteData } from './Character'

import {
	drawGunBodyPresets,
	spriteHeight,
	spriteWidth,
	staleStandingLegsPresets,
	staleStowedGunBodyPresets,
	walkDrawnGunBodyPresets,
	walkLegsPresets,
} from '../../MarioSystem/Entity/Player/PlayerSprites'

export class Papi extends Character {
	constructor(
		lvl: number,
		stats: Stats,
		position: Point,
		rotation = 0,
		vector = new Vector(0, 0),
		size = { height: spriteHeight * 4, width: spriteWidth * 4 }
	) {
		const actions: Actions = {
			stale: { state: 'in-use', durationMs: 0, completeMs: 1125 },
			walk: { state: 'not-in-use', durationMs: 0, completeMs: 1125 },
			hit: { state: 'not-in-use', durationMs: 0, completeMs: 750 },
			die: { state: 'not-in-use', durationMs: 0, completeMs: 750 },
		}

		super(
			'Papi',
			role.archeologist,
			lvl,
			stats,
			actions,
			position,
			vector,
			rotation,
			size
		)
	}

	decideBodySprite(): ConstructedSpriteData {
		switch (true) {
			case this.actions.walk.state === 'in-use':
				return this.constructSpriteData({ presets: walkDrawnGunBodyPresets, action: this.actions.walk })
			case this.actions.hit.state === 'in-use':
				return this.constructSpriteData({ presets: drawGunBodyPresets, action: this.actions.hit })
			default:
				return this.constructSpriteData({ presets: staleStowedGunBodyPresets, action: this.actions.stale })
		}
	}

	decideLegsSprite(): ConstructedSpriteData {
		switch (true) {
			case this.actions.walk.state === 'in-use':
				return this.constructSpriteData({ presets: walkLegsPresets, action: this.actions.walk })
			case this.actions.hit.state === 'in-use':
				return this.constructSpriteData({ presets: staleStandingLegsPresets, action: this.actions.hit })
			default:
				return this.constructSpriteData({ presets: staleStandingLegsPresets, action: this.actions.stale })
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
		
		this.drawBar(ctx)

		ctx.imageSmoothingEnabled = false

		let scaleXMultiplier = 1

		// if (this.direction === 'right') scaleXMultiplier = -1
		// if (this.direction === 'left') scaleXMultiplier = 1

		ctx.scale(scaleXMultiplier, 1)

		const legsSprite = this.decideLegsSprite()
		const bodySprite = this.decideBodySprite()

		if (focused) {
			this.drawCharacterOutline({
				ctx,
				spriteWidth,
				spriteHeight,
				legsSprite,
				bodySprite,
				scaleXMultiplier,
				color: 'yellow',
			})
		} else if (selected) {
			this.drawCharacterOutline({
				ctx,
				spriteWidth,
				spriteHeight,
				legsSprite,
				bodySprite,
				scaleXMultiplier,
				color: 'red',
			})
		}

		this.drawCharacter({
			ctx,
			spriteWidth,
			spriteHeight,
			legsSprite,
			bodySprite,
			scaleXMultiplier,
		})

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
