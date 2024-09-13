import Game, { Input } from './game'
import { Action, Battle } from './Battle/Battle'
import { Battle1 } from './Battle/Battle1'
import Player from './Entity/Player'
import Foe from './Entity/Foe'
import { Vector } from './Component/Vector'
import { Health } from './Component/Health'
import { Role, Skill, SkillType } from './Component/Role'

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

type Scene = {
	ratio: number
	offset: {
		x: number
		y: number
	}
}

type State =
	| {
			name: 'ENEMY_TURN'
			characterTurn: Foe
	  }
	| {
			name: 'PLAYER_SELECT_SKILL'
			characterTurn: Player
			focusedSkill: Skill
	  }
	| {
			name: 'PLAYER_SELECT_TARGET'
			characterTurn: Player
			focusedTarget: Foe | Player
	  }
	| {
			name: 'SLEEP'
	  }

export class BattleScene {
	scene: Scene | null = null
	battles: Battle[] = [new Battle1()]
	activeBattle: Battle | null = null
	state: State = { name: 'SLEEP' }
	animations: Animation[] = [
		{
			type: 'commence-battle',
			durationMs: 1200,
			timePassedMs: 0,
		},
	]

	constructor(readonly game: Game) {}

	setupBattle() {
		if (!this.activeBattle) {
			throw new Error(
				'#setupBattle was called but activeBattle has not been set yet!'
			)
		}

		this.loadScene()

		if (this.scene === null) throw new Error('Failed loading scene!')

		const battleFoes = this.activeBattle.getFoes()

		const mapHeight = this.game.gameHeight - this.scene.offset.y * 2
		const oneThirdMapHeight = mapHeight / 3
		const maxCharacterPerColumn = 3

		const foesInLastColumn =
			battleFoes.length % maxCharacterPerColumn === 0
				? maxCharacterPerColumn
				: battleFoes.length % maxCharacterPerColumn

		this.activeBattle.foes = battleFoes.map((foe, index) => {
			const column = Math.floor(index / maxCharacterPerColumn) + 1
			const isLastColumn =
				Math.ceil(battleFoes.length / maxCharacterPerColumn) === column
			const charactersInColumn = isLastColumn ? foesInLastColumn : 3
			const heightPerCharacter = oneThirdMapHeight / charactersInColumn

			const posY =
				heightPerCharacter * (index % maxCharacterPerColumn) +
				heightPerCharacter / 2 +
				oneThirdMapHeight * 2
			const posX =
				40 +
				70 * column -
				(index % maxCharacterPerColumn) * (60 / charactersInColumn)

			return new foe.construct({ x: posX, y: posY }, foe.size, foe.hp)
		})

		const playersInLastColumn =
			this.game.players.length % maxCharacterPerColumn === 0
				? maxCharacterPerColumn
				: this.game.players.length % maxCharacterPerColumn

		this.game.players.forEach((player, index) => {
			const column = Math.floor(index / maxCharacterPerColumn) + 1
			const isLastColumn =
				Math.ceil(this.game.players.length / maxCharacterPerColumn) === column
			const charactersInColumn = isLastColumn ? playersInLastColumn : 3
			const heightPerCharacter = oneThirdMapHeight / charactersInColumn

			const posY =
				heightPerCharacter * (index % maxCharacterPerColumn) +
				heightPerCharacter / 2 +
				oneThirdMapHeight * 2
			const posX =
				this.game.gameWidth -
				70 * column -
				(index % maxCharacterPerColumn) * (60 / charactersInColumn)

			player.originPosition = { x: posX, y: posY }
			player.position = { x: posX, y: posY }
		})
	}

	loadScene() {
		if (!this.activeBattle) return

		const hRatio = this.game.gameWidth / this.activeBattle.background.width
		const vRatio = this.game.gameHeight / this.activeBattle.background.height
		const ratio = Math.min(hRatio, vRatio)
		const offsetX =
			(this.game.gameWidth - this.activeBattle.background.width * ratio) / 2
		const offsetY =
			(this.game.gameHeight - this.activeBattle.background.height * ratio) / 2

		this.scene = {
			ratio,
			offset: {
				x: offsetX,
				y: offsetY,
			},
		}
	}

