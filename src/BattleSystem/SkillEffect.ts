export type SkillEffect =
	| Damage
	| Heal
	| Bleed
	| Confusion
	| Snare
	| Weakness
	| Blind
	| Evade

type Damage = {
	type: 'damage'
	points: number
}

type Heal = {
	type: 'heal'
	points: number
}

type Bleed = {
	type: 'bleed'
	points: number
	duration: number
}

type Confusion = {
	type: 'confuse'
	duration: number
}

type Snare = {
	type: 'snare'
	duration: number
}

type Weakness = {
	type: 'weaken'
	duration: number
}

type Blind = {
	type: 'blind'
	duration: number
}

type Evade = {
	type: 'evade'
	duration: number
}
