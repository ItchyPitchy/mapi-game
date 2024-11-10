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
		const collisions: Array<{ entity: Entity } & Record<'collisionBottom' | 'collisionTop' |'collisionLeft' | 'collisionRight', Array<{ entity: Entity, initialCollision: boolean }>>> =
			entities.map((entity) => ({ entity, collisionBottom: [], collisionLeft: [], collisionRight: [], collisionTop: [] }))

		for (const entity1 of entities) {
			for (const entity2 of entities) {
				if (!entity1.hasComponent(Collidable) || !entity2.hasComponent(Collidable)) throw new Error('#appliesTo not called before update')
					
				if (entity1 === entity2) continue

				if (
					!entity2.getComponent(Collidable).collidesWith.some((collisionGroup) =>
						collisionGroup === entity1.getComponent(Collidable).collisionGroup
				)) continue

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

				const entity1Collidable = entity1.getComponent(Collidable)
				const entity2Collidable = entity2.getComponent(Collidable)

				// entity2Collidable.onCollision(entity2, entity1)

				const entity1CollisionIndex = collisions.findIndex((collision) => collision.entity === entity1)

				if (entity1CollisionIndex === -1) throw new Error('Collision data not found')

				const entity2CollisionIndex = collisions.findIndex((collision) => collision.entity === entity2)

				if (entity2CollisionIndex === -1) throw new Error('Collision data not found')

				/* To determine which region of this rectangle the rect's center
				point is in, we have to account for the scale of the this rectangle.
				To do that, we divide dx and dy by it's width and height respectively. */
				if (
					Math.abs(dx / entity1HitBox.width) >
					Math.abs(dy / entity1HitBox.height)
				) {
					// left
					if (dx < 0) {
						// console.log('left')
						const entity1InitialCollisionIndex = entity1Collidable.collisionLeft.findIndex((collision) => collision.entity === entity2)
						const entity1IsInitialCollision = entity1InitialCollisionIndex === -1 ? true : false
						const collisionEntity1Index = collisions.findIndex((collision) => collision.entity === entity1)

						collisions[collisionEntity1Index].collisionLeft.push({ entity: entity2, initialCollision: entity1IsInitialCollision })

						const entity2InitialCollisionIndex = entity2Collidable.collisionRight.findIndex((collision) => collision.entity === entity1)
						const entity2IsInitialCollision = entity2InitialCollisionIndex === -1 ? true : false
						const collisionEntity2Index = collisions.findIndex((collision) => collision.entity === entity2)

						collisions[collisionEntity2Index].collisionRight.push({ entity: entity1, initialCollision: entity2IsInitialCollision })

						if (entity2.getComponent(Collidable).stationary) continue

						const xDiff =
							entity1HitBox.x - entity2HitBox.x - entity2HitBox.width
						entity2.position.x += xDiff
					}
					// right
					else {
						// console.log('right')
						const entity1InitialCollisionIndex = entity1Collidable.collisionRight.findIndex((collision) => collision.entity === entity2)
						const entity1IsInitialCollision = entity1InitialCollisionIndex === -1 ? true : false
						const collisionEntity1Index = collisions.findIndex((collision) => collision.entity === entity1)

						collisions[collisionEntity1Index].collisionRight.push({ entity: entity2, initialCollision: entity1IsInitialCollision })

						const entity2InitialCollisionIndex = entity2Collidable.collisionLeft.findIndex((collision) => collision.entity === entity1)
						const entity2IsInitialCollision = entity2InitialCollisionIndex === -1 ? true : false
						const collisionEntity2Index = collisions.findIndex((collision) => collision.entity === entity2)

						collisions[collisionEntity2Index].collisionLeft.push({ entity: entity1, initialCollision: entity2IsInitialCollision })

						if (entity2.getComponent(Collidable).stationary) continue

						const xDiff =
							entity1HitBox.x - entity2HitBox.x + entity1HitBox.width
						entity2.position.x += xDiff
					}
				} else {
					// top
					if (dy < 0) {
						// console.log('top')
						const entity1InitialCollisionIndex = entity1Collidable.collisionTop.findIndex((collision) => collision.entity === entity2)
						const entity1IsInitialCollision = entity1InitialCollisionIndex === -1 ? true : false
						const collisionEntity1Index = collisions.findIndex((collision) => collision.entity === entity1)

						collisions[collisionEntity1Index].collisionTop.push({ entity: entity2, initialCollision: entity1IsInitialCollision })

						const entity2InitialCollisionIndex = entity2Collidable.collisionBottom.findIndex((collision) => collision.entity === entity1)
						const entity2IsInitialCollision = entity2InitialCollisionIndex === -1 ? true : false
						const collisionEntity2Index = collisions.findIndex((collision) => collision.entity === entity2)

						collisions[collisionEntity2Index].collisionBottom.push({ entity: entity1, initialCollision: entity2IsInitialCollision })

						if (entity2.getComponent(Collidable).stationary) continue

						const yDiff =
							entity1HitBox.y - entity2HitBox.height - entity2HitBox.y
						entity2.position.y += yDiff
					}
					// bottom
					else {
						// console.log('bottom')
						const entity1InitialCollisionIndex = entity1Collidable.collisionBottom.findIndex((collision) => collision.entity === entity2)
						const entity1IsInitialCollision = entity1InitialCollisionIndex === -1 ? true : false
						const collisionEntity1Index = collisions.findIndex((collision) => collision.entity === entity1)

						collisions[collisionEntity1Index].collisionBottom.push({ entity: entity2, initialCollision: entity1IsInitialCollision })

						const entity2InitialCollisionIndex = entity2Collidable.collisionTop.findIndex((collision) => collision.entity === entity1)
						const entity2IsInitialCollision = entity2InitialCollisionIndex === -1 ? true : false
						const collisionEntity2Index = collisions.findIndex((collision) => collision.entity === entity2)

						collisions[collisionEntity2Index].collisionTop.push({ entity: entity1, initialCollision: entity2IsInitialCollision })

						if (entity2.getComponent(Collidable).stationary) continue

						const yDiff =
							entity1HitBox.y + entity1HitBox.height - entity2HitBox.y
						entity2.position.y += yDiff
					}
				}
			}
		}

		for (const entity of entities) {
			const entityCollisionIndex = collisions.findIndex((collision) => collision.entity === entity)

			if (entityCollisionIndex === -1) throw new Error('Collision data not found')

			const entityCollisionData = collisions[entityCollisionIndex]

			const entityCollidable = entity.getComponent(Collidable)

			entityCollidable.collisionBottom = entityCollisionData.collisionBottom
			entityCollidable.collisionTop = entityCollisionData.collisionTop
			entityCollidable.collisionLeft = entityCollisionData.collisionLeft
			entityCollidable.collisionRight = entityCollisionData.collisionRight
		}
		
		for (const entity of entities) {
			const entityCollidable = entity.getComponent(Collidable);

			[
				...entityCollidable.collisionBottom,
				...entityCollidable.collisionTop,
				...entityCollidable.collisionLeft,
				...entityCollidable.collisionRight
			]
				.filter((collision) => collision.initialCollision)
				.forEach((collision) => entityCollidable.onCollision(entity, collision.entity, game))
		}
	}
}
