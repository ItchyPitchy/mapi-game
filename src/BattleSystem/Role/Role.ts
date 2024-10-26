import { SkillEffect } from '../SkillEffect'
import { archeologist } from './Archeologist'
import { medic } from './Medic'
import { zombie } from './Zombie'

type RoleType = 'archeologist' | 'medic' | 'zombie'

export type Skill = Readonly<{
	name: string
	generateSkillEffect: ({
		multiplier,
		fixedBonus,
	}: {
		multiplier?: number
		fixedBonus?: number
	}) => SkillEffect
	unlockLvl: number
	validTarget: Array<'self' | 'allies' | 'enemy'>
	numberOfTargets: -1 | 1 | 2 | 3 | 4 | 5 | 6
}>

export type Role = Readonly<{
	type: RoleType
	skills: Skill[]
}>

export const role: Record<RoleType, Role> = {
	archeologist,
	medic,
	zombie,
}
