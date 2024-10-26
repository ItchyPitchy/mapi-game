import Entity from '../../shared/Entity'
import { Role } from '../Role/Role'
import { SkillEffect } from '../SkillEffect'

export interface Character extends Entity {
	name: string
	role: Role
	hp: number
	lvl: number
	stats: Stats
	effects: SkillEffect[]
	spritesheet: HTMLImageElement
}

export interface Foe extends Character {
	generateStatsFromLvl: Readonly<(lvl: number) => Stats>
}
