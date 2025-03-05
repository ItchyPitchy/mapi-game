import { MapScreen } from './Map/MapScreen'
import { PauseScreen } from './PauseScreen'
import { BattleSystem } from './BattleSystem/BattleSystem'
import { getDocumentElementById } from './shared/helperFunctions/element'
import { MarioSystem } from './MarioSystem/MarioSystem'

type GameState = 'MAP_SCREEN' | 'BATTLE_SCENE' | 'MARIO_GAME'

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
				hp: 60,
				maxHp: 60,
				stamina: 60,
				maxStamina: 60,
				strength: 1,
				intelligence: 1,
				dodgeChance: 0.1,
				hitRate: 0.9,
				speed: 2,
			},
		},
		{
			name: 'papi',
			lvl: 1,
			stats: {
				hp: 60,
				maxHp: 60,
				stamina: 60,
				maxStamina: 60,
				strength: 1,
				intelligence: 1,
				dodgeChance: 0.1,
				hitRate: 0.9,
				speed: 2,
			},
		},
	]
	public mapScreen = new MapScreen(this)
	public pauseScreen = new PauseScreen(this)
	public battleSystem = new BattleSystem(this)
	public marioSystem: MarioSystem
	public input = new Set<Input>()
	public state: GameState = 'MAP_SCREEN'
	public paused = false
	public visible = true

	constructor(
		public gameWidth: number,
		public gameHeight: number,
		readonly mainCtx: CanvasRenderingContext2D,
		public mousePos = { x: gameWidth / 2, y: gameHeight / 2 }
	) {
		const gameScreenEl = getDocumentElementById('gameScreen')

		this.marioSystem = new MarioSystem(this)

		window.addEventListener("resize", () => {
			this.gameHeight = gameScreenEl.clientHeight
			this.gameWidth = gameScreenEl.clientWidth
		})

		window.addEventListener("visibilitychange", () => {
			if (document.hidden) {
				this.visible = false
			} else {
				this.visible = true
			}
		})

		gameScreenEl.addEventListener('click', () => {
			this.input.add('leftClick')
		})

		document.addEventListener('keydown', (e) => {
			switch (e.key) {
				case 'Escape': {
					this.input.add('esc')
					this.paused = !this.paused
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
		gameScreenEl.addEventListener('mousemove', (e) => {
			this.mousePos = {
				x: e.offsetX,
				y: e.offsetY,
			}
		})

		this.start()
	}

	start() {}

	update(dt: number) {
		if (!this.visible) return
		
		if (this.paused) {
			this.pauseScreen.show()
			this.pauseScreen.update()
			this.clearInput()
			return
		} else {
			this.pauseScreen.hide()
		}

		switch (this.state) {
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
			case 'MARIO_GAME': {
				this.marioSystem.update(dt)
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

	draw(mainCtx: CanvasRenderingContext2D, dt: number) {
		switch (this.state) {
			case 'MAP_SCREEN': {
				this.mapScreen.draw(mainCtx)
				break
			}
			case 'BATTLE_SCENE': {
				this.battleSystem.draw(mainCtx, dt)
				break
			}
			case 'MARIO_GAME': {
				this.marioSystem.draw(mainCtx, dt)
				break
			}
		}
	}
}
