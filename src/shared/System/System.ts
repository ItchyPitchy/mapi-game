import Game from '../../game'
import Entity from '../Entity'

export class System {
	appliesTo(entity: Entity) {
		return false
	}

	update(game: Game, entities: Entity[], dt: number) {
		throw new Error('not implemented')
	}

	draw(ctx: CanvasRenderingContext2D) {}
}
