import { Line } from '../../types'
import Component from './Component'

export class Hitbox extends Component {
	constructor(public relativeHitboxAreas: Line[]) {
		super()
	}
}
