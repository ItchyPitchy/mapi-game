import Game, { Input } from './game'
import { getDocumentElementById } from './shared/helperFunctions/element'

const pauseScreen = getDocumentElementById('pauseScreen')
const optionsEl = getDocumentElementById('options')

const validInputs: Exclude<Input, 'leftClick'>[] = [
	'up',
	'left',
	'down',
	'right',
	'enter',
	'esc',
]

type MenuOptionId = 'continue' | 'map' | 'settings' | 'credits'

type MenuOption = {
	id: MenuOptionId
	text: string
}

export class PauseScreen {
	options: MenuOption[] = [
		{
			id: 'continue',
			text: 'Continue',
		},
		{
			id: 'map',
			text: 'Map',
		},
		{
			id: 'settings',
			text: 'Settings',
		},
		{
			id: 'credits',
			text: 'Credits',
		},
	]
	selectedOption: MenuOptionId = 'continue'

	constructor(public game: Game) {
		const optionsEl = getDocumentElementById('options')

		for (const option of this.options) {
			const optionEl = document.createElement('span')

			if (option.id === this.selectedOption) {
				optionEl.setAttribute('data-selected', 'selected')
			}

			optionEl.setAttribute('data-optionId', option.id)
			optionEl.textContent = option.text

			optionEl.addEventListener('mouseenter', () => {
				this.handleSwitchSelectedOption(() => option)
			})

			optionEl.addEventListener('click', () => {
				this.handleSubmitOption()
			})

			optionsEl.appendChild(optionEl)
		}
	}

	show() {
		pauseScreen.style.display = 'flex'
	}

	hide() {
		pauseScreen.style.display = 'none'
	}

	handleSwitchSelectedOption(
		cb: (previouslySelectedOptionIndex: number | null) => MenuOption
	) {
		const currentlySelectedOptionEl = optionsEl.querySelector(
			"[data-selected='selected']"
		)

		if (currentlySelectedOptionEl) {
			currentlySelectedOptionEl.removeAttribute('data-selected')

			const optionId = currentlySelectedOptionEl.getAttribute('data-optionId')
			const optionIndex = this.options.findIndex(
				(option) => option.id === optionId
			)

			const nextOption = cb(optionIndex === -1 ? null : optionIndex)

			const nextSelectedEl = optionsEl.querySelector(
				`[data-optionId='${nextOption.id}']`
			)

			if (nextSelectedEl) {
				this.selectedOption = nextOption.id
				nextSelectedEl.setAttribute('data-selected', 'selected')
			}
		}
	}

	handleSubmitOption() {
		switch (this.selectedOption) {
			case 'continue': {
				this.hide()
				this.game.state = 'RUNNING'
				break
			}
			case 'map': {
				this.hide()
				this.game.state = 'MAP_SCREEN'
				break
			}
		}
	}

	update() {
		if (validInputs.some((input) => this.game.input.has(input))) {
			this.game.input.forEach((input) => {
				switch (input) {
					case 'up': {
						this.handleSwitchSelectedOption((previousIndex) => {
							return previousIndex === 0 || previousIndex === null
								? this.options[this.options.length - 1]
								: this.options[previousIndex - 1]
						})
						break
					}
					case 'down': {
						this.handleSwitchSelectedOption((previousIndex) => {
							return previousIndex === this.options.length - 1 ||
								previousIndex === null
								? this.options[0]
								: this.options[previousIndex + 1]
						})
						break
					}
					case 'esc': {
						this.hide()
						this.game.state = 'RUNNING'
						break
					}
					case 'enter': {
						this.handleSubmitOption()
						break
					}
				}
			})
		}
	}
}
