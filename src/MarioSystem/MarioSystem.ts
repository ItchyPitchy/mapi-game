import Game, { Input } from '../game'
import { Entity } from './Entity/Entity'
import { Player } from './Entity/Player'
import { Wall } from './Entity/Wall'
import { CollisionSystem } from './System/CollisionSystem'
import { GravitySystem } from './System/GravitySystem'
import { MoveSystem } from './System/MoveSystem'
import { System } from './System/System'

const moveInputs: Extract<Input, 'left' | 'right' | 'down' | 'up' | 's'>[] = [
	'left',
	'right',
	'down',
	'up',
	's',
]

export class MarioSystem {
	public entities: Entity[] = []
	public player: Player | null
	public gravitySystem: GravitySystem = new GravitySystem()
	public collisionSystem: CollisionSystem = new CollisionSystem()
	public moveSystem: MoveSystem = new MoveSystem()

	constructor(readonly game: Game) {
		this.player = new Player({ x: game.gameWidth / 2, y: game.gameHeight / 2 })

		const levelSetup: {
			entities: (0 | 1 | 99)[][]
			height: number
			width: number
		} = {
			height: game.gameHeight,
			width: game.gameWidth,
			entities: [
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 0, 0, 0, 0, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				// [1, 1, 1],
				// [1, 0, 0],
				// // [1, 0, 0],
				// // [1, 0, 0],
				// // [1, 0, 0],
				// // [1, 0, 0],
				// [1, 0, 99],
				// [1, 1, 1],
			],
		}

		this.setupLevel(levelSetup)
	}

	setupLevel(levelSetup: {
		entities: (0 | 1 | 99)[][]
		height: number
		width: number
	}) {
		let span: {
			start: { x: number; y: number } | null
			width: number
			height: number
		} = {
			start: null,
			width: 0,
			height: 0,
		}

		for (let i = 0; i < levelSetup.entities.length; i++) {
			for (let j = 0; j < levelSetup.entities[i].length; j++) {
				const gridBoxSize = {
					width: levelSetup.width / levelSetup.entities[i].length,
					height: levelSetup.height / levelSetup.entities.length,
				}

				const position = {
					x: gridBoxSize.width * j,
					y: gridBoxSize.height * i,
				}

				if (levelSetup.entities[i][j] === 0) continue

				if (levelSetup.entities[i][j] === 99) {
					this.player = new Player({
						x: gridBoxSize.width * j,
						y: gridBoxSize.height * i,
					})
				}

				if (levelSetup.entities[i][j] === 1) {
					if (span.start === null) {
						span.start = { x: position.x, y: position.y }
					}

					if (
						levelSetup.entities[i + 1] &&
						levelSetup.entities[i + 1][j] === 1
					) {
						let useContinue = false

						for (let k = 0; k < levelSetup.entities.length - i; k++) {
							if (
								!levelSetup.entities[i + k + 1] ||
								levelSetup.entities[i + k + 1][j] !== 1
							) {
								span.width = gridBoxSize.width
								span.height += gridBoxSize.height
								levelSetup.entities[i + k][j] = 0
								this.entities.push(
									new Wall(span.start, {
										width: span.width,
										height: span.height,
									})
								)
								span = {
									start: null,
									width: 0,
									height: 0,
								}
								useContinue = true
								break
							} else if (levelSetup.entities[i + k][j] === 1) {
								span.width = gridBoxSize.width
								span.height += gridBoxSize.height
								levelSetup.entities[i + k][j] = 0
							} else {
								console.error('AKJSDKJASNDKJN')
							}
						}

						if (useContinue) {
							continue
						}
					} else if (levelSetup.entities[i][j + 1] === 1) {
						span.width += gridBoxSize.width
						span.height = gridBoxSize.height
						levelSetup.entities[i][j] = 0
						continue
					} else {
						span.width += gridBoxSize.width
						span.height = gridBoxSize.height
						levelSetup.entities[i][j] = 0
						this.entities.push(
							new Wall(span.start, { width: span.width, height: span.height })
						)
						span = {
							start: null,
							width: 0,
							height: 0,
						}
						continue
					}
				}
			}
		}
	}

