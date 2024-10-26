import Game, { Input } from '../game'
import { Battle } from './Battle/Battle'
import { Vector } from '../shared/Vector'
import { Skill } from './Role/Role'
import { Character } from './Entity/Character'

const skillsPerColumn = 2

const validInputs: Extract<
	Input,
	'up' | 'left' | 'down' | 'right' | 'enter' | 'esc'
>[] = ['up', 'left', 'down', 'right', 'esc', 'enter']

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
			name: 'ENEMY_TURN'
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
			selectedSkill: Skill
			selectedTargets: Array<Character>
			focusedTarget: Character
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
			this.state = this.calculateNextState(this.battle.active)
		}

		if (validInputs.some((input) => this.game.input.has(input))) {
			for (const input of this.game.input) {
				switch (this.state.name) {
					case 'SLEEP': {
						break
					}
					case 'ENEMY_TURN': {
						break
					}
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
									.at(indexOfFocusedColumn - skillSet.length)
									?.at(indexOfFocusedSkill)

								if (nextStateFocusedSkill)
									this.state.focusedSkill = nextStateFocusedSkill

								break
							}
							case 'esc': {
								this.game.state = 'PAUSE_SCREEN'
								this.game.pauseScreen.show()

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

								if (this.state.selectedTargets.length >= 2) {
									this.executeAction(this.state)
								}

								break
							}
							case 'esc': {
								this.game.state = 'PAUSE_SCREEN'
								this.game.pauseScreen.show()
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

	calculateNextState(battle: Battle): State {
		const player = battle.players[0]
		const skills = player.role.skills

		return {
			name: 'PLAYER_SELECT_SKILL',
			characterTurn: player,
			focusedSkill: skills[0],
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
			skillSet.push(skillList.slice(i * skillsPerColumn, skillsPerColumn))
		}

		return skillSet
	}

	executeAction(
		action: Pick<
			Extract<State, { name: 'PLAYER_SELECT_TARGET' }>,
			'selectedSkill' | 'selectedTargets'
		>
	) {
		// if (!action.selectedSkill.unlocked) return

		action.selectedTargets.forEach((target) => {
			target.effects.push(action.selectedSkill.generateSkillEffect({}))
		})
	}

	draw(mainCtx: CanvasRenderingContext2D) {
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
					this.state.focusedTarget === character

				character.draw({ ctx: mainCtx }, isSelected)

				// if (
				// 	this.activeBattle.selectedAction &&
				// 	this.activeBattle.selectedAction.targets.some(
				// 		(target) => target === foe
				// 	)
				// ) {
				// 	mainCtx.save()
				// 	mainCtx.strokeStyle = 'black'
				// 	mainCtx.beginPath()
				// 	mainCtx.arc(
				// 		foe.position.x + this.scene.offset.x,
				// 		foe.position.y + this.scene.offset.y,
				// 		10,
				// 		0,
				// 		2 * Math.PI
				// 	)
				// 	mainCtx.stroke()
				// 	mainCtx.restore()
				// }
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

					// // TODO: Delete this if we have one single background image instead of the same repeating
					// if (animationProgress < 1) {
					// 	const background2TranslateX =
					// 		this.game.gameWidth * animationProgress

					// 	this.battle.active.drawBackground({
					// 		ctx: mainCtx,
					// 		game: this.game,
					// 		offsetX: background2TranslateX,
					// 		offsetY: 0,
					// 	})
					// }

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
						})
					}
				}
			}
		}

		if (this.state.name === 'PLAYER_SELECT_SKILL') {
			const skillSet = this.mapToSkillSet(this.state.characterTurn.role.skills)

			for (let columnIndex = 0; columnIndex < skillSet.length; columnIndex++) {
				for (let rowIndex = 0; rowIndex < skillsPerColumn; rowIndex++) {
					const skillHeight = 50
					const skillWidth = this.game.gameWidth / skillSet.length

					mainCtx.save()
					mainCtx.fillStyle = 'lightgray'

					const lineWidth = 5

					mainCtx.lineWidth = lineWidth
					mainCtx.strokeStyle = 'black'

					mainCtx.fillRect(
						skillWidth * columnIndex,
						skillHeight * rowIndex,
						skillWidth,
						skillHeight
					)
					mainCtx.strokeRect(
						skillWidth * columnIndex + lineWidth / 2,
						skillHeight * rowIndex + lineWidth / 2,
						skillWidth - lineWidth,
						skillHeight - lineWidth
					)
					mainCtx.restore()

					// console.log('skillSet', skillSet)

					const skill = skillSet[columnIndex][rowIndex]

					if (skill) {
						mainCtx.save()

						mainCtx.font = '30px serif'
						mainCtx.textAlign = 'center'

						// if (characterTurnSkills[i] === this.focusedAction) {
						// 	mainCtx.fillStyle = 'yellow'
						// } else {
						mainCtx.fillStyle = 'black'
						// }

						mainCtx.fillText(
							skill.name,
							skillWidth * columnIndex + skillWidth / 2,
							skillHeight * rowIndex + 40
						)

						mainCtx.restore()
					}
				}
			}

			for (let columnIndex = 0; columnIndex < skillSet.length; columnIndex++) {
				for (let rowIndex = 0; rowIndex < skillsPerColumn; rowIndex++) {
					const skillHeight = 50
					const skillWidth = this.game.gameWidth / skillSet.length

					mainCtx.save()

					const lineWidth = 5

					mainCtx.lineWidth = lineWidth
					mainCtx.strokeStyle = 'red'

					if (skillSet[columnIndex][rowIndex] === this.state.focusedSkill) {
						mainCtx.strokeRect(
							skillWidth * columnIndex + lineWidth / 2,
							skillHeight * rowIndex + lineWidth / 2,
							skillWidth - lineWidth,
							skillHeight - lineWidth
						)
					}

					mainCtx.restore()
				}
			}
		}

		// for (let i = 0; i < characterTurnSkills.length; i++) {
		// 	mainCtx.save()

		// 	mainCtx.stroke()
		// 	mainCtx.font = '30px serif'
		// 	mainCtx.textAlign = 'center'

		// 	if (characterTurnSkills[i] === this.focusedAction) {
		// 		mainCtx.fillStyle = 'yellow'
		// 	} else {
		// 		mainCtx.fillStyle = 'black'
		// 	}

		// 	mainCtx.fillText(
		// 		characterTurnSkills[i].name,
		// 		this.game.gameWidth / 2,
		// 		40 * (i + 1)
		// 	)

		// 	mainCtx.restore()
		// }
	}

	// drawSkillBar(ctx: CanvasRenderingContext2D, player: Player) {
	// 	const maxNumberOfSkills = 4
	// 	const skillHeight = 50

	// 	ctx.save()
	// 	ctx.fillStyle = 'grey'

	// 	for (let i = 0; i < maxNumberOfSkills; i++) {
	// 		ctx.fillRect(0 + , 0, this.game.gameWidth, skillBarHeight)
	// 	}

	// 	ctx.restore()

	// 	ctx.fillRect(0, 0, this.game.gameWidth, skillBarHeight)

	// }
}
