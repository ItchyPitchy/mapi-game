import Component from '../Component/Component'
import { Point } from '../types'

export type Constructor<T> = new (...args: any[]) => T

export default class Entity {
	public originPosition: Point
	public actionQueue: Point[] = []
	public degrees = 0
	protected components: Component[] = []

	constructor(
		public position: { x: number; y: number },
		public size: { width: number; height: number },
		optional?: {
			degrees?: number
		}
	) {
		this.originPosition = position

		if (optional?.degrees) this.degrees = optional.degrees
	}

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

	draw(ctx: CanvasRenderingContext2D) {
		throw new Error('Not implemented yet')
	}
}
