import Game, { Input } from '../game'
import { getRandomIntInclusive, shuffleArray } from '../shared/helperFunctions/math'
import { Vector } from '../shared/Vector'
import { Point } from '../types'
import { Battle } from './Battle/Battle'
import { Skill } from './Role/Role'
import { Character } from './Entity/Character'
import { Damage } from './SkillEffect'

const skillsPerColumn = 2

const validInputs: Extract<
	Input,
	'up' | 'left' | 'down' | 'right' | 'enter'
>[] = ['up', 'left', 'down', 'right', 'enter']

type Animation = {
	type: 'commence-battle'
	durationMs: number
	timePassedMs: number
}

type Screen = {
	ratio: number
	offset: {
		x: number
		y: number
	}
}

type State =
	| {
			name: 'CALCULATE_FOE_ACTION'
			characterTurn: Character
			selectedTargets: Array<Character>
	  }
	| {
			name: 'PLAYER_SELECT_SKILL'
			characterTurn: Character
			focusedSkill: Skill
	  }
	| {
			name: 'PLAYER_SELECT_TARGET'
			characterTurn: Character
			selectedSkill: Skill
			selectedTargets: Array<Character>
			focusedTarget: Character | null
	  }
	| {
			name: 'ANIMATING_ACTION'
			characterTurn: Character
			characterDestination: Point | null
			selectedSkill: Skill
			selectedTargets: Array<Character>
	  }
	| {
			name: 'PROGRESS_ATB'
	  }
	| {
			name: 'SLEEP'
	  }

export class BattleSystem {
	public battle: { active: Battle | null; queue: Battle[] } = {
		active: null,
		queue: [],
	}
	private state: State = { name: 'SLEEP' }
	private animations: Animation[] = [
		{
			type: 'commence-battle',
			durationMs: 1200,
			timePassedMs: 0,
		},
	]

	constructor(readonly game: Game) {}