	update(dt: number) {
		if (!this.activeBattle) return

		const outcome = this.updateAnimations(dt)

		if (
			outcome.deleted.some((animation) => animation.type === 'commence-battle')
		) {
			this.state = this.calculateNextState()
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
									this.state.characterTurn.getComponent(Role).skills
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
									this.state.characterTurn.getComponent(Role).skills
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
									this.state.characterTurn.getComponent(Role).skills
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
									this.state.characterTurn.getComponent(Role).skills
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
								this.activeBattle.selectedAction = {
									skill: this.state.focusedSkill,
									targets: [],
								}

								this.state = {
									name: 'PLAYER_SELECT_TARGET',
									characterTurn: this.state.characterTurn,
									focusedTarget: this.activeBattle.foes[0],
								}

								break
							}
						}

						break
					}
					case 'PLAYER_SELECT_TARGET': {
						const selectableTargets = [
							...this.game.players,
							...this.activeBattle.foes,
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
								if (!this.activeBattle.selectedAction) {
									console.log('#this.activeBattle.selectedAction is null!')
									break
								}

								this.activeBattle.selectedAction.targets.push(
									this.state.focusedTarget
								)

								this.executeAction(this.activeBattle.selectedAction)

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

	calculateNextState(): State {
		const playerSkills = this.game.players[0].getComponent(Role).skills

		return {
			name: 'PLAYER_SELECT_SKILL',
			characterTurn: this.game.players[0],
			focusedSkill: playerSkills[0],
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

		console.log('skillList', skillList)

		const numberOfSkillColumns = skillList.length / skillsPerColumn
		const skillSet: (Skill | null)[][] = []

		for (let i = 0; i < numberOfSkillColumns; i++) {
			skillSet.push(skillList.slice(i * skillsPerColumn, skillsPerColumn))
		}

		console.log('skillSet', skillSet)

		return skillSet
	}

	executeAction(action: Action) {
		if (!action.skill.unlocked) return

		switch (action.skill.type) {
			case SkillType.DAMAGE: {
				// TODO: Do not hardcode the hp loss&gain!
				action.targets.forEach((target) => {
					target.getComponent(Health).hp -= 40 // action.skill.
				})
				break
			}
			case SkillType.HEAL: {
				// TODO: Do not hardcode the hp loss&gain!
				action.targets.forEach((target) => {
					target.getComponent(Health).hp += 40 // action.skill.
				})
				break
			}
		}
	}

	draw(mainCtx: CanvasRenderingContext2D) {
		if (!this.activeBattle || !this.scene) return

		mainCtx.clearRect(0, 0, this.game.gameWidth, this.game.gameHeight)

		if (
			!this.animations.some((animation) => animation.type === 'commence-battle')
		) {
			this.drawImageWithOffset({
				context: mainCtx,
				background: this.activeBattle.background,
				scene: this.scene,
			})

			for (const foe of this.activeBattle.foes) {
				this.drawFoeWithOffset({
					context: mainCtx,
					scene: this.scene,
					posX: foe.position.x,
					posY: foe.position.y,
				})

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

				if (
					this.state.name === 'PLAYER_SELECT_TARGET' &&
					this.state.focusedTarget === foe
				) {
					mainCtx.save()
					mainCtx.strokeStyle = 'yellow'
					mainCtx.beginPath()
					mainCtx.arc(
						foe.position.x + this.scene.offset.x,
						foe.position.y + this.scene.offset.y,
						10,
						0,
						2 * Math.PI
					)
					mainCtx.stroke()
					mainCtx.restore()
				}
			}

			for (const player of this.game.players) {
				this.drawPlayerWithOffset({
					context: mainCtx,
					scene: this.scene,
					posX: player.position.x,
					posY: player.position.y,
				})

				// if (
				// 	this.activeBattle.selectedAction &&
				// 	this.activeBattle.selectedAction.targets.some(
				// 		(target) => target === player
				// 	)
				// ) {
				// 	mainCtx.save()
				// 	mainCtx.strokeStyle = 'black'
				// 	mainCtx.beginPath()
				// 	mainCtx.arc(
				// 		player.position.x + this.scene.offset.x,
				// 		player.position.y + this.scene.offset.y,
				// 		10,
				// 		0,
				// 		2 * Math.PI
				// 	)
				// 	mainCtx.stroke()
				// 	mainCtx.restore()
				// }

				if (
					this.state.name === 'PLAYER_SELECT_TARGET' &&
					this.state.focusedTarget === player
				) {
					mainCtx.save()
					mainCtx.strokeStyle = 'yellow'
					mainCtx.beginPath()
					mainCtx.arc(
						player.position.x + this.scene.offset.x,
						player.position.y + this.scene.offset.y,
						10,
						0,
						2 * Math.PI
					)
					mainCtx.stroke()
					mainCtx.restore()
				}
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

					this.drawImageWithOffset({
						context: mainCtx,
						background: this.activeBattle.background,
						scene: this.scene,
						offsetX: background1TranslateX,
						offsetY: 0,
					})

					// TODO: Delete this if we have one single background image instead of the same repeating
					if (animationProgress < 1) {
						const background2TranslateX =
							this.game.gameWidth * animationProgress

						this.drawImageWithOffset({
							context: mainCtx,
							background: this.activeBattle.background,
							scene: this.scene,
							offsetX: background2TranslateX,
							offsetY: 0,
						})
					}

					const characterTranslateX =
						this.game.gameWidth - this.game.gameWidth * animationProgress

					for (const foe of this.activeBattle.foes) {
						this.drawFoeWithOffset({
							context: mainCtx,
							scene: this.scene,
							posX: foe.position.x,
							posY: foe.position.y,
							offsetX: characterTranslateX,
							offsetY: 0,
						})
					}

					for (const player of this.game.players) {
						this.drawPlayerWithOffset({
							context: mainCtx,
							scene: this.scene,
							posX: player.position.x,
							posY: player.position.y,
							offsetX: characterTranslateX,
							offsetY: 0,
						})
					}
				}
			}
		}

		if (this.state.name === 'PLAYER_SELECT_SKILL') {
			const skillSet = this.mapToSkillSet(
				this.state.characterTurn.getComponent(Role).skills
			)

			for (let columnIndex = 0; columnIndex < skillSet.length; columnIndex++) {
				for (let rowIndex = 0; rowIndex < skillsPerColumn; rowIndex++) {
					const skillHeight = 50
					const skillWidth = this.game.gameWidth / skillSet.length

					mainCtx.save()
					mainCtx.fillStyle = 'lightgray'

					if (skillSet[columnIndex][rowIndex] === this.state.focusedSkill) {
						mainCtx.strokeStyle = 'red'
					} else {
						mainCtx.strokeStyle = 'black'
					}

					mainCtx.fillRect(
						skillWidth * columnIndex,
						skillHeight * rowIndex,
						skillWidth,
						skillHeight
					)
					mainCtx.strokeRect(
						skillWidth * columnIndex,
						skillHeight * rowIndex,
						skillWidth,
						skillHeight
					)
					mainCtx.restore()

					// console.log('skillSet', skillSet)

					const skill = skillSet[columnIndex][rowIndex]

					if (skill) {
						mainCtx.save()

						mainCtx.stroke()
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

	drawImageWithOffset({
		context,
		background,
		scene,
		offsetX = 0,
		offsetY = 0,
	}: {
		context: CanvasRenderingContext2D
		background: HTMLImageElement
		scene: Scene
		offsetX?: number
		offsetY?: number
	}) {
		context.translate(offsetX, offsetY)

		context.drawImage(
			background,
			0,
			0,
			background.width,
			background.height,
			scene.offset.x,
			scene.offset.y,
			background.width * scene.ratio,
			background.height * scene.ratio
		)

		context.resetTransform()
	}

	// TODO: This is temporary, this will eventually be an image
	drawFoeWithOffset({
		context,
		scene,
		posX,
		posY,
		offsetX = 0,
		offsetY = 0,
	}: {
		context: CanvasRenderingContext2D
		scene: Scene
		posX: number
		posY: number
		offsetX?: number
		offsetY?: number
	}) {
		context.save()
		context.translate(offsetX, offsetY)

		context.fillStyle = 'red'
		context.beginPath()
		context.arc(
			posX + scene.offset.x,
			posY + scene.offset.y,
			10,
			0,
			2 * Math.PI
		)
		context.fill()

		context.resetTransform()
		context.restore()
	}

	// TODO: This is temporary, this will eventually be an image
	drawPlayerWithOffset({
		context,
		scene,
		posX,
		posY,
		offsetX = 0,
		offsetY = 0,
	}: {
		context: CanvasRenderingContext2D
		scene: Scene
		posX: number
		posY: number
		offsetX?: number
		offsetY?: number
	}) {
		context.translate(offsetX, offsetY)

		context.save()
		context.fillStyle = 'green'
		context.beginPath()
		context.arc(
			posX + scene.offset.x,
			posY + scene.offset.y,
			10,
			0,
			2 * Math.PI
		)
		context.fill()
		context.restore()

		context.resetTransform()
	}
}