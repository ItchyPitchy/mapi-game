import Game from '../../game.js'
import { System } from './System.js'
import { Entity } from '../Entity/Entity.js'
import { Delete } from '../Component/Delete.js'

export class DeleteSystem extends System {
	constructor() {
		super()
	}

	appliesTo(entity: Entity) {
		return entity.hasComponent(Delete)
	}

	update(game: Game, entities: Entity[], dt: number) {
		for (const entity of entities) {
      if (!entity.hasComponent(Delete)) throw new Error('#appliesTo not called before update')
      
			const component = entity.getComponent(Delete)

			component.countdown -= dt * 1000

      if (component.countdown <= 0) {
        game.marioSystem.entities.splice(game.marioSystem.entities.indexOf(entity), 1)
      }
		}
	}
}