	update(dt: number) {
		if (!this.battle.active) return

		const outcome = this.updateAnimations(dt)

		if (
			outcome.deleted.some((animation) => animation.type === 'commence-battle')
		) {
			this.state = { name: 'PROGRESS_ATB' }
		}

		switch (this.state.name) {
			case 'SLEEP': {
				break
			}
			case 'PROGRESS_ATB': {
				let nextTurnCharacter: Character | null = null

				const characters = this.getNonDeadCharacters([...this.battle.active.foes, ...this.battle.active.players])

				for (const character of characters) {
					character.atkBar = character.atkBar + (character.stats.speed) * dt
					if (character.atkBar >= 1) {
						character.atkBar = 1
					}

					if (nextTurnCharacter === null && character.atkBar === 1) {
						nextTurnCharacter = character
					}
				}

				if (nextTurnCharacter !== null && this.isPlayer(nextTurnCharacter)) {
					this.state = {
						name: 'PLAYER_SELECT_SKILL',
						characterTurn: nextTurnCharacter,
						focusedSkill: nextTurnCharacter.role.skills[0]
					}
				} else if (nextTurnCharacter !== null && this.isFoe(nextTurnCharacter)) {
					this.state = {
						name: 'CALCULATE_FOE_ACTION',
						characterTurn: nextTurnCharacter,
						selectedTargets: [],
					}
				}
				
				break
			}
			case 'ANIMATING_ACTION': {
				if (
					this.isCurrentCharacter(this.state.selectedTargets[0]) && 
					this.state.characterTurn.position.x === this.state.characterTurn.originalPosition.x &&
					this.state.characterTurn.position.y === this.state.characterTurn.originalPosition.y
				) {
					this.state.characterTurn.actions.walk.state = 'not-in-use'

					if (this.state.characterTurn.actions.hit.state === 'complete') {
						this.executeAction({ skill: this.state.selectedSkill, targets: [this.state.selectedTargets[0]] })
						this.state.characterTurn.actions.hit.state = 'not-in-use'
						this.state.characterTurn.actions.hit.durationMs = 0
						this.state.selectedTargets.splice(0, 1)
						this.state.characterDestination = this.state.characterTurn.originalPosition

						const vectorToDestination = new Vector(this.state.characterDestination.x - this.state.characterTurn.position.x, this.state.characterDestination.y - this.state.characterTurn.position.y)
						// Adjust speed of vector
						vectorToDestination.x /= 1.5
						vectorToDestination.y /= 1.5
	
						// Set vector to next destination
						this.state.characterTurn.vector.x = vectorToDestination.x
						this.state.characterTurn.vector.y = vectorToDestination.y
						this.state.characterTurn.actions.walk.state = 'in-use'
					} else {
						this.state.characterTurn.actions.hit.state = 'in-use'
					}
				}

				const getTargetOffset = (character: Character, target?: Character) => {
					const offsetWidth = 125

					if (!target) return 0
					if (this.isCurrentCharacter(target)) return 0 // Is this needed; probably not
					if (this.isFoe(character) && this.isFoe(target)) return -offsetWidth
					if (this.isPlayer(character) && this.isPlayer(target)) return offsetWidth
					if (this.isFoe(character) && this.isPlayer(target)) return -offsetWidth
					if (this.isPlayer(character) && this.isFoe(target)) return offsetWidth

					throw new Error("Something went wrong!")
				}

				const targetOffset =  getTargetOffset(this.state.characterTurn, this.state.selectedTargets[0])

				if (this.state.characterDestination === null) {
					this.state.characterDestination = { x: this.state.selectedTargets[0].position.x + targetOffset, y: this.state.selectedTargets[0].position.y }
				}

				this.state.characterTurn.position.x += this.state.characterTurn.vector.x * dt
				this.state.characterTurn.position.y += this.state.characterTurn.vector.y * dt
				
				// Stop movement when reached destination
				if (this.state.characterTurn.vector.magnitude() * dt >= this.state.characterTurn.distanceTo(this.state.characterDestination)) {
					this.state.characterTurn.position.x = this.state.characterDestination.x
					this.state.characterTurn.position.y = this.state.characterDestination.y
					this.state.characterTurn.vector.x = 0
					this.state.characterTurn.vector.y = 0
					this.state.characterTurn.actions.walk.state = 'not-in-use'
				}

				// Character is at original position and has another destination
				if (
					this.state.characterTurn.position.x === this.state.characterTurn.originalPosition.x &&
					this.state.characterTurn.position.y === this.state.characterTurn.originalPosition.y &&
					this.state.characterDestination.x !== this.state.characterTurn.originalPosition.x &&
					this.state.characterDestination.y !== this.state.characterTurn.originalPosition.y
				) {
					const vectorToDestination = new Vector(this.state.characterDestination.x - this.state.characterTurn.position.x, this.state.characterDestination.y - this.state.characterTurn.position.y)
					// Adjust speed of vector
					vectorToDestination.x /= 1.5
					vectorToDestination.y /= 1.5

					// Set vector to next destination
					this.state.characterTurn.vector.x = vectorToDestination.x
					this.state.characterTurn.vector.y = vectorToDestination.y
					this.state.characterTurn.actions.walk.state = 'in-use'
				}

				// Has reached target
				if (
					this.state.characterTurn.position.x === this.state.characterDestination.x &&
					this.state.characterTurn.position.y === this.state.characterDestination.y &&
					this.state.characterTurn.position.x !== this.state.characterTurn.originalPosition.x &&
					this.state.characterTurn.position.y !== this.state.characterTurn.originalPosition.y
				) {
					this.state.characterTurn.actions.walk.state = 'not-in-use'

					if (this.state.characterTurn.actions.hit.state === 'complete') {
						this.executeAction({ skill: this.state.selectedSkill, targets: [this.state.selectedTargets[0]] })
						this.state.characterTurn.actions.hit.state = 'not-in-use'
						this.state.characterTurn.actions.hit.durationMs = 0
						this.state.selectedTargets.splice(0, 1)
						this.state.characterDestination = this.state.characterTurn.originalPosition

						const vectorToDestination = new Vector(this.state.characterDestination.x - this.state.characterTurn.position.x, this.state.characterDestination.y - this.state.characterTurn.position.y)
						// Adjust speed of vector
						vectorToDestination.x /= 1.5
						vectorToDestination.y /= 1.5
	
						// Set vector to next destination
						this.state.characterTurn.vector.x = vectorToDestination.x
						this.state.characterTurn.vector.y = vectorToDestination.y
						this.state.characterTurn.actions.walk.state = 'in-use'
					} else {
						this.state.characterTurn.actions.hit.state = 'in-use'
					}
				}

				// Has reached original position
				if (
					this.state.characterTurn.position.x === this.state.characterDestination.x &&
					this.state.characterTurn.position.y === this.state.characterDestination.y &&
					this.state.characterDestination.x === this.state.characterTurn.originalPosition.x &&
					this.state.characterDestination.y === this.state.characterTurn.originalPosition.y
				) {
					this.state.characterTurn.actions.walk.state === 'not-in-use'
					if (this.state.selectedTargets[0]) {
						this.state.characterDestination = { x: this.state.selectedTargets[0].position.x + targetOffset, y: this.state.selectedTargets[0].position.y }
					} else { // No more enemies to attack
						this.state.characterTurn.atkBar = 0
						this.state = { name: 'PROGRESS_ATB' }
					}
				}

				break
			}
			case 'CALCULATE_FOE_ACTION': {
				const selectedSkill = this.state.characterTurn.role.skills[getRandomIntInclusive(0, this.state.characterTurn.role.skills.length - 1)]
				const selectableTargets = this.getSelectableTargets({
					battle: this.battle.active,
					state: this.state,
					skill: selectedSkill,
				})

				const maxNumTargets = Math.min(selectedSkill.numberOfTargets, selectableTargets.length)
				const shuffledArrayOfTargets = shuffleArray(selectableTargets)
				const selectedTargets = shuffledArrayOfTargets.slice(0, maxNumTargets)

				this.state = {
					name: 'ANIMATING_ACTION',
					characterTurn: this.state.characterTurn,
					selectedSkill: selectedSkill,
					selectedTargets: selectedTargets,
					characterDestination: null,
				}

				break
			}
			case 'PLAYER_SELECT_TARGET': {
				const selectableTargets = this.getSelectableTargets({
					battle: this.battle.active,
					state: this.state,
					skill: this.state.selectedSkill,
				})

				if (this.state.focusedTarget === null) {
					// Initialize focused target
					this.state.focusedTarget = selectableTargets[0]
				}
			}
		}

		if (validInputs.some((input) => this.game.input.has(input))) {
			for (const input of this.game.input) {
				switch (this.state.name) {
					case 'PLAYER_SELECT_SKILL': {
						switch (input) {
							case 'up': {
								const skillSet = this.mapToSkillSet(
									this.state.characterTurn.role.skills
								)
								const focusedSkill = this.state.focusedSkill
								const columnWithFocusedSkill = skillSet.find((columnSkills) =>
									columnSkills.some((skill) => skill === focusedSkill)
								)

								if (!columnWithFocusedSkill) {
									throw new Error('#columnWithFocusedSkill is undefined')
								}

								const indexOfFocusedSkill =
									columnWithFocusedSkill.indexOf(focusedSkill)

								const nextStateFocusedSkill = columnWithFocusedSkill.at(
									indexOfFocusedSkill - 1
								)

								if (nextStateFocusedSkill)
									this.state.focusedSkill = nextStateFocusedSkill

								break
							}
							case 'down': {
								const skillSet = this.mapToSkillSet(
									this.state.characterTurn.role.skills
								)
								const focusedSkill = this.state.focusedSkill
								const columnWithFocusedSkill = skillSet.find((columnSkills) =>
									columnSkills.some((skill) => skill === focusedSkill)
								)

								if (!columnWithFocusedSkill) {
									throw new Error('#columnWithFocusedSkill is undefined')
								}

								const indexOfFocusedSkill =
									columnWithFocusedSkill.indexOf(focusedSkill)

								const nextStateFocusedSkill = columnWithFocusedSkill.at(
									indexOfFocusedSkill - skillsPerColumn + 1
								)

								if (nextStateFocusedSkill)
									this.state.focusedSkill = nextStateFocusedSkill

								break
							}
							case 'left': {
								const skillSet = this.mapToSkillSet(
									this.state.characterTurn.role.skills
								)
								const focusedSkill = this.state.focusedSkill
								const columnWithFocusedSkill = skillSet.find((columnSkills) =>
									columnSkills.some((skill) => skill === focusedSkill)
								)

								if (!columnWithFocusedSkill) {
									throw new Error('#columnWithFocusedSkill is undefined')
								}

								const indexOfFocusedColumn = skillSet.findIndex(
									(columnSkills) =>
										columnSkills.some((skill) => skill === focusedSkill)
								)
								const indexOfFocusedSkill =
									columnWithFocusedSkill.indexOf(focusedSkill)

								const nextStateFocusedSkill = skillSet
									.at(indexOfFocusedColumn - 1)
									?.at(indexOfFocusedSkill) || skillSet
									.at(indexOfFocusedColumn - 2)
									?.at(indexOfFocusedSkill)

								if (nextStateFocusedSkill)
									this.state.focusedSkill = nextStateFocusedSkill

								break
							}
							case 'right': {
								const skillSet = this.mapToSkillSet(
									this.state.characterTurn.role.skills
								)
								const focusedSkill = this.state.focusedSkill
								const columnWithFocusedSkill = skillSet.find((columnSkills) =>
									columnSkills.some((skill) => skill === focusedSkill)
								)

								if (!columnWithFocusedSkill) {
									throw new Error('#columnWithFocusedSkill is undefined')
								}

								const indexOfFocusedColumn = skillSet.findIndex(
									(columnSkills) =>
										columnSkills.some((skill) => skill === focusedSkill)
								)
								const indexOfFocusedSkill =
									columnWithFocusedSkill.indexOf(focusedSkill)

								const nextStateFocusedSkill = skillSet
									.at(indexOfFocusedColumn - skillSet.length + 1)
									?.at(indexOfFocusedSkill) ||  skillSet
									.at(indexOfFocusedColumn - skillSet.length + 2)
									?.at(indexOfFocusedSkill) 

								if (nextStateFocusedSkill)
									this.state.focusedSkill = nextStateFocusedSkill
									
								break
							}
							case 'enter': {
								this.state = {
									name: 'PLAYER_SELECT_TARGET',
									characterTurn: this.state.characterTurn,
									selectedSkill: this.state.focusedSkill,
									selectedTargets: [],
									focusedTarget: null,
								}

								break
							}
						}

						break
					}
					case 'PLAYER_SELECT_TARGET': {
						const selectableTargets = this.getSelectableTargets({
							battle: this.battle.active,
							state: this.state,
							skill: this.state.selectedSkill,
						})

						if (this.state.focusedTarget === null) {
							throw new Error("focusedTarget is null when it should be set.")
						}

						const currentlySelectedTargetIndex = selectableTargets.indexOf(
							this.state.focusedTarget
						)

						const [currentlySelectedTarget] = selectableTargets.splice(
							currentlySelectedTargetIndex,
							1
						)

						if (!currentlySelectedTarget) {
							throw new Error('#currentlySelectedTarget is undefined!')
						}

						const selectableTargetsExt = selectableTargets.map((target) => ({
							target,
							vectorTo: new Vector(
								target.position.x - currentlySelectedTarget.position.x,
								target.position.y - currentlySelectedTarget.position.y
							),
						}))

						switch (input) {
							case 'up': {
								const validTargets = selectableTargetsExt
									.filter((target) => {
										const vectorNorm = target.vectorTo.norm()
										return Math.abs(vectorNorm.y) > Math.abs(vectorNorm.x)
									})
									.filter((target) => target.vectorTo.y < 0)

								if (validTargets.length === 0) break

								const [prioritizedTarget] = validTargets.sort(
									(targetA, targetB) => {
										return (
											targetA.vectorTo.magnitude() -
											targetB.vectorTo.magnitude()
										)
									}
								)

								this.state.focusedTarget = prioritizedTarget.target

								break
							}
							case 'down': {
								const validTargets = selectableTargetsExt
									.filter((target) => {
										const vectorNorm = target.vectorTo.norm()
										return Math.abs(vectorNorm.y) > Math.abs(vectorNorm.x)
									})
									.filter((target) => target.vectorTo.y > 0)

								if (validTargets.length === 0) break

								const [prioritizedTarget] = validTargets.sort(
									(targetA, targetB) => {
										return (
											targetA.vectorTo.magnitude() -
											targetB.vectorTo.magnitude()
										)
									}
								)

								this.state.focusedTarget = prioritizedTarget.target

								break
							}
							case 'left': {
								const validTargets = selectableTargetsExt
									.filter((target) => {
										const vectorNorm = target.vectorTo.norm()
										return Math.abs(vectorNorm.x) > Math.abs(vectorNorm.y)
									})
									.filter((target) => target.vectorTo.x < 0)

								if (validTargets.length === 0) break

								const [prioritizedTarget] = validTargets.sort(
									(targetA, targetB) => {
										return (
											targetA.vectorTo.magnitude() -
											targetB.vectorTo.magnitude()
										)
									}
								)

								this.state.focusedTarget = prioritizedTarget.target

								break
							}
							case 'right': {
								const validTargets = selectableTargetsExt
									.filter((target) => {
										const vectorNorm = target.vectorTo.norm()
										return Math.abs(vectorNorm.x) > Math.abs(vectorNorm.y)
									})
									.filter((target) => target.vectorTo.x > 0)

								if (validTargets.length === 0) break

								const [prioritizedTarget] = validTargets.sort(
									(targetA, targetB) => {
										return (
											targetA.vectorTo.magnitude() -
											targetB.vectorTo.magnitude()
										)
									}
								)

								this.state.focusedTarget = prioritizedTarget.target

								break
							}
							case 'enter': {
								this.state.selectedTargets.push(this.state.focusedTarget)

								const restOfTargets = this.getSelectableTargets({
									battle: this.battle.active,
									state: this.state,
									skill: this.state.selectedSkill,
								})

								if (this.state.selectedTargets.length >= this.state.selectedSkill.numberOfTargets || restOfTargets.length === 0) {
									this.state = {
										name: 'ANIMATING_ACTION',
										characterTurn: this.state.characterTurn,
										characterDestination: null,
										selectedSkill: this.state.selectedSkill,
										selectedTargets: this.state.selectedTargets,
									}
								} else {
									this.state.focusedTarget = restOfTargets[0]
								}

								break
							}
						}

						break
					}
				}
			}
		}
	}

