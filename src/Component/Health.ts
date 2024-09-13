import { Line } from '../types'
import Component from './Component'

export class Health extends Component {
	constructor(public hp: number) {
		super()
	}
}
