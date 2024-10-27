import Game, { Input } from '../game'
import { Player } from './Entity/Player'

const moveInputs: Extract<Input, 'left' | 'right' | 'down' | 'up' | 's'>[] = [
	'left',
	'right',
	'down',
	'up',
	's',
]

export class MarioSystem {
	public player: Player

	constructor(readonly game: Game) {
		this.player = new Player(
			{ x: game.gameWidth / 2, y: game.gameHeight / 2 },
			0
		)
	}

	update(dt: number) {
		const actions: Array<'move' | 'sheath' | 'duck' | 'jump'> = []

		if (this.player.position.y >= this.game.gameHeight / 2) {
			this.player.vector.y = 0
			this.player.isJumping = false
		} else {
			this.player.vector.y += 1000 * dt
		}

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
	}

	draw(mainCtx: CanvasRenderingContext2D) {
		this.player.draw({ ctx: mainCtx })
	}
}
