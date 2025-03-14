import Game, { Input } from '../game'
import { Entity } from './Entity/Entity'
import { GunBullet } from './Entity/GunBullet'
import { Player } from './Entity/Player/Player'
import { Wall } from './Entity/Wall'
import { ZombieV1 } from './Entity/Zombie/ZombieV1'
import { ZombieV1Behavior } from './Entity/Zombie/ZombieV1Behavior'
import { CrawlerBehavior } from './Entity/Zombie/CrawlerBehavior'
import { CollisionSystem } from './System/CollisionSystem'
import { DeleteSystem } from './System/DeleteSystem'
import { GravitySystem } from './System/GravitySystem'
import { MoveSystem } from './System/MoveSystem'
import { PlayerSystem } from './System/PlayerSystem'
import { EffectSystem } from './System/EffectSystem'
import { Crawler } from './Entity/Zombie/Crawler'
import { LevelSetup } from './Levels/Level'

export class MarioSystem {
	public entities: Entity[] = []
	public player: Player | null = null
	public gravitySystem: GravitySystem = new GravitySystem()
	public collisionSystem: CollisionSystem = new CollisionSystem()
	public deleteSystem: DeleteSystem = new DeleteSystem()
	public moveSystem: MoveSystem = new MoveSystem()
	public playerSystem: PlayerSystem = new PlayerSystem()
	public effectSystem: EffectSystem = new EffectSystem()
	public zombieV1Behavior: ZombieV1Behavior = new ZombieV1Behavior()
	public crawlerBehavior: CrawlerBehavior = new CrawlerBehavior()

	constructor(readonly game: Game) {}

	setupLevel(levelSetup: LevelSetup) {
		// for (let i = 0; i < levelSetup.entities.length; i++) {
		// 	for (let j = 0; j < levelSetup.entities[i].length; j++) {
		// 		const gridBoxSize = {
		// 			width: levelSetup.width / levelSetup.entities[i].length,
		// 			height: levelSetup.height / levelSetup.entities.length,
		// 		}

		// 		const position = {
		// 			x: gridBoxSize.width * j,
		// 			y: gridBoxSize.height * i,
		// 		}

		// 		if (levelSetup.entities[i][j] === 0) continue

		// 		if (levelSetup.entities[i][j] === 99) {
		// 			this.player = new Player({
		// 				x: gridBoxSize.width * j,
		// 				y: gridBoxSize.height * i,
		// 			})
		// 		}

		// 		if (levelSetup.entities[i][j] === 1) {
		// 			let stop = false
		// 			let relativeX = 0
		// 			let relativeY = 0
		// 			let setRelativeX: number | null = null
		// 			let setRelativeY: number | null = null

		// 			while (stop === false) {
		// 				let addX = true

		// 				if (setRelativeX === null) {
		// 					for (let k = 0; k < relativeY + 1; k++) {
		// 						if (
		// 							!(
		// 								levelSetup.entities[i + k] &&
		// 								levelSetup.entities[i + k][j + relativeX + 1] === 1
		// 							)
		// 						) {
		// 							addX = false
		// 							break
		// 						}
		// 					}

		// 					// if (
		// 					// 	!(
		// 					// 		(
		// 					// 			levelSetup.entities[i + relativeY + 1] &&
		// 					// 			levelSetup.entities[i + relativeY + 1][
		// 					// 				j + relativeX + 1
		// 					// 			] === 1
		// 					// 		)
		// 					// 		// 	&&
		// 					// 		// relativeY === 0
		// 					// 	)
		// 					// ) {
		// 					// 	addX = false
		// 					// }
		// 				}

		// 				let addY = true

		// 				if (setRelativeY === null) {
		// 					for (let k = 0; k < relativeX + 1; k++) {
		// 						if (
		// 							!(
		// 								levelSetup.entities[i + relativeY + 1] &&
		// 								levelSetup.entities[i + relativeY + 1][j + k] === 1
		// 							)
		// 						) {
		// 							addY = false
		// 							break
		// 						}
		// 					}

		// 					// if (
		// 					// 	!(
		// 					// 		(
		// 					// 			levelSetup.entities[i + relativeY + 1] &&
		// 					// 			levelSetup.entities[i + relativeY + 1][
		// 					// 				j + relativeX + 1
		// 					// 			] === 1
		// 					// 		)
		// 					// 		// 	&&
		// 					// 		// relativeX === 0
		// 					// 	)
		// 					// ) {
		// 					// 	addY = false
		// 					// }
		// 				}

		// 				if (addX) {
		// 					relativeX++
		// 				} else {
		// 					setRelativeX = relativeX
		// 				}

		// 				if (addY) {
		// 					relativeY++
		// 				} else {
		// 					setRelativeY = relativeY
		// 				}

		// 				if (setRelativeY !== null && setRelativeX !== null) {
		// 					stop = true
		// 				}
		// 			}

		// 			if (setRelativeY === null || setRelativeX === null) continue // Would never happen

		// 			for (let k = 0; k < setRelativeY + 1; k++) {
		// 				for (let l = 0; l < setRelativeX + 1; l++) {
		// 					levelSetup.entities[i + k][j + l] = 0
		// 				}
		// 			}

		// 			this.entities.push(
		// 				new Wall(position, {
		// 					width: gridBoxSize.width * (setRelativeX + 1),
		// 					height: gridBoxSize.height * (setRelativeY + 1),
		// 				})
		// 			)
		// 		}
		// 	}
		// }

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
				
				if (levelSetup.entities[i][j] === 98) {
					this.entities.push(new ZombieV1({
						x: gridBoxSize.width * j,
						y: gridBoxSize.height * i,
					}))
				}
				
				if (levelSetup.entities[i][j] === 97) {
					this.entities.push(new Crawler({
						x: gridBoxSize.width * j,
						y: gridBoxSize.height * i,
					}))
				}

				if (levelSetup.entities[i][j] === 1) {
					this.entities.push(new Wall(position, gridBoxSize))
				}
			}
		}
	}

	update(dt: number) {
		// console.log(this.entities)
		if (this.player === null) return

		for (const system of [
			this.deleteSystem,
			this.playerSystem,
			this.zombieV1Behavior,
			this.crawlerBehavior,
			this.gravitySystem,
			this.effectSystem,
			this.moveSystem,
			this.collisionSystem,
		]) {
			const filteredEntities = [this.player, ...this.entities].filter(
				system.appliesTo
			)

			system.update(this.game, filteredEntities, dt)
		}

		this.entities = this.entities.filter((entity) => !(entity instanceof GunBullet) || entity instanceof GunBullet && entity.fallOfTimeMs > 0)
	}

	draw(mainCtx: CanvasRenderingContext2D, dt: number) {
		if (this.player === null) return

		const centerScreenX = this.game.gameWidth / 2
		const centerScreenY = this.game.gameHeight / 2

		for (const entity of [this.player, ...this.entities]) {
			mainCtx.translate(
				-(this.player.position.x - centerScreenX),
				-(this.player.position.y - centerScreenY)
			)
			entity.draw(mainCtx, dt)
			mainCtx.resetTransform()
		}
	}
}
