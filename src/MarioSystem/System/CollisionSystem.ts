import Game from '../../game.js'
import { System } from './System.js'
import { Entity } from '../Entity/Entity.js'
import { Collidable } from '../Component/Collidable.js'

export class CollisionSystem extends System {
	constructor() {
		super()
	}

	appliesTo(entity: Entity) {
		return entity.hasComponent(Collidable)
	}

	update(game: Game, entities: Entity[], dt: number) {
		for (const entity of entities) {
			entity.getComponent(Collidable).initialCollisionLeft = false
			entity.getComponent(Collidable).initialCollisionRight = false
			entity.getComponent(Collidable).initialCollisionTop = false
			entity.getComponent(Collidable).initialCollisionBottom = false
		}

		const collision: Record<'bottom' |'top' | 'left' | 'right', Entity[]> = {
			bottom: [],
			top: [],
			left: [],
			right: [],
		}

		for (const entity1 of entities) {
			for (const entity2 of entities) {
				if (entity1 === entity2) continue
				if (entity2.getComponent(Collidable).stationary) continue

				const entity1HitBox = entity1.calculateHitbox()
				const entity2HitBox = entity2.calculateHitbox()

				const entity1CenterX = entity1HitBox.x + entity1HitBox.width * 0.5
				const entity1CenterY = entity1HitBox.y + entity1HitBox.height * 0.5

				const entity2CenterX = entity2HitBox.x + entity2HitBox.width * 0.5
				const entity2CenterY = entity2HitBox.y + entity2HitBox.height * 0.5

				const dx = entity2CenterX - entity1CenterX // x difference between centers
				const dy = entity2CenterY - entity1CenterY // y difference between centers
				const aw = (entity2HitBox.width + entity1HitBox.width) * 0.5 // average width
				const ah = (entity2HitBox.height + entity1HitBox.height) * 0.5 // average height

				/* If either distance is greater than the average dimension there is no collision. */
				if (Math.abs(dx) > aw || Math.abs(dy) > ah) continue

				/* To determine which region of this rectangle the rect's center
				point is in, we have to account for the scale of the this rectangle.
				To do that, we divide dx and dy by it's width and height respectively. */
				if (
					Math.abs(dx / entity1HitBox.width) >
					Math.abs(dy / entity1HitBox.height)
				) {
					// left
					if (dx < 0) {
						console.log('left')
						const xDiff =
							entity1HitBox.x - entity2HitBox.x - entity2HitBox.width
						entity2.position.x += xDiff
						collision.left.push(entity1)
						collision.right.push(entity2)
					}
					// right
					else {
						console.log('right')
						const xDiff =
							entity1HitBox.x - entity2HitBox.x + entity1HitBox.width
						entity2.position.x += xDiff
						collision.right.push(entity1)
						collision.left.push(entity2)
					}
				} else {
					// top
					if (dy < 0) {
						console.log('top')
						const yDiff =
							entity1HitBox.y - entity2HitBox.height - entity2HitBox.y
						entity2.position.y += yDiff
						collision.top.push(entity1)
						collision.bottom.push(entity2)
					}
					// bottom
					else {
						const yDiff =
							entity1HitBox.y + entity1HitBox.height - entity2HitBox.y
						console.log('bottom')
						entity2.position.y += yDiff
						collision.bottom.push(entity1)
						collision.top.push(entity2)
					}
				}
			}
		}

		collision.bottom.forEach((entity) => {
			const collidable = entity.getComponent(Collidable)
			if (!collidable.collisionBottom) {
				collidable.initialCollisionBottom = true
			}
		})
		collision.top.forEach((entity) => {
			const collidable = entity.getComponent(Collidable)
			if (!collidable.collisionTop) {
				collidable.initialCollisionTop = true
			}
		})
		collision.left.forEach((entity) => {
			const collidable = entity.getComponent(Collidable)
			if (!collidable.collisionLeft) {
				collidable.initialCollisionLeft = true
			}
		})
		collision.right.forEach((entity) => {
			const collidable = entity.getComponent(Collidable)
			if (!collidable.collisionRight) {
				collidable.initialCollisionRight = true
			}
		})

		for (const entity of entities) {
			entity.getComponent(Collidable).collisionLeft = false
			entity.getComponent(Collidable).collisionRight = false
			entity.getComponent(Collidable).collisionTop = false
			entity.getComponent(Collidable).collisionBottom = false
		}

		collision.bottom.forEach((entity) => {
			entity.getComponent(Collidable).collisionBottom = true
		})
		collision.top.forEach((entity) => {
			entity.getComponent(Collidable).collisionTop = true
		})
		collision.left.forEach((entity) => {
			entity.getComponent(Collidable).collisionLeft = true
		})
		collision.right.forEach((entity) => {
			entity.getComponent(Collidable).collisionRight = true
		})
	}
}
