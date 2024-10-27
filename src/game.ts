import { MapScreen } from './Map/MapScreen'
import { PauseScreen } from './PauseScreen'
import { BattleSystem } from './BattleSystem/BattleSystem'
import { getDocumentElementById } from './shared/helperFunctions/element'
import { MarioSystem } from './MarioSystem/MarioSystem'

type GameState = 'PAUSE_SCREEN' | 'RUNNING' | 'MAP_SCREEN' | 'BATTLE_SCENE'

export type Input =
	| 'leftClick'
	| 'up'
	| 'left'
	| 'down'
	| 'right'
	| 'esc'
	| 'enter'
	| 's'

type Player = {
	name: 'mami' | 'papi'
	lvl: number
	stats: Stats
}

export default class Game {
	public players: Player[] = [
		{
			name: 'mami',
			lvl: 1,
			stats: {
				maxHp: 60,
				maxStamina: 60,
				strength: 1,
				intelligence: 1,
				dodgeChance: 0.1,
				hitRate: 0.9,
			},
		},
		{
			name: 'papi',
			lvl: 1,
			stats: {
				maxHp: 60,
				maxStamina: 60,
				strength: 1,
				intelligence: 1,
				dodgeChance: 0.1,
				hitRate: 0.9,
			},
		},
	]
	public mapScreen = new MapScreen(this)
	public pauseScreen = new PauseScreen(this)
	public battleSystem = new BattleSystem(this)
	public marioSystem: MarioSystem
	// entities: Entity[] = []
	public input = new Set<Input>()
	public state: GameState = 'RUNNING'

	constructor(
		readonly gameWidth: number,
		readonly gameHeight: number,
		readonly mainCtx: CanvasRenderingContext2D,
		public mousePos = { x: gameWidth / 2, y: gameHeight / 2 }
	) {
		const gameScreenEl = getDocumentElementById('gameScreen')

		this.marioSystem = new MarioSystem(this)

		gameScreenEl.addEventListener('click', () => {
			this.input.add('leftClick')
		})

		document.addEventListener('keydown', (e) => {
			console.log(e.key)
			switch (e.key) {
				case 'Escape': {
					this.input.add('esc')
					break
				}
				case 'ArrowUp': {
					this.input.add('up')
					break
				}
				case 'ArrowLeft': {
					this.input.add('left')
					break
				}
				case 'ArrowDown': {
					this.input.add('down')
					break
				}
				case 'ArrowRight': {
					this.input.add('right')
					break
				}
				case 's': {
					this.input.add('s')
					break
				}
				case 'Enter': {
					this.input.add('enter')
					break
				}
			}
		})

		document.addEventListener('keyup', (e) => {
			switch (e.key) {
				case 'Escape': {
					this.input.delete('esc')
					break
				}
				case 'ArrowUp': {
					this.input.delete('up')
					break
				}
				case 'ArrowLeft': {
					this.input.delete('left')
					break
				}
				case 'ArrowDown': {
					this.input.delete('down')
					break
				}
				case 'ArrowRight': {
					this.input.delete('right')
					break
				}
				case 'Enter': {
					this.input.delete('enter')
					break
				}
				case 's': {
					this.input.delete('s')
					break
				}
			}
		})
		// gameScreenEl.addEventListener('mousemove', (e) => {
		// 	this.mousePos = {
		// 		x: e.offsetX,
		// 		y: e.offsetY,
		// 	}
		// })

		this.start()
	}

	start() {}

	update(dt: number) {
		this.marioSystem.update(dt)
		return

		switch (this.state) {
			case 'PAUSE_SCREEN': {
				this.pauseScreen.update()
				this.clearInput()
				break
			}
			case 'MAP_SCREEN': {
				this.mapScreen.update(dt)
				this.clearInput()
				break
			}
			case 'BATTLE_SCENE': {
				this.battleSystem.update(dt)
				this.clearInput()
				break
			}
			case 'RUNNING': {
				this.input.forEach((input) => {
					switch (input) {
						case 'esc': {
							this.state = 'PAUSE_SCREEN'
							this.pauseScreen.show()
							break
						}
					}
				})
				this.clearInput()
				break
			}
			default: {
				this.clearInput()
				break
			}
		}
	}

	clearInput() {
		this.input.clear()
	}

	draw(mainCtx: CanvasRenderingContext2D) {
		this.marioSystem.draw(mainCtx)
		return

		switch (this.state) {
			case 'MAP_SCREEN': {
				this.mapScreen.draw(mainCtx)
				break
			}
			case 'BATTLE_SCENE': {
				this.battleSystem.draw(mainCtx)
				break
			}
		}
	}
}
