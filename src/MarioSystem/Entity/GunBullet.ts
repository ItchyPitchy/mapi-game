import Game from '../../game'
import { Point } from '../../types'
import { Vector } from '../../shared/Vector'
import { Entity } from './Entity'

import { BloodSplatter } from './Zombie/BloodSplatter'
import { Collidable } from '../Component/Collidable'
import { Delete } from '../Component/Delete'
import { Damage } from '../Component/Damage'

import gunBulletTrailPng from '../../assets/gun_bullet_trail-Sheet.png'
import gunBulletPng from '../../assets/gun_bullet.png'

const gunBulletImg = new Image()
gunBulletImg.src = gunBulletPng
const gunBulletImgPresets = {
  sprites: 1,
  img: gunBulletImg,
  width: 2,
  height: 1,
}

const gunBulletTrailImg = new Image()
gunBulletTrailImg.src = gunBulletTrailPng
const gunBulletTrailPresets = {
  sprites: 3,
  img: gunBulletTrailImg,
  width: 10,
  height: 1,
}

export class GunBullet extends Entity {
  private bulletTrailAnimation = { durationMs: 225, progressMs: 0 }
  constructor (position: Point, vector: Vector, public fallOfTimeMs: number = 3000 ) {
		const onTrigger = (self: Entity, other: Entity, game: Game) => {
			const otherHitbox = other.calculateHitbox()
			const selfHitbox = self.calculateHitbox()
			const selfDirection = self.vector.x <= 0 ? 'left' : 'right'
			const hitOriginPos = selfDirection === 'left' ? { x: selfHitbox.x, y: selfHitbox.y } : { x: selfHitbox.x + selfHitbox.width, y: selfHitbox.y }
			const hitPosition = selfDirection === 'left' ? { x: hitOriginPos.x - otherHitbox.width, y: hitOriginPos.y } : { x: hitOriginPos.x + otherHitbox.width, y: hitOriginPos.y }

			self.addComponents(new Delete())
			other.addComponents(new Damage(20, hitPosition, selfDirection))

			const durationMs = 500
			const bloodSplatter = new BloodSplatter(hitPosition, selfDirection, durationMs)
			bloodSplatter.addComponents(new Delete(durationMs))

			game.marioSystem.entities.push(bloodSplatter)
		}

    super(
			position,
			{ width: gunBulletImgPresets.width * 5, height: gunBulletImgPresets.height * 5 },
			vector,
			[
				new Collidable(
					'playerAttack',
					['mob'],
					true,
					onTrigger,
				)
			]
		)
  }

	calculateHitbox(): { x: number; y: number; width: number; height: number } {
		const x = this.position.x
		const y = this.position.y
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

    const scaleXMultiplier = this.vector.x > 0 ? -1 : 1

    ctx.scale(scaleXMultiplier, 1)

    const bulletTrailPercentProgress =
      this.bulletTrailAnimation.progressMs > this.bulletTrailAnimation.durationMs
				? (this.bulletTrailAnimation.progressMs % this.bulletTrailAnimation.durationMs) /
				  this.bulletTrailAnimation.durationMs
				: this.bulletTrailAnimation.progressMs / this.bulletTrailAnimation.durationMs

		const bulletTrailAnimationStep = Math.floor(
			bulletTrailPercentProgress * gunBulletTrailPresets.sprites
		)

    ctx.drawImage(
			gunBulletTrailPresets.img,
			gunBulletTrailPresets.width * bulletTrailAnimationStep,
			0,
			gunBulletTrailPresets.width,
			gunBulletTrailPresets.height,
			scaleXMultiplier * (this.position.x + (this.vector.x > 0 ? -this.size.width : this.size.width)),
			this.position.y,
			this.size.width * (gunBulletTrailPresets.width / gunBulletImgPresets.width),
			this.size.height
		)

    ctx.drawImage(
			gunBulletImgPresets.img,
			0,
			0,
			gunBulletImgPresets.width,
			gunBulletImgPresets.height,
			scaleXMultiplier * this.position.x,
			this.position.y,
			this.size.width,
			this.size.height
		)

    ctx.restore()
    
		this.bulletTrailAnimation.progressMs += dt * 1000
    this.fallOfTimeMs -= dt * 1000
  }
}