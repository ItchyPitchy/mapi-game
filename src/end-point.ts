import { Point } from './point'
import { Segment } from './segment'

export class EndPoint extends Point {
	public beginsSegment: boolean | null = null
	public angle: number | null = null

	constructor(public x: number, public y: number, public segment: Segment) {
		super(x, y)
	}
}
