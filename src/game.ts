import { BattleScene } from './BattleScene'
import Entity from './Entity/Entity'
import Mami from './Entity/Mami'
import Papi from './Entity/Papi'
import { MapScreen } from './MapScreen'
import { PauseScreen } from './PauseScreen'
import { getDocumentElementById } from './helperFunctions'

type GameState = 'PAUSE_SCREEN' | 'RUNNING' | 'MAP_SCREEN' | 'BATTLE_SCENE'

export type Input =
	| 'leftClick'
	| 'up'
	| 'left'
	| 'down'
	| 'right'
	| 'esc'
	| 'enter'

export default class Game {
	public mapScreen = new MapScreen(this)
	public pauseScreen = new PauseScreen(this)
	public battleScene = new BattleScene(this)
	entities: Entity[] = []
	public input = new Set<Input>()
	public state: GameState = 'RUNNING'

	constructor(
		readonly gameWidth: number,
		readonly gameHeight: number,
		readonly mainCtx: CanvasRenderingContext2D,
		public mousePos = { x: gameWidth / 2, y: gameHeight / 2 }
	) {
		const gameScreenEl = getDocumentElementById('gameScreen')

		gameScreenEl.addEventListener('click', (e) => {
			this.input.add('leftClick')
		})

		console.log('hej')

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
				case 'Enter': {
					this.input.add('enter')
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
				this.battleScene.update(dt)
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
		switch (this.state) {
			case 'MAP_SCREEN': {
				this.mapScreen.draw(mainCtx)
				break
			}
			case 'BATTLE_SCENE': {
				this.battleScene.draw(mainCtx)
				break
			}
		}
	}
}
