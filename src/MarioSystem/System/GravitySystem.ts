import Game from '../../game.js'
import { System } from './System.js'
import { Entity } from '../Entity/Entity.js'
import { Gravitational } from '../Component/Gravitational.js'

export class GravitySystem extends System {
	constructor() {
		super()
	}

	appliesTo(entity: Entity) {
		return entity.hasComponent(Gravitational)
	}

	update(game: Game, entities: Entity[], dt: number) {
		for (const entity of entities) {
			const pull = entity.getComponent(Gravitational).pull
			entity.vector.y += pull * dt
		}
	}
}
