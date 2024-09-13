import { Battle, BattleId } from './Battle'
import battle1Bg from '../assets/stockholm_map.png'
import Zombie from '../Entity/Zombie'

export class Battle1 extends Battle {
	constructor() {
		const bg = new Image()
		bg.src = battle1Bg

		super(BattleId.BATTLE_1, bg)
	}

	getFoes() {
		return [
			{
				construct: Zombie,
				size: { height: 50, width: 50 },
				hp: 100,
			},
			{
				construct: Zombie,
				size: { height: 50, width: 50 },
				hp: 100,
			},
			{
				construct: Zombie,
				size: { height: 50, width: 50 },
				hp: 100,
			},
			{
				construct: Zombie,
				size: { height: 50, width: 50 },
				hp: 100,
			},
			{
				construct: Zombie,
				size: { height: 50, width: 50 },
				hp: 100,
			},
			{
				construct: Zombie,
				size: { height: 50, width: 50 },
				hp: 100,
			},
		]

		// if (foes.length !== foePositions.length) {
		// 	throw new Error(
		// 		'#loadFoes: Number of foes and foe positions provided did not match'
		// 	)
		// }

		// this.foes = foePositions.map((position, index) => {
		// 	const foe = foes[index]
		// 	return new foe.construct(position, foe.size, foe.hp)
		// })
	}
}