	updateAnimations(dt: number) {
		this.animations = this.animations.map((animation) => ({
			...animation,
			timePassedMs: animation.timePassedMs + dt * 1000,
		}))

		const animationState = this.animations.reduce<{
			inProgress: Animation[]
			finished: Animation[]
		}>(
			(prev, current) => {
				if (current.timePassedMs >= current.durationMs) {
					return {
						...prev,
						finished: [...prev.finished, current],
					}
				} else {
					return {
						...prev,
						inProgress: [...prev.inProgress, current],
					}
				}
			},
			{ inProgress: [], finished: [] }
		)

		this.animations = animationState.inProgress

		return {
			deleted: animationState.finished,
		}
	}

	getSelectableTargets({ battle, state, skill }: { battle: Battle, state: Extract<State, { characterTurn: Character, selectedTargets: Character[] }>, skill: Skill }) {
		const selectableTargets: Character[] = []

		if (this.isFoe(state.characterTurn)) {
			if (skill.validTarget.some((target) => target === 'allies')) {
				const nonSelectedTargets = battle.foes.filter((foe) => !state.selectedTargets.some((target) => target === foe))
				
				selectableTargets.push(...nonSelectedTargets)

			} else if (skill.validTarget.some((target) => target === 'self')) {
				const self = battle.foes.find(this.isCurrentCharacter)
				
				if (!self) throw new Error("Couldn't find current character.")

				selectableTargets.push(self)

			}

			if (skill.validTarget.some((target) => target === 'enemy')) {
				const nonSelectedTargets = battle.players.filter((player) => !state.selectedTargets.some((target) => target === player))

				selectableTargets.push(...nonSelectedTargets)

			}

			return this.getNonDeadCharacters(selectableTargets)

		} else if (this.isPlayer(state.characterTurn)) {
			if (skill.validTarget.some((target) => target === 'allies')) {
				const nonSelectedTargets = battle.players.filter((player) => !state.selectedTargets.some((target) => target === player))
				
				selectableTargets.push(...nonSelectedTargets)

			} else if (skill.validTarget.some((target) => target === 'self')) {
				const self = battle.players.find(this.isCurrentCharacter)
				
				if (!self) throw new Error("Couldn't find current character.")

				selectableTargets.push(self)

			}

			if (skill.validTarget.some((target) => target === 'enemy')) {
				const nonSelectedTargets = battle.foes.filter((foe) => !state.selectedTargets.some((target) => target === foe))
				
				selectableTargets.push(...nonSelectedTargets)

			}

			return this.getNonDeadCharacters(selectableTargets)

		}

		throw new Error("Couldn't find any valid targets!")
	}

