import Game from '../../game.js'
import { System } from './System.js'
import { Entity } from '../Entity/Entity.js'

export class MoveSystem extends System {
	constructor() {
		super()
	}

	appliesTo(entity: Entity) {
		return true
	}

	update(game: Game, entities: Entity[], dt: number) {
		for (const entity of entities) {
			const vector = entity.vector
			entity.position.x += vector.x * dt
			entity.position.y += vector.y * dt
		}
	}
}
