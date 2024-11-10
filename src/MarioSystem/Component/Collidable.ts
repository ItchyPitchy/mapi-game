import Game from '../../game'
import { Entity } from '../Entity/Entity'
import { Component } from './Component'

type CollisionGroup = 'wall' | 'mob' | 'player' | 'playerAttack' | 'cadaver'

export class Collidable extends Component {
	public collisionLeft: Array<{ entity: Entity, initialCollision: boolean }> = []
	public collisionRight: Array<{ entity: Entity, initialCollision: boolean }> = []
	public collisionTop: Array<{ entity: Entity, initialCollision: boolean }> = []
	public collisionBottom: Array<{ entity: Entity, initialCollision: boolean }> = []

	constructor(
		public collisionGroup: CollisionGroup,
		public collidesWith: CollisionGroup[] = [],
		public stationary: boolean = false,
		public onCollision: (self: Entity, other: Entity, game: Game) => void = () => {},
		public restitution: number = 0,
	) {
		super()
	}
}