	isCurrentCharacter(character: Character) {
		if ('characterTurn' in this.state && this.state.characterTurn) {
			return this.state.characterTurn === character
		}
		
		throw new Error("Called #isCurrentCharacter but no characters turn yet!")
	}

	isFoe(character: Character) {
		if (!this.battle.active) throw new Error("Called #isFoe but no active battle in play!")
		return this.battle.active.foes.some((foe) => foe === character)
	}

	isPlayer(character: Character) {
		if (!this.battle.active) throw new Error("Called #isPlayer but no active battle in play!")
		return this.battle.active.players.some((player) => player === character)
	}

	getNonDeadCharacters(characters: Character[]) {
		return characters.filter((target) => target.stats.hp > 0)
	}
	
	getPlayableCharacters({ battle }: { battle: Battle }) {
		return this.getNonDeadCharacters(battle.players)
	}

	mapToSkillSet(skills: Skill[]): (Skill | null)[][] {
		const numberOfSkillBoxes =
			skills.length % skillsPerColumn === 0
				? skills.length
				: skills.length + (skills.length % skillsPerColumn)
		const skillList: Array<Skill | null> = Array(numberOfSkillBoxes).fill(null)

		for (let i = 0; i < skillList.length; i++) {
			if (skills[i]) {
				skillList[i] = skills[i]
			}
		}

		const numberOfSkillColumns = skillList.length / skillsPerColumn
		const skillSet: (Skill | null)[][] = []

		
		for (let i = 0; i < numberOfSkillColumns; i++) {
			skillSet.push(skillList.slice(i * skillsPerColumn, i * skillsPerColumn + skillsPerColumn))
		}

		return skillSet
	}

