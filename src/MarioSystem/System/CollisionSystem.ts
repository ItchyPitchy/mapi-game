import Game from '../../game.js'
import { System } from './System.js'
import { Entity } from '../Entity/Entity.js'
import { Collidable } from '../Component/Collidable.js'
import { Gravitational } from '../Component/Gravitational.js'
import { Player } from '../Entity/Player.js'

export class CollisionSystem extends System {
	constructor() {
		super()
	}

	appliesTo(entity: Entity) {
		return entity.hasComponent(Collidable)
	}

	update(game: Game, entities: Entity[], dt: number) {
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
					}
					// right
					else {
						console.log('right')
						const xDiff =
							entity1HitBox.x - entity2HitBox.x + entity1HitBox.width
						entity2.position.x += xDiff
					}
				} else {
					// top
					if (dy < 0) {
						console.log('top')
						const yDiff =
							entity1HitBox.y - entity2HitBox.height - entity2HitBox.y
						entity2.position.y += yDiff
						entity2.vector.y = 0
					}
					// bottom
					else {
						const yDiff =
							entity1HitBox.y + entity1HitBox.height - entity2HitBox.y
						console.log('bottom')
						entity2.position.y += yDiff
					}
				}
			}
		}

		// for (const entity1 of entities) {
		// 	for (const entity2 of entities) {
		// 		if (entity1 === entity2) continue

		// 		const entity1HitBox1 = entity1.calculateHitbox()
		// 		const entity2HitBox1 = entity2.calculateHitbox()

		// 		const entity1CenterX1 = entity1HitBox1.x + entity1HitBox1.width / 2
		// 		const entity1CenterY1 = entity1HitBox1.y + entity1HitBox1.height / 2

		// 		const entity2CenterX1 = entity2HitBox1.x + entity2HitBox1.width / 2
		// 		const entity2CenterY1 = entity2HitBox1.y + entity2HitBox1.height / 2

		// 		const distanceToCentersX1 = Math.abs(entity1CenterX1 - entity2CenterX1)
		// 		const distanceToCentersY1 = Math.abs(entity1CenterY1 - entity2CenterY1)

		// 		// Is colliding
		// 		if (
		// 			distanceToCentersX1 <=
		// 				entity1HitBox1.width / 2 + entity2HitBox1.width / 2 &&
		// 			distanceToCentersY1 <=
		// 				entity1HitBox1.height / 2 + entity2HitBox1.height / 2
		// 		) {
		// 			// console.log('COLLISION!!!')

		// 			entity1.position.y -= entity1.vector.y * dt
		// 			entity2.position.y -= entity2.vector.y * dt

		// 			// const entity1HitBox2 = entity1.calculateHitbox()
		// 			// const entity2HitBox2 = entity2.calculateHitbox()

		// 			// const entity1CenterX2 = entity1HitBox2.x + entity1HitBox2.width / 2
		// 			// const entity1CenterY2 = entity1HitBox2.y + entity1HitBox2.height / 2

		// 			// const entity2CenterX2 = entity2HitBox2.x + entity2HitBox2.width / 2
		// 			// const entity2CenterY2 = entity2HitBox2.y + entity2HitBox2.height / 2

		// 			// const distanceToCentersX2 = Math.abs(
		// 			// 	entity1CenterX2 - entity2CenterX2
		// 			// )
		// 			// const distanceToCentersY2 = Math.abs(
		// 			// 	entity1CenterY2 - entity2CenterY2
		// 			// )

		// 			// if (
		// 			// 	distanceToCentersX2 <
		// 			// 		entity1HitBox2.width / 2 + entity2HitBox2.width / 2 &&
		// 			// 	distanceToCentersY2 <
		// 			// 		entity1HitBox2.height / 2 + entity2HitBox2.height / 2
		// 			// ) {
		// 			// 	entity1.position.x -= entity1.vector.x * dt
		// 			// 	entity2.position.x -= entity2.vector.x * dt
		// 			// }
		// 		}
		// 	}
		// }
	}
}
