import Game, { Input } from './game'
import { Stockholm } from './Map/Stockholm'
import playerTexture from './assets/player.png'
import { Vector } from './Component/Vector'

const validInputs: Extract<
	Input,
	'up' | 'left' | 'down' | 'right' | 'esc' | 'enter'
>[] = ['up', 'left', 'down', 'right', 'esc', 'enter']

export class MapScreen {
	map = new Stockholm()
	playerTexture: HTMLImageElement

	constructor(readonly game: Game) {
		const playerImg = new Image()
		playerImg.src = playerTexture
		this.playerTexture = playerImg
	}

	update(dt: number) {
		if (validInputs.some((input) => this.game.input.has(input))) {
			this.game.input.forEach((input) => {
				const currentStopIndex = this.map.stops.indexOf(this.map.currentStop)
				const nextStop =
					this.map.stops.length - 1 === currentStopIndex
						? null
						: {
								stop: this.map.stops[currentStopIndex + 1],
								vectorTo: new Vector(
									this.map.stops[currentStopIndex + 1].x -
										this.map.currentStop.x,
									this.map.stops[currentStopIndex + 1].y -
										this.map.currentStop.y
								),
						  }
				const previousStop =
					currentStopIndex === 0
						? null
						: {
								stop: this.map.stops[currentStopIndex - 1],
								vectorTo: new Vector(
									this.map.stops[currentStopIndex - 1].x -
										this.map.currentStop.x,
									this.map.stops[currentStopIndex - 1].y -
										this.map.currentStop.y
								),
						  }

				switch (input) {
					case 'up': {
						if (
							(nextStop && nextStop.vectorTo.y < 0) ||
							(previousStop && previousStop.vectorTo.y < 0)
						) {
							if (nextStop && previousStop) {
								if (
									nextStop.vectorTo.norm().y < previousStop.vectorTo.norm().y
								) {
									this.map.currentStop = nextStop.stop
								} else {
									this.map.currentStop = previousStop.stop
								}
							} else if (nextStop) {
								this.map.currentStop = nextStop.stop
							} else if (previousStop) {
								this.map.currentStop = previousStop.stop
							}
						}

						break
					}
					case 'down': {
						if (
							(nextStop && nextStop.vectorTo.y > 0) ||
							(previousStop && previousStop.vectorTo.y > 0)
						) {
							if (nextStop && previousStop) {
								if (
									nextStop.vectorTo.norm().y > previousStop.vectorTo.norm().y
								) {
									this.map.currentStop = nextStop.stop
								} else {
									this.map.currentStop = previousStop.stop
								}
							} else if (nextStop) {
								this.map.currentStop = nextStop.stop
							} else if (previousStop) {
								this.map.currentStop = previousStop.stop
							}
						}

						break
					}
					case 'left': {
						if (
							(nextStop && nextStop.vectorTo.x < 0) ||
							(previousStop && previousStop.vectorTo.x < 0)
						) {
							if (nextStop && previousStop) {
								if (
									nextStop.vectorTo.norm().x < previousStop.vectorTo.norm().x
								) {
									this.map.currentStop = nextStop.stop
								} else {
									this.map.currentStop = previousStop.stop
								}
							} else if (nextStop) {
								this.map.currentStop = nextStop.stop
							} else if (previousStop) {
								this.map.currentStop = previousStop.stop
							}
						}

						break
					}
					case 'right': {
						if (
							(nextStop && nextStop.vectorTo.x > 0) ||
							(previousStop && previousStop.vectorTo.x > 0)
						) {
							if (nextStop && previousStop) {
								if (
									nextStop.vectorTo.norm().x > previousStop.vectorTo.norm().x
								) {
									this.map.currentStop = nextStop.stop
								} else {
									this.map.currentStop = previousStop.stop
								}
							} else if (nextStop) {
								this.map.currentStop = nextStop.stop
							} else if (previousStop) {
								this.map.currentStop = previousStop.stop
							}
						}

						break
					}
					case 'esc': {
						this.game.state = 'PAUSE_SCREEN'
						this.game.pauseScreen.show()

						break
					}
					case 'enter': {
						this.game.battleScene.activeBattle = this.map.currentStop.battle
						this.game.battleScene.setupBattle()
						this.game.state = 'BATTLE_SCENE'

						break
					}
				}

				const alreadyExistingStopIndex = this.map.player.queue.indexOf(
					this.map.currentStop
				)

				if (alreadyExistingStopIndex >= 0) {
					this.map.player.queue = this.map.player.queue.slice(
						0,
						alreadyExistingStopIndex + 1
					)
					/* If the player already are standing on the stop, there's no need to push it to the queue */
				} else if (
					this.map.currentStop.x !== this.map.player.originPos.x ||
					this.map.currentStop.y !== this.map.player.originPos.y
				) {
					this.map.player.queue.push(this.map.currentStop)
				}
			})
		}

		if (this.map.player.queue.length !== 0) {
			const vectorToNextStop = new Vector(
				this.map.player.queue[0].x - this.map.player.originPos.x,
				this.map.player.queue[0].y - this.map.player.originPos.y
			)

			const norm = vectorToNextStop.norm()
			const playerVector = new Vector(norm.x * 170 * dt, norm.y * 170 * dt)

			if (playerVector.magnitude() > vectorToNextStop.magnitude()) {
				this.map.player.originPos.x = this.map.player.queue[0].x
				this.map.player.originPos.y = this.map.player.queue[0].y
				this.map.player.queue.shift()
			} else {
				this.map.player.originPos.x += playerVector.x
				this.map.player.originPos.y += playerVector.y
			}
		}
	}

	draw(mainCtx: CanvasRenderingContext2D) {
		const hRatio = this.game.gameWidth / this.map.texture.width
		const vRatio = this.game.gameHeight / this.map.texture.height
		const ratio = Math.min(hRatio, vRatio)
		const offsetX = (this.game.gameWidth - this.map.texture.width * ratio) / 2
		const offsetY = (this.game.gameHeight - this.map.texture.height * ratio) / 2

		mainCtx.clearRect(0, 0, this.game.gameWidth, this.game.gameHeight)
		mainCtx.drawImage(
			this.map.texture,
			0,
			0,
			this.map.texture.width,
			this.map.texture.height,
			offsetX,
			offsetY,
			this.map.texture.width * ratio,
			this.map.texture.height * ratio
		)

		for (let i = 0; i < this.map.stops.length; i++) {
			if (this.map.stops[i + 1]) {
				mainCtx.save()
				mainCtx.beginPath()
				mainCtx.setLineDash([5, 3])
				mainCtx.moveTo(
					this.map.stops[i].x + offsetX,
					this.map.stops[i].y + offsetY
				)
				mainCtx.lineTo(
					this.map.stops[i + 1].x + offsetX,
					this.map.stops[i + 1].y + offsetY
				)
				mainCtx.lineWidth = 3
				mainCtx.stroke()
				mainCtx.restore()
			}

			mainCtx.save()
			mainCtx.fillStyle =
				this.map.currentStop === this.map.stops[i] ? 'red' : 'orange'
			mainCtx.beginPath()
			mainCtx.arc(
				this.map.stops[i].x + offsetX,
				this.map.stops[i].y + offsetY,
				5,
				0,
				2 * Math.PI
			)
			mainCtx.fill()
			mainCtx.restore()
		}

		mainCtx.drawImage(
			this.playerTexture,
			this.map.player.originPos.x + offsetX - 35 / 2,
			this.map.player.originPos.y + offsetY - 40,
			35,
			35
		)
	}
}