	executeAction({ skill, targets }: { skill: Skill, targets: Array<Character> }) {
		targets.forEach((target) => {
			target.effects.push(skill.generateSkillEffect({}))
		})

		targets.forEach((target) => {
			const dmgEffects = target.effects.filter((effect): effect is Damage => effect.type === 'damage')
			dmgEffects.forEach((dmgEffect) => {
				target.stats.hp -= dmgEffect.points
				if (target.stats.hp <= 0) target.actions.die.state = 'in-use'
			})
			target.effects = target.effects.filter((effect) => effect.type !== 'damage')
		})
	}

	draw(mainCtx: CanvasRenderingContext2D, dt: number) {
		if (!this.battle.active) return

		mainCtx.clearRect(0, 0, this.game.gameWidth, this.game.gameHeight)

		if (
			!this.animations.some((animation) => animation.type === 'commence-battle')
		) {
			mainCtx.imageSmoothingEnabled = false

			this.battle.active.drawBackground({
				ctx: mainCtx,
				game: this.game,
			})

			for (const character of [
				...this.battle.active.foes,
				...this.battle.active.players,
			]) {
				const isSelected =
					this.state.name === 'PLAYER_SELECT_TARGET' &&
					this.state.selectedTargets.some((target) => target === character)
				const isFocused =
					this.state.name === 'PLAYER_SELECT_TARGET' &&
					this.state.focusedTarget === character

				character.draw({ ctx: mainCtx }, dt, isSelected, isFocused)
			}
		}

		for (const animation of this.animations) {
			const animationProgress = Math.min(
				animation.timePassedMs / animation.durationMs,
				1
			)

			switch (animation.type) {
				case 'commence-battle': {
					const background1TranslateX =
						this.game.gameWidth * animationProgress - this.game.gameWidth

					mainCtx.imageSmoothingEnabled = false

					this.battle.active.drawBackground({
						ctx: mainCtx,
						game: this.game,
						offsetX: -background1TranslateX,
						offsetY: 0,
					})

					const characterTranslateX =
						this.game.gameWidth - this.game.gameWidth * animationProgress

					for (const character of [
						...this.battle.active.foes,
						...this.battle.active.players,
					]) {
						character.draw({
							ctx: mainCtx,
							offsetX: -characterTranslateX,
							offsetY: 0,
						}, dt)
					}
				}
			}
		}

		if (this.state.name === 'PLAYER_SELECT_SKILL') {
			this.drawSkillBar(mainCtx, this.state)
		}
	}

