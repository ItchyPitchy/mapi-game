import { Skill } from '../Component/Role'
import Foe from '../Entity/Foe'
import Player from '../Entity/Player'

type GetFoesReturnType = Array<{
	construct: typeof Foe
	size: { height: number; width: number }
	hp: number
}>

export enum BattleId {
	BATTLE_1,
	BATTLE_2,
}

export type Action = {
	skill: Skill
	targets: Array<Foe | Player>
}

export class Battle {
	public foes: Foe[] = []
	public players: Player[] = []
	public selectedAction: Action | null = null

	constructor(
		readonly id: BattleId,
		readonly background: HTMLImageElement,
		optional?: { foes?: Foe[]; players?: Player[] }
	) {
		if (optional?.foes) this.foes = optional.foes
		if (optional?.players) this.players = optional.players
	}

	getFoes(): GetFoesReturnType {
		throw new Error('#loadFoes is not implemented yet!')
	}

	clone() {
		return new Battle(this.id, this.background, {
			foes: this.foes,
			players: this.players,
		})
	}
}
