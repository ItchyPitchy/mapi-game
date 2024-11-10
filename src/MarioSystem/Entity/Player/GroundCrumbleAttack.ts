import { Point } from '../../../types'
import { Vector } from '../../../shared/Vector'
import { Entity } from '../Entity'
import { Collidable } from '../../Component/Collidable'
import { Delete } from '../../Component/Delete'
import { Damage } from '../../Component/Damage'

import groundCrumbleAttackPng from '../../../assets/ground_crumble_effect_v2-Sheet.png'

const groundCrumbleAttackImg = new Image()
groundCrumbleAttackImg.src = groundCrumbleAttackPng
const buttAttackDrawnGunStaleWholeBodyImgPresets = {
	sprites: 6,
	img: groundCrumbleAttackImg,
  width: 50,
  height: 12,
}

export class GroundCrumbleAttack extends Entity {
  public progressMs = 0

	constructor(position: Point, public durationMs = 500, size = { height: 50, width: 250 }) {
		const onTrigger = (self: Entity, other: Entity) => {
			const otherHitbox = other.calculateHitbox()
			const selfHitbox = self.calculateHitbox()

			let hitDirection: 'left' | 'right' = 'left'

			other.vector.y = -200

			if (selfHitbox.x + selfHitbox.width / 2 < otherHitbox.x + otherHitbox.width / 2) {
				other.vector.x = 500
				hitDirection = 'right'
			}
			if (selfHitbox.x + selfHitbox.width / 2 > otherHitbox.x + otherHitbox.width / 2) {
				other.vector.x = -500
				hitDirection = 'left'
			}

			other.addComponents(new Damage(20, { x: other.position.x, y: other.position.y }, hitDirection))
		}
		
		super(
			position,
			size,
			new Vector(0, 0),
			[
				new Delete(durationMs),
				new Collidable('playerAttack', ['mob'], true, onTrigger)
			]
		)
	}

	calculateHitbox(): { x: number; y: number; width: number; height: number } {
		const x = this.position.x - this.size.width / 2
		const y = this.position.y - this.size.height
		const width = this.size.width
		const height = this.size.height

		return { x, y, width, height }
	}

	draw(ctx: CanvasRenderingContext2D, dt: number) {
		ctx.save()

		// const hitbox = this.calculateHitbox()

		// ctx.strokeStyle = 'yellow'
		// ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height)
		// ctx.stroke()

		ctx.imageSmoothingEnabled = false

    const animationProgress = this.progressMs > this.durationMs
        ? (this.progressMs % this.durationMs) /
          this.durationMs
        : this.progressMs / this.durationMs

    const animationStep = Math.floor(
      animationProgress * buttAttackDrawnGunStaleWholeBodyImgPresets.sprites
    )

    ctx.drawImage(
      buttAttackDrawnGunStaleWholeBodyImgPresets.img,
      buttAttackDrawnGunStaleWholeBodyImgPresets.width * animationStep,
      0,
      buttAttackDrawnGunStaleWholeBodyImgPresets.width,
      buttAttackDrawnGunStaleWholeBodyImgPresets.height,
      this.position.x - this.size.width / 2,
      this.position.y - this.size.height,
      this.size.width,
      this.size.height
    )

		ctx.restore()

    this.progressMs += dt * 1000
	}
}
