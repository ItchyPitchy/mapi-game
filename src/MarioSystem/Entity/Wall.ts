import { Point, Size } from '../../types'
import { Collidable } from '../Component/Collidable'
import { Entity } from './Entity'

import wallTexture1Png from '../../assets/wall_texture_1.png'

const wallTextureImg = new Image()
wallTextureImg.src = wallTexture1Png

const wallTexturePresets = {
	img: wallTextureImg,
	width: 20,
	height: 20,
}

export class Wall extends Entity {
	constructor(position: Point, size: Size) {
		super({ x: position.x - 0.5, y: position.y - 0.5 }, { width: size.width + 1, height: size.height + 1})

		this.addComponents(new Collidable('wall', [], true))
	}

	calculateHitbox(): { x: number; y: number; width: number; height: number } {
		const x = this.position.x
		const y = this.position.y
		const width = this.size.width
		const height = this.size.height

		return { x, y, width, height }
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.save()

		ctx.imageSmoothingEnabled = false
		const pattern = ctx.createPattern(wallTexturePresets.img, 'repeat')

		if (pattern !== null) ctx.fillStyle = pattern
		
		// ctx.fillRect(
		// 	this.position.x,
		// 	this.position.y,
		// 	this.size.width,
		// 	this.size.height
		// )
		ctx.drawImage(
			wallTexturePresets.img,
			0,
			0,
			wallTexturePresets.width,
			wallTexturePresets.height,
			this.position.x,
			this.position.y,
			this.size.width,
			this.size.height
		)

		// ctx.fillStyle = 'black'
		// ctx.fillRect(
		// 	this.position.x,
		// 	this.position.y,
		// 	this.size.width,
		// 	this.size.height
		// )

		// ctx.fillStyle = 'orange'
		// ctx.strokeRect(
		// 	this.position.x,
		// 	this.position.y,
		// 	this.size.width,
		// 	this.size.height
		// )
		// ctx.stroke()

		// const hitbox = this.calculateHitbox()

		// ctx.strokeStyle = 'yellow'
		// ctx.strokeRect(
		// 	hitbox.x + 1,
		// 	hitbox.y + 1,
		// 	hitbox.width - 2,
		// 	hitbox.height - 2
		// )
		// ctx.stroke()

		ctx.restore()
	}
}
