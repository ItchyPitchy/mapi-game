import Game, { Input } from '../game'
import { Entity } from './Entity/Entity'
import { Player } from './Entity/Player/Player'
import { Wall } from './Entity/Wall'
import { CollisionSystem } from './System/CollisionSystem'
import { GravitySystem } from './System/GravitySystem'
import { MoveSystem } from './System/MoveSystem'
import { PlayerSystem } from './System/PlayerSystem'

const moveInputs: Extract<Input, 'left' | 'right' | 'down' | 'up' | 's'>[] = [
	'left',
	'right',
	'down',
	'up',
	's',
]

export class MarioSystem {
	public entities: Entity[] = []
	public player: Player
	public gravitySystem: GravitySystem = new GravitySystem()
	public collisionSystem: CollisionSystem = new CollisionSystem()
	public moveSystem: MoveSystem = new MoveSystem()
	public playerSystem: PlayerSystem = new PlayerSystem()

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
		for (const system of [
			this.playerSystem,
			this.gravitySystem,
			this.moveSystem,
			this.collisionSystem,
		]) {
			const filteredEntities = [this.player, ...this.entities].filter(
				system.appliesTo
			)

			system.update(this.game, filteredEntities, dt)
		}
	}

	draw(mainCtx: CanvasRenderingContext2D) {
		if (this.player === null) return
		// this.player.draw({ ctx: mainCtx })
		for (const entity of [...this.entities, this.player]) {
			entity.draw(mainCtx)
		}
	}
}
