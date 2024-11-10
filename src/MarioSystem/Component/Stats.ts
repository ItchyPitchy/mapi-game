import { Component } from './Component'

export interface IStats {
	strength: number
	dexterity: number
	intelligence: number
	hp: number
	mana: number
	speed: number
	maxHp: number
	maxMana: number
}

export class Stats extends Component implements IStats {
	public strength: number
	public dexterity: number
	public intelligence: number
	public hp: number
	public mana: number
	public speed: number
	public maxHp: number
	public maxMana: number

	constructor(stats: Omit<IStats, 'maxHp' | 'maxMana'>) {
		super()

		this.strength = stats.strength
		this.dexterity = stats.dexterity
		this.intelligence = stats.intelligence
		this.hp = stats.hp
		this.maxHp = stats.hp
		this.mana = stats.mana
		this.maxMana = stats.mana
		this.speed = stats.speed
	}
}
