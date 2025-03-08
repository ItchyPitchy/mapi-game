import { Vector } from '../../shared/Vector'
import { Point } from '../../types'
import { role } from '../Role/Role'
import { Actions, Character } from './Character'
import {
	staleZombieV1BodyPresets,
	walkZombieV1BodyPresets,
	walkZombieV1LegsPresets,
	dyingZombieV1FullBodyPresets,
	dyingZombieV1StaleFullBodyPresets,
} from '../../MarioSystem/Entity/Zombie/ZombieSprites'

const spriteWidth = 30
const spriteHeight = 30

const generateStatsFromLvl = (lvl: number): Stats => {
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

export class Zombie extends Character {
	public spritesheet = new Image()

	constructor(
		lvl: number,
		position: Point,
		rotation = 0,
		vector = new Vector(0, 0),
		size = { height: spriteHeight * 4, width: spriteWidth * 4 }
	) {
		const stats = generateStatsFromLvl(lvl)
		const actions: Actions = {
			stale: { state: 'in-use', durationMs: 0, completeMs: 2250 },
			walk: { state: 'not-in-use', durationMs: 0, completeMs: 1000 },
			hit: { state: 'not-in-use', durationMs: 0, completeMs: 2250 },
			die: { state: 'not-in-use', durationMs: 0, completeMs: 1000 },
		}

		super(
			'Zombie',
			role.zombie,
			lvl,
			stats,
			actions,
			position,
			vector,
			rotation,
			size
		)
	}

	decideBodySprite(): {
		presets: { img: HTMLImageElement; sprites: number }
		action: { completeMs: number; durationMs: number } | null
		step: number
	} {
		switch (true) {
			case this.actions.die.state === 'in-use':
				return this.constructSpriteData({ presets: dyingZombieV1FullBodyPresets, action: this.actions.die })
			case this.actions.die.state === 'complete':
				return this.constructSpriteData({ presets: dyingZombieV1StaleFullBodyPresets, action: null })
			case this.actions.walk.state === 'in-use':
				return this.constructSpriteData({ presets: walkZombieV1BodyPresets, action: this.actions.walk })
			case this.actions.hit.state === 'in-use':
				return this.constructSpriteData({ presets: staleZombieV1BodyPresets, action: this.actions.hit })
			default:
				return this.constructSpriteData({ presets: staleZombieV1BodyPresets, action: this.actions.stale })
		}
	}

	decideLegsSprite(): {
		presets: { img: HTMLImageElement; sprites: number }
		action: { completeMs: number; durationMs: number } | null
		step: number
	} | null {
		if (this.actions.die.state === 'in-use' || this.actions.die.state === 'complete') return null

		switch (true) {
			case this.actions.walk.state === 'in-use':
				return this.constructSpriteData({ presets: walkZombieV1LegsPresets, action: this.actions.walk })
			default:
				return null
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
		focused =  false
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
		if (this.actions.die.state === 'in-use')
			this.actions.die.durationMs += dt * 1000

		if (this.actions.hit.durationMs >= this.actions.hit.completeMs)
			this.actions.hit.state = 'complete'
		if (this.actions.die.durationMs >= this.actions.die.completeMs)
			this.actions.die.state = 'complete'
	}
}
