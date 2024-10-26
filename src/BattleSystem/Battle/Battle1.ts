import Game from '../../game'
import { Battle, BattleSetup } from './Battle'

import battle1Bg from '../../assets/ahlens_map.png'

export class Battle1 extends Battle {
	constructor(game: Game, players: BattleSetup['players']) {
		const background = new Image()
		background.src = battle1Bg

		const battleSetup: BattleSetup = {
			players,
			foes: {
				min: 3,
				max: 4,
				types: [
					{
						type: 'zombie',
						lvl: {
							min: 1,
							max: 2,
						},
					},
					{
						type: 'brute',
						lvl: {
							min: 1,
							max: 2,
						},
					},
				],
			},
		}

		super(game, battleSetup, background)
	}
}
