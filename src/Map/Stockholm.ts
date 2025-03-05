import { Battle, BattleSetup } from '../BattleSystem/Battle/Battle'
import stockholmMap from '../assets/stockholm_map.png'
import { Point } from '../types'
import { Battle1 } from '../BattleSystem/Battle/Battle1'
import Game from '../game'
import { level1Setup } from '../MarioSystem/Levels/Level1'
import { LevelSetup } from '../MarioSystem/Levels/Level'

export enum StopType {
	BATTLE,
	MARIO,
}

type LevelStop = {
	x: number
	y: number
} & ({
	type: StopType.BATTLE
	setupBattle(_: { game: Game; players: BattleSetup['players'] }): Battle
} | {
	type: StopType.MARIO
	levelSetup: LevelSetup
})

export class Stockholm {
	texture: HTMLImageElement
	stops: LevelStop[] = [
		{
			type: StopType.BATTLE,
			setupBattle: (setup) => new Battle1(setup.game, setup.players),
			x: 577,
			y: 206,
		},
		{
			type: StopType.MARIO,
			levelSetup: level1Setup,
			x: 548,
			y: 252,
		},
		{
			type: StopType.BATTLE,
			setupBattle: (setup) => new Battle1(setup.game, setup.players),
			x: 467,
			y: 310,
		},
		{
			type: StopType.BATTLE,
			setupBattle: (setup) => new Battle1(setup.game, setup.players),
			x: 493,
			y: 376,
		},
		{
			type: StopType.BATTLE,
			setupBattle: (setup) => new Battle1(setup.game, setup.players),
			x: 335,
			y: 384,
		},
		{
			type: StopType.BATTLE,
			setupBattle: (setup) => new Battle1(setup.game, setup.players),
			x: 362,
			y: 460,
		},
		{
			type: StopType.BATTLE,
			setupBattle: (setup) => new Battle1(setup.game, setup.players),
			x: 430,
			y: 452,
		},
	]
	currentStop = this.stops[0]
	player: {
		originPos: Point
		queue: Point[]
	} = {
		originPos: {
			x: this.stops[0].x,
			y: this.stops[0].y,
		},
		queue: [],
	}

	constructor() {
		const texture = new Image()
		texture.src = stockholmMap
		this.texture = texture
	}
}
