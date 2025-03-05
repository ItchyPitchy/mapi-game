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
			focusedTarget: Character
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

				const characters = [...this.battle.active.foes, ...this.battle.active.players]

				for (const character of characters) {
					character.atkBar = character.atkBar + (character.stats.speed) * dt
					if (character.atkBar >= 1) {
						character.atkBar = 1
					}

					if (nextTurnCharacter === null && character.atkBar === 1) {
						nextTurnCharacter = character
					}
				}

				if (nextTurnCharacter !== null && this.battle.active.players.find((player) => player === nextTurnCharacter)) {
					this.state = {
						name: 'PLAYER_SELECT_SKILL',
						characterTurn: nextTurnCharacter,
						focusedSkill: nextTurnCharacter.role.skills[0]
					}
				}

				if (nextTurnCharacter !== null && this.battle.active.foes.find((foe) => foe === nextTurnCharacter)) {
					this.state = {
						name: 'CALCULATE_FOE_ACTION',
						characterTurn: nextTurnCharacter,
					}
				}
				
				break
			}
			case 'ANIMATING_ACTION': {
				const getTargetOffset = (characterTurn: Character) => {
					// TODO: Find a better way to find out what type of character whose turn it is.
					const characterType = characterTurn.name === 'Mami' || characterTurn.name === 'Papi' ? 'Player' : 'Foe'
					const offsetWidth = 125

					return characterType === 'Foe' ? -offsetWidth : offsetWidth
				}

				if (this.state.characterDestination === null) {
					this.state.characterDestination = { x: this.state.selectedTargets[0].position.x + getTargetOffset(this.state.characterTurn), y: this.state.selectedTargets[0].position.y }
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

				// Has reached enemy
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
						this.state.characterDestination = { x: this.state.selectedTargets[0].position.x + getTargetOffset(this.state.characterTurn), y: this.state.selectedTargets[0].position.y }
					} else { // No more enemies to attack
						this.state.characterTurn.atkBar = 0
						this.state = { name: 'PROGRESS_ATB' }
					}
				}

				break
			}
			case 'CALCULATE_FOE_ACTION': {
				const selectedSkill = this.state.characterTurn.role.skills[getRandomIntInclusive(0, this.state.characterTurn.role.skills.length - 1)]
				const numberOfTargets = selectedSkill.numberOfTargets
				const validTargets = this.battle.active.players.filter((player) => player.stats.hp > 0)
				let selectedTargets: Character[] = []

				if (validTargets.length <= numberOfTargets) {
					selectedTargets = validTargets
				} else {
					const shuffledArrayOfTargets = shuffleArray(validTargets)
					selectedTargets = shuffledArrayOfTargets.slice(0, numberOfTargets)
				}

				if (selectedTargets.length === 0) throw new Error("Couldn't find any valid targets during foes turn!")

				this.state = {
					name: 'ANIMATING_ACTION',
					characterTurn: this.state.characterTurn,
					selectedSkill: selectedSkill,
					selectedTargets: selectedTargets,
					characterDestination: null,
				}

				break
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
									focusedTarget: this.battle.active.foes[0],
								}

								break
							}
						}

						break
					}
					case 'PLAYER_SELECT_TARGET': {
						const selectableTargets = [
							...this.battle.active.players,
							...this.battle.active.foes,
						]

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

								if (this.state.selectedTargets.length >= this.state.selectedSkill.numberOfTargets) {
									this.state = {
										name: 'ANIMATING_ACTION',
										characterTurn: this.state.characterTurn,
										characterDestination: null,
										selectedSkill: this.state.selectedSkill,
										selectedTargets: this.state.selectedTargets,
									}
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
