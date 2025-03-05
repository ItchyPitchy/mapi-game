import Entity from '../../shared/Entity'
import { Vector } from '../../shared/Vector'
import { Point } from '../../types'
import { Role } from '../Role/Role'
import { SkillEffect } from '../SkillEffect'

export type Actions = {
	stale: ActionState
	walk: ActionState
	hit: ActionState
}

type ActionState = {
	state: 'not-in-use' | 'in-use' | 'complete'
	durationMs: number
	completeMs: number
}

export interface Character extends Entity {
	name: string
	role: Role
	atkBar: number
	lvl: number
	stats: Stats
	effects: SkillEffect[]
	spritesheet: HTMLImageElement
	originalPosition: Point
	vector: Vector
	actions: Actions
	
}

export interface Foe extends Character {
	generateStatsFromLvl: Readonly<(lvl: number) => Stats>
}
