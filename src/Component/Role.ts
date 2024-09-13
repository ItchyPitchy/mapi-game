import { Constructor } from '../Entity/Entity'
import Component from './Component'

type RoleType = 'archeologist' | 'medic'

export enum SkillType {
	HEAL,
	DAMAGE,
	DEBUFF,
	BUFF,
}

export type Skill = HealSkill | DamageSkill | BuffSkill | DebuffSkill

type HealSkill = {
	type: SkillType.HEAL
	name: string
	points: number
	unlocked: boolean
	unlockLvl: number
}

type CutSkill = {
	type: SkillType.DAMAGE
	name: string
	points: number
	unlocked: boolean
	unlockLvl: number
}

type DamageSkill = {
	type: SkillType.DAMAGE
	name: string
	points: number
	unlocked: boolean
	unlockLvl: number
}

type DebuffSkill = {
	type: SkillType.DEBUFF
	name: string
	effect: Constructor<Component>
	unlocked: boolean
	unlockLvl: number
}

type BuffSkill = {
	type: SkillType.BUFF
	name: string
	effect: Constructor<Component>
	unlocked: boolean
	unlockLvl: number
}

export class Role extends Component {
	public skills: Skill[]

	constructor(readonly type: RoleType) {
		super()

		this.skills = this.generateRoleSkills(type)
	}

	private generateRoleSkills(role: RoleType): Skill[] {
		switch (role) {
			case 'archeologist': {
				return [
					{
						type: SkillType.DAMAGE,
						name: 'Dig',
						points: 10,
						unlocked: true,
						unlockLvl: 0,
					},
					{
						type: SkillType.DAMAGE,
						name: 'Throw Dirt',
						points: 10,
						unlocked: true,
						unlockLvl: 0,
					},
				]
			}
			case 'medic': {
				return [
					{
						type: SkillType.HEAL,
						name: 'Stitch',
						points: 20,
						unlocked: true,
						unlockLvl: 0,
					},
					{
						type: SkillType.DAMAGE,
						name: 'Cut',
						points: 15,
						unlocked: true,
						unlockLvl: 0,
					},
					{
						type: SkillType.HEAL,
						name: 'assad',
						points: 20,
						unlocked: true,
						unlockLvl: 0,
					},
					{
						type: SkillType.DAMAGE,
						name: 'dsadas',
						points: 15,
						unlocked: true,
						unlockLvl: 0,
					},
				]
			}
		}
	}
}
