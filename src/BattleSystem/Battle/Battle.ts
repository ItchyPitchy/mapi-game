import { getRandomIntInclusive } from '../../shared/helperFunctions/math'

import Game from '../../game'
import { Character, Foe } from '../Entity/Character'
import { Zombie } from '../Entity/Zombie'
import { Mami } from '../Entity/Mami'
import { Papi } from '../Entity/Papi'

type FoeType = 'zombie' | 'brute'
type PlayerName = 'mami' | 'papi'

export type BattleSetup = {
	players: Array<{
		name: PlayerName
		lvl: number
		stats: Stats
	}>
	foes: {
		min: number
		max: number
		types: Array<{
			type: FoeType
			lvl: {
				min: number
				max: number
			}
		}>
	}
}

export class Battle {
	public foes
	public players

	constructor(
		game: Game,
		setup: BattleSetup,
		public background: HTMLImageElement
	) {
		this.foes = this.generateFoes(game, setup.foes)
		this.players = this.generatePlayers(game, setup.players)
	}

	private generateFoes(game: Game, foes: BattleSetup['foes']): Foe[] {
		const numberOfFoes = getRandomIntInclusive(foes.min, foes.max)
		const foeSetup: Array<{ type: FoeType; lvl: number }> = []

		for (let i = 0; i < numberOfFoes; i++) {
			const randIndex = Math.floor(Math.random() * foes.types.length)
			const foe = foes.types[randIndex]

			if (!foe) continue

			const foeLvl = getRandomIntInclusive(foe.lvl.min, foe.lvl.max)

			foeSetup.push({ type: foe.type, lvl: foeLvl })
		}

		const mapHeight = game.gameHeight
		const oneThirdMapHeight = mapHeight / 3
		const maxCharacterPerColumn = 3

		const foesInLastColumn =
			foeSetup.length % maxCharacterPerColumn === 0
				? maxCharacterPerColumn
				: foeSetup.length % maxCharacterPerColumn

		return foeSetup.map((foe, index) => {
			const column = Math.floor(index / maxCharacterPerColumn) + 1
			const isLastColumn =
				Math.ceil(foeSetup.length / maxCharacterPerColumn) === column
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

			switch (foe.type) {
				case 'zombie': {
					return new Zombie(foe.lvl, { x: posX, y: posY })
				}
				case 'brute': {
					return new Zombie(foe.lvl, { x: posX, y: posY }) // TODO: Change to Brute once implemented
				}
			}
		})
	}

	private generatePlayers(
		game: Game,
		players: BattleSetup['players']
	): Character[] {
		const mapHeight = game.gameHeight
		const oneThirdMapHeight = mapHeight / 3
		const maxCharacterPerColumn = 3

		const playersInLastColumn =
			players.length % maxCharacterPerColumn === 0
				? maxCharacterPerColumn
				: players.length % maxCharacterPerColumn

		return players.map((player, index) => {
			const column = Math.floor(index / maxCharacterPerColumn) + 1
			const isLastColumn =
				Math.ceil(players.length / maxCharacterPerColumn) === column
			const charactersInColumn = isLastColumn ? playersInLastColumn : 3
			const heightPerCharacter = oneThirdMapHeight / charactersInColumn

			const posY =
				heightPerCharacter * (index % maxCharacterPerColumn) +
				heightPerCharacter / 2 +
				oneThirdMapHeight * 2
			const posX =
				game.gameWidth -
				70 * column -
				(index % maxCharacterPerColumn) * (60 / charactersInColumn)

			switch (player.name) {
				case 'mami': {
					return new Mami(player.lvl, player.stats, { x: posX, y: posY })
				}
				case 'papi': {
					return new Papi(player.lvl, player.stats, { x: posX, y: posY })
				}
			}
		})
	}

	public drawBackground({
		game,
		ctx,
		offsetX = 0,
		offsetY = 0,
	}: {
		game: Game
		ctx: CanvasRenderingContext2D
		offsetX?: number
		offsetY?: number
	}) {
		const hRatio = game.gameWidth / this.background.width
		const vRatio = game.gameHeight / this.background.height
		const ratio = Math.min(hRatio, vRatio)
		const screenOffsetX = (game.gameWidth - this.background.width * ratio) / 2
		const screenOffsetY = (game.gameHeight - this.background.height * ratio) / 2

		ctx.translate(offsetX, offsetY)

		ctx.drawImage(
			this.background,
			0,
			0,
			this.background.width,
			this.background.height,
			screenOffsetX,
			screenOffsetY,
			this.background.width * ratio,
			this.background.height * ratio
		)

		ctx.resetTransform()
	}
}
