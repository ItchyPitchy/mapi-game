import { Role } from './Role'

export const medic: Role = {
	type: 'medic',
	skills: [
		{
			name: 'Stitch',
			validTarget: ['allies', 'self'],
			numberOfTargets: 1,
			generateSkillEffect: () => ({
				type: 'heal',
				points: 15,
			}),
			unlockLvl: 1,
		},
		{
			name: 'Cut',
			validTarget: ['enemy'],
			numberOfTargets: 2,
			generateSkillEffect: ({ multiplier = 1, fixedBonus = 0 }) => ({
				type: 'damage',
				points: 15 * multiplier + fixedBonus,
			}),
			unlockLvl: 1,
		},
		{
			name: 'Drain Blood',
			validTarget: ['enemy'],
			numberOfTargets: 1,
			generateSkillEffect: () => ({
				type: 'bleed',
				points: 10,
				duration: 3,
			}),
			unlockLvl: 2,
		},
		{
			name: 'Restrain',
			validTarget: ['enemy'],
			numberOfTargets: 1,
			generateSkillEffect: () => ({
				type: 'snare',
				duration: 1,
			}),
			unlockLvl: 3,
		},
		{
			name: 'Drug',
			validTarget: ['enemy'],
			numberOfTargets: 2,
			generateSkillEffect: () => ({
				type: 'confuse',
				duration: 1,
			}),
			unlockLvl: 4,
		},
	],
}
