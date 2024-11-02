import { Point } from '../../types'
import { Vector } from '../../shared/Vector'
import { Entity } from './Entity'

import gunBulletPng from '../../assets/gun_bullet.png'
import gunBulletTrailPng from '../../assets/gun_bullet_trail-Sheet.png'

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
    super(position, { width: gunBulletImgPresets.width * 5, height: gunBulletImgPresets.height * 5 }, vector)
  }

  draw(ctx: CanvasRenderingContext2D, dt: number) {
    ctx.save()

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

    this.bulletTrailAnimation.progressMs += dt * 1000
    this.fallOfTimeMs -= dt * 1000
    ctx.restore()
  }
}