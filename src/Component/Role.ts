import { Constructor } from '../Entity/Entity'
import { Damage } from '../SkillEffects/Damage'
import { Heal } from '../SkillEffects/Heal'
import { SkillEffect } from '../SkillEffects/SKillEffect'
import Component from './Component'

type RoleType = 'archeologist' | 'medic'

export type Skill = {
	name: string
	generateSkillEffect: ({ triggerInMs, multiplier, fixedBonus }: { triggerInMs: number, multiplier?: number, fixedBonus?: number }) => SkillEffect
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
						name: 'Dig',
						generateSkillEffect: ({ triggerInMs, multiplier = 0, fixedBonus = 0 }) => new Damage(10 * multiplier + fixedBonus, triggerInMs),
						unlocked: true,
						unlockLvl: 0,
					},
					{
						name: 'Throw Dirt',
						generateSkillEffect: ({ triggerInMs, multiplier = 0, fixedBonus = 0 }) => new Damage(10 * multiplier + fixedBonus, triggerInMs),
						unlocked: true,
						unlockLvl: 0,
					},
				]
			}
			case 'medic': {
				return [
					{
						name: 'Stitch',
						generateSkillEffect: ({ triggerInMs, multiplier = 0, fixedBonus = 0 }) => new Heal(20 * multiplier + fixedBonus, triggerInMs),
						unlocked: true,
						unlockLvl: 0,
					},
					{
						name: 'Cut',
						generateSkillEffect: ({ triggerInMs, multiplier = 0, fixedBonus = 0 }) => new Damage(15 * multiplier + fixedBonus, triggerInMs),
						unlocked: true,
						unlockLvl: 0,
					},
					{
						name: 'assad',
						generateSkillEffect: ({ triggerInMs, multiplier = 0, fixedBonus = 0 }) => new Heal(20 * multiplier + fixedBonus, triggerInMs),
						unlocked: true,
						unlockLvl: 0,
					},
					{
						name: 'dsadas',
						generateSkillEffect: ({ triggerInMs, multiplier = 0, fixedBonus = 0 }) => new Damage(15 * multiplier + fixedBonus, triggerInMs),
						unlocked: true,
						unlockLvl: 0,
					},
				]
			}
		}
	}
}
