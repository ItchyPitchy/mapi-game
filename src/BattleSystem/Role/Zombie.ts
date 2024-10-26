import { Role } from './Role'

export const zombie: Role = {
	type: 'zombie',
	skills: [
		{
			name: 'Scratch',
			validTarget: ['enemy'],
			numberOfTargets: 1,
			generateSkillEffect: ({ multiplier = 0, fixedBonus = 0 }) => ({
				type: 'damage',
				points: 15 * multiplier + fixedBonus,
			}),
			unlockLvl: 1,
		},
	],
}
