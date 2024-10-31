import { Collidable } from '../Component/Collidable'
import { Actions, Player } from '../Entity/Player/Player'

export type Input =
	// | 'esc'
	// | 'enter'
	'up' | 'left' | 'right' | 'down' | 'S'

export type TranslatedAction =
	// | 'esc'
	// | 'enter'
	// | 'up'
	| 'walk-left'
	| 'walk-right'
	| 'sprint-left'
	| 'sprint-right'
	| 'crouch'
	| 'draw-weapon'
	| 'stowe-weapon'
	| 'jump'
	| 'leap'

export class PlayerInputHandler {
	private input = new Set<Input>()

	constructor() {
		document.addEventListener('keydown', (e) => {
			switch (e.key) {
				// case 'Escape':
				// 	return this.input.add('esc')
				// case 'Enter':
				//   return this.input.add('enter')
				case 'ArrowUp':
					return this.input.add('up')
				case 'ArrowLeft':
					return this.input.add('left')
				case 'ArrowDown':
					return this.input.add('down')
				case 'ArrowRight':
					return this.input.add('right')
				case 's':
					return this.input.add('S')
			}
		})

		document.addEventListener('keyup', (e) => {
			switch (e.key) {
				// case 'Escape':
				// 	return this.input.delete('esc')
				// case 'Enter':
				//   return this.input.delete('enter')
				case 'ArrowUp':
					return this.input.delete('up')
				case 'ArrowLeft':
					return this.input.delete('left')
				case 'ArrowDown':
					return this.input.delete('down')
				case 'ArrowRight':
					return this.input.delete('right')
				case 's':
					return this.input.delete('S')
			}
		})
	}

	public getActions(player: Player) {
		return this.determineActions(this.input, player)
	}

	private determineActions(
		inputs: Set<Input>,
		player: Player
	): Set<TranslatedAction> {
		const actions: Set<TranslatedAction> = new Set()

		for (const input of inputs) {
			switch (input) {
				case 'left': {
					const nonCompatibleActions: Array<keyof Actions> = ['jump']

					if (
						nonCompatibleActions.every(
							(action) => player.actions[action].state === 'not-in-use'
						)
					) {
						if (player.weapon.state === 'not-drawn') {
							actions.add('sprint-left')
						}

						if (player.weapon.state === 'drawn') {
							actions.add('walk-left')
						}

						actions.delete('walk-right')
						actions.delete('sprint-right')
					}

					break
				}
				case 'right': {
					const nonCompatibleActions: Array<keyof Actions> = ['jump']

					if (
						nonCompatibleActions.every(
							(action) => player.actions[action].state === 'not-in-use'
						)
					) {
						if (player.weapon.state === 'not-drawn') {
							actions.add('sprint-right')
						}

						if (player.weapon.state === 'drawn') {
							actions.add('walk-right')
						}

						actions.delete('walk-left')
						actions.delete('sprint-left')
					}

					break
				}
				case 'down': {
					// Crouch not implemented yet
					break
				}
				case 'up': {
					const nonCompatibleActions: Array<keyof Actions> = [
						'jump',
						'ascend',
						'descend',
						'stowe',
						'draw',
					]

					if (
						nonCompatibleActions.every(
							(action) => player.actions[action].state === 'not-in-use'
						)
					) {
						if (player.weapon.state === 'not-drawn') {
							actions.add('draw-weapon')
						}

						if (player.weapon.state === 'drawn') {
							actions.add('stowe-weapon')
						}
					}

					break
				}
				case 'S': {
					const nonCompatibleActions: Array<keyof Actions> = [
						'jump',
						'ascend',
						'descend',
						'stowe',
						'draw',
					]

					if (
						nonCompatibleActions.every(
							(action) => player.actions[action].state === 'not-in-use'
						)
					) {
						if (player.weapon.state === 'not-drawn') {
							actions.add('leap')
						}

						if (player.weapon.state === 'drawn') {
							actions.add('jump')
						}
					}

					break
				}
			}
		}

		return actions
	}
}
