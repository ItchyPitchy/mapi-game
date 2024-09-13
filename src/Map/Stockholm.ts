import { Battle } from '../Battle/Battle'
import { Battle1 } from '../Battle/Battle1'
import { Constructor } from '../Entity/Entity'
import stockholmMap from '../assets/stockholm_map.png'
import { Point } from '../types'

enum StopType {
	BATTLE,
}

type LevelStop = {
	x: number
	y: number
} & {
	type: StopType
	battle: Battle
}

export class Stockholm {
	texture: HTMLImageElement
	stops: LevelStop[] = [
		{
			type: StopType.BATTLE,
			battle: new Battle1(),
			x: 577,
			y: 206,
		},
		{
			type: StopType.BATTLE,
			battle: new Battle1(),
			x: 548,
			y: 252,
		},
		{
			type: StopType.BATTLE,
			battle: new Battle1(),
			x: 467,
			y: 310,
		},
		{
			type: StopType.BATTLE,
			battle: new Battle1(),
			x: 493,
			y: 376,
		},
		{
			type: StopType.BATTLE,
			battle: new Battle1(),
			x: 335,
			y: 384,
		},
		{
			type: StopType.BATTLE,
			battle: new Battle1(),
			x: 362,
			y: 460,
		},
		{
			type: StopType.BATTLE,
			battle: new Battle1(),
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
