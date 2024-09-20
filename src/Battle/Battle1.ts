import { Battle } from './Battle'
import Zombie from '../Entity/Zombie'
import battle1Bg from '../assets/stockholm_map.png'

export class Battle1 extends Battle {
	constructor() {
		super()

		this.background.src = battle1Bg
		this.foes = [
			new Zombie({ x: 0, y: 0 }, { height: 50, width: 50 }, 100),
			new Zombie({ x: 0, y: 0 }, { height: 50, width: 50 }, 100),
			new Zombie({ x: 0, y: 0 }, { height: 50, width: 50 }, 100),
			new Zombie({ x: 0, y: 0 }, { height: 50, width: 50 }, 100),
			new Zombie({ x: 0, y: 0 }, { height: 50, width: 50 }, 100),
		]
	}
}
