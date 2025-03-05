export type SkillEffect =
	| Damage
	| Heal
	| Bleed
	| Confusion
	| Snare
	| Weakness
	| Blind
	| Evade

export type Damage = {
	type: 'damage'
	points: number
}

export type Heal = {
	type: 'heal'
	points: number
}

export type Bleed = {
	type: 'bleed'
	points: number
	duration: number
}

export type Confusion = {
	type: 'confuse'
	duration: number
}

export type Snare = {
	type: 'snare'
	duration: number
}

export type Weakness = {
	type: 'weaken'
	duration: number
}

export type Blind = {
	type: 'blind'
	duration: number
}

export type Evade = {
	type: 'evade'
	duration: number
}
