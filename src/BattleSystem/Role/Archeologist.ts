import { Role } from './Role'

export const archeologist: Role = {
	type: 'archeologist',
	skills: [
		{
			name: 'Hit',
			validTarget: ['enemy'],
			numberOfTargets: 1,
			generateSkillEffect: ({ multiplier = 1, fixedBonus = 0 }) => ({
				type: 'damage',
				points: 10 * multiplier + fixedBonus,
			}),
			unlockLvl: 1,
		},
		{
			name: 'Throw Dirt',
			validTarget: ['enemy'],
			numberOfTargets: 1,
			generateSkillEffect: () => ({
				type: 'blind',
				duration: 2,
			}),
			unlockLvl: 1,
		},
		{
			name: 'Examine',
			validTarget: ['enemy'],
			numberOfTargets: -1,
			generateSkillEffect: () => ({
				type: 'weaken',
				duration: 1,
			}),
			unlockLvl: 2,
		},
		{
			name: 'Dig',
			validTarget: ['allies'],
			numberOfTargets: 1,
			generateSkillEffect: () => ({
				type: 'evade',
				duration: 2,
			}),
			unlockLvl: 3,
		},
	],
}
