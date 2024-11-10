import { Point } from '../../../types'
import { Vector } from '../../../shared/Vector'
import { Entity } from '../Entity'

import bloodSplatterPng from '../../../assets/blood_splatter_v1-Sheet.png'

const bloodSplatterImg = new Image()
bloodSplatterImg.src = bloodSplatterPng
const bloodSplatterImgPresets = {
	sprites: 12,
	img: bloodSplatterImg,
  width: 46,
  height: 35,
}

export class BloodSplatter extends Entity {
  public progressMs = 0

	constructor(position: Point, public direction: 'left' | 'right', public durationMs: number, size = { height: bloodSplatterImgPresets.height * 2.1, width: bloodSplatterImgPresets.width * 2.1 }) {

		super(position, size, new Vector(0, 0))
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

		ctx.imageSmoothingEnabled = false

    let scaleXMultiplier = 1

		if (this.direction === 'left') scaleXMultiplier = -1
		if (this.direction === 'right') scaleXMultiplier = 1

		ctx.scale(scaleXMultiplier, 1)

    const animationProgress = this.progressMs > this.durationMs
        ? (this.progressMs % this.durationMs) /
          this.durationMs
        : this.progressMs / this.durationMs

    const animationStep = Math.floor(
      animationProgress * bloodSplatterImgPresets.sprites
    )

    ctx.drawImage(
      bloodSplatterImgPresets.img,
      bloodSplatterImgPresets.width * animationStep,
      0,
      bloodSplatterImgPresets.width,
      bloodSplatterImgPresets.height,
      scaleXMultiplier * this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    )

		ctx.restore()

    this.progressMs += dt * 1000
	}
}