	drawSkillBar(ctx: CanvasRenderingContext2D, state: Extract<State, { name: 'PLAYER_SELECT_SKILL' }>) {
		const skillSet = this.mapToSkillSet(state.characterTurn.role.skills)

		for (let columnIndex = 0; columnIndex < skillSet.length; columnIndex++) {
			for (let rowIndex = 0; rowIndex < skillsPerColumn; rowIndex++) {
				const skillHeight = 50
				const skillWidth = this.game.gameWidth / skillSet.length

				ctx.save()
				ctx.fillStyle = 'lightgray'

				const lineWidth = 5

				ctx.lineWidth = lineWidth
				ctx.strokeStyle = 'black'

				ctx.fillRect(
					skillWidth * columnIndex,
					skillHeight * rowIndex,
					skillWidth,
					skillHeight
				)
				ctx.strokeRect(
					skillWidth * columnIndex + lineWidth / 2,
					skillHeight * rowIndex + lineWidth / 2,
					skillWidth - lineWidth,
					skillHeight - lineWidth
				)
				ctx.restore()

				const skill = skillSet[columnIndex][rowIndex]

				if (skill) {
					ctx.save()

					ctx.font = '30px serif'
					ctx.textAlign = 'center'
					ctx.fillStyle = 'black'

					ctx.fillText(
						skill.name,
						skillWidth * columnIndex + skillWidth / 2,
						skillHeight * rowIndex + 40
					)

					ctx.restore()
				}
			}
		}

		for (let columnIndex = 0; columnIndex < skillSet.length; columnIndex++) {
			for (let rowIndex = 0; rowIndex < skillsPerColumn; rowIndex++) {
				if (skillSet[columnIndex][rowIndex] !== state.focusedSkill) continue

				const skillHeight = 50
				const skillWidth = this.game.gameWidth / skillSet.length

				ctx.save()

				const lineWidth = 5

				ctx.lineWidth = lineWidth
				ctx.strokeStyle = 'red'

				ctx.strokeRect(
					skillWidth * columnIndex + lineWidth / 2,
					skillHeight * rowIndex + lineWidth / 2,
					skillWidth - lineWidth,
					skillHeight - lineWidth
				)

				ctx.restore()
			}
		}
	}
}