	update(dt: number) {
		// console.log(this.entities)
		const actions: Array<'move' | 'sheath' | 'duck' | 'jump'> = []

		// if (this.player.position.y >= this.game.gameHeight / 2) {
		// 	this.player.vector.y = 0
		// 	this.player.isJumping = false
		// } else {
		// 	this.player.vector.y += 1000 * dt
		// }

		if (this.player === null) return

		if (!this.game.input.has('left') && !this.game.input.has('right')) {
			this.player.vector.x = 0
		}

		if (moveInputs.some((input) => this.game.input.has(input))) {
			for (const input of this.game.input) {
				switch (input) {
					case 'left': {
						const velocity =
							this.player.action.sheath.state === 'in-use' ||
							!this.player.isSheathed
								? 150
								: 500
						this.player.vector.x = -velocity
						actions.push('move')
						break
					}
					case 'right': {
						const velocity =
							this.player.action.sheath.state === 'in-use' ||
							!this.player.isSheathed
								? 150
								: 500
						this.player.vector.x = velocity
						actions.push('move')
						break
					}
					case 'down': {
						actions.push('duck')
						break
					}
					case 'up': {
						actions.push('sheath')
						break
					}
					case 's': {
						actions.push('jump')
						break
					}
				}
			}
		}

		this.player.update(dt, actions)

		for (const system of [
			this.gravitySystem,
			this.moveSystem,
			this.collisionSystem,
		]) {
			const filteredEntities = [this.player, ...this.entities].filter(
				(entity) => system.appliesTo(entity)
			)

			// console.log('filteredEntities', filteredEntities)

			system.update(this.game, filteredEntities, dt)
		}

		// for (const system of [
		// 	// this.collisionSystem,
		// 	this.gravitySystem,
		// 	// this.moveSystem,
		// ]) {
		// 	const filteredEntities = [this.player, ...this.entities].filter(
		// 		(entity) => system.appliesTo(entity)
		// 	)

		// 	// console.log('filteredEntities', filteredEntities)

		// 	system.update(this.game, filteredEntities, dt)
		// }

		// for (const system of [
		// 	// this.collisionSystem,
		// 	// this.gravitySystem,
		// 	this.moveSystem,
		// ]) {
		// 	const filteredEntities = [this.player, ...this.entities].filter(
		// 		(entity) => system.appliesTo(entity)
		// 	)

		// 	// console.log('filteredEntities', filteredEntities)

		// 	system.update(this.game, filteredEntities, dt)
		// }
	}

	draw(mainCtx: CanvasRenderingContext2D) {
		if (this.player === null) return
		// this.player.draw({ ctx: mainCtx })
		for (const entity of [...this.entities, this.player]) {
			entity.draw(mainCtx)
		}
	}
}

export function detectCollision(entity1: Entity, entity2: Entity) {
	// const entity1CenterX = entity1.position.x + entity1.size.width / 2
	// const entity1CenterY = entity1.position.y + entity1.size.height / 2
	// const entity2CenterX = entity2.position.x + entity2.size.width / 2
	// const entity2CenterY = entity2.position.y + entity2.size.height / 2
	// const distanceToCentersX = Math.abs(entity1CenterX - entity2CenterX)
	// const distanceToCentersY = Math.abs(entity1CenterY - entity2CenterY)
	// // Is colliding
	// if (
	// 	distanceToCentersX <= entity1.size.width / 2 + entity2.size.width / 2 &&
	// 	distanceToCentersY <= entity1.size.height / 2 + entity2.size.height / 2
	// ) {
	// 	entity1.position.x -= entity1.vector.x * dt
	// 	entity1.position.y -= entity1.vector.y * dt
	// 	entity2.position.x -= entity2.vector.x * dt
	// 	entity2.position.y -= entity2.vector.y * dt
	// }
	// const topEntity1 = entity1.position.y
	// const leftEntity1 = entity1.position.x
	// const rightEntity1 = entity1.position.x + entity1.size.width
	// const bottomEntity1 = entity1.position.y + entity1.size.height
	// const topEntity2 = entity2.position.y
	// const leftEntity2 = entity2.position.x
	// const rightEntity2 = entity2.position.x + entity2.size.width
	// const bottomEntity2 = entity2.position.y + entity2.size.height
	// if (topEntity1 >= topEntity2 && topEntity1 <= bottomEntity2)
	// 	if (
	// 		topEntity1 <= bottomEntity2 &&
	// 		topEntity2 <= bottomEntity1 &&
	// 		rightEntity1 <= leftEntity2 &&
	// 		rightEntity2 <= leftEntity1
	// 	)
	// 		if (
	// 			bottoBall >= topOfObject &&
	// 			topOfBall <= bottomOfObject &&
	// 			ball.position.x + ball.size >= leftSideOfObject &&
	// 			ball.position.x <= rightSideOfObject
	// 		) {
	// 			//collision with paddle
	// 			return true
	// 		} else {
	// 			return false
	// 		}
}
