import { Actions, Player } from '../Entity/Player/Player'

export type Input =
	// | 'enter'
	'up' | 'left' | 'right' | 'down' | 'S' | 'F'

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
	| 'shoot'
	| 'butt-attack'

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
				case 'f':
					return this.input.add('F')
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
				case 'f':
					return this.input.delete('F')
			}
		})
	}

	public getActions(player: Player, cooldowns: Map<TranslatedAction, number>) {
		return this.determineActions(this.input, player, cooldowns)
	}

	private determineActions(
		inputs: Set<Input>,
		player: Player,
		cooldowns: Map<TranslatedAction, number>
	): Set<TranslatedAction> {
		const actions: Set<TranslatedAction> = new Set()

		for (const input of inputs) {
			switch (input) {
				case 'left': {
					const nonCompatibleActions: Array<keyof Actions> = ['jump', 'leap']

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
					const nonCompatibleActions: Array<keyof Actions> = ['jump', 'leap']

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
					const nonCompatibleActions: Array<keyof Actions> = [
						'jump',
						'buttAttack',
						'leap',
						// 'ascend',
						'stowe',
						'draw',
						'shoot',
					]

					if (
						nonCompatibleActions.every(
							(action) => player.actions[action].state === 'not-in-use'
						)
					) {
						if (player.weapon.state === 'drawn') {
							actions.add('butt-attack')
						}
					}

					break
				}
				case 'up': {
					const nonCompatibleActions: Array<keyof Actions> = [
						'jump',
						'leap',
						'ascend',
						'descend',
						'stowe',
						'draw',
						'shoot',
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

						actions.delete('shoot')
						actions.delete('jump')
						actions.delete('leap')
					}

					break
				}
				case 'S': {
					const nonCompatibleActions: Array<keyof Actions> = [
						'jump',
						'leap',
						'ascend',
						'descend',
						// 'stowe',
						'draw',
						'shoot',
					]

					if (
						nonCompatibleActions.every(
							(action) => player.actions[action].state === 'not-in-use'
						)
					) {
						if (player.weapon.state === 'not-drawn' || player.actions.stowe.state === 'in-use') {
							actions.add('leap')
						}

						if (player.weapon.state === 'drawn') {
							actions.add('jump')
						}
						
						actions.delete('shoot')
						actions.delete('draw-weapon')
						actions.delete('stowe-weapon')
					}

					break
				}
				case 'F': {
					const nonCompatibleActions: Array<keyof Actions> = [
						'jump',
						'ascend',
						'descend',
						'stowe',
						'draw',
						'leap',
					]

					if (
						nonCompatibleActions.every(
							(action) => player.actions[action].state === 'not-in-use'
						)
					) {
						if (player.weapon.state === 'drawn') {
							actions.delete('jump')
							actions.add('shoot')
						}
					}

					break
				}
			}
		}

		actions.forEach((action) => {
			if (cooldowns.has(action)) actions.delete(action)
		})

		return actions
	}
}
