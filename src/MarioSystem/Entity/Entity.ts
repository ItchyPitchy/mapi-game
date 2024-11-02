import { Vector } from '../../shared/Vector'
import { Component } from '../Component/Component'

export type Constructor<T> = new (...args: any[]) => T

export class Entity {
	constructor(
		public position: { x: number; y: number },
		public size: { width: number; height: number },
		public vector: Vector = new Vector(0, 0),
		public components: Component[] = []
	) {}

	distanceTo(entity: Entity) {
		return Math.sqrt(
			Math.pow(this.position.x - entity.position.x, 2) +
				Math.pow(this.position.y - entity.position.y, 2)
		)
	}

	getComponent<T>(type: Constructor<T>): T {
		for (const component of this.components) {
			if (component instanceof type) {
				return component
			}
		}

		throw new Error(
			`Failed to get component type ${type}. Please run hasComponent first!`
		)
	}

	addComponents(...components: Component[]) {
		for (const component of components) {
			this.components.push(component)
		}
	}

	hasComponent<T extends Component>(type: T) {
		for (const component of this.components) {
			// @ts-ignore
			if (component instanceof type) {
				return true
			}
		}

		return false
	}

	removeComponent<T extends Component>(type: T) {
		this.components = this.components.filter(
			// @ts-ignore
			(component) => component instanceof type
		)
	}

	calculateHitbox(): { x: number; y: number; width: number; height: number } {
		throw new Error('#calculateHitbox not implemented yet')
	}

	draw(ctx: CanvasRenderingContext2D, dt: number) {
		throw new Error('#draw not implemented yet')
	}
}
