import Game from '../../game.js'
import { System } from './System.js'
import { Entity } from '../Entity/Entity.js'
import { Player } from '../Entity/Player/Player.js'
import { PlayerInputHandler, TranslatedAction } from './PlayerInputHandler.js'
import { Collidable } from '../Component/Collidable.js'

export class PlayerSystem extends System {
	inputHandler = new PlayerInputHandler()

	constructor() {
		super()
	}

	appliesTo(entity: Entity) {
		return entity instanceof Player
	}

	update(game: Game, entities: Entity[], dt: number) {
		for (const entity of entities) {
			// Would never happen if called with appliesTo before calling update
			if (!(entity instanceof Player))
				throw new Error('#update called with non Player instance')

			this.updateActionTimers(entity, dt)

			// 1. Reset player states based on input

			const actions = this.inputHandler.getActions(entity)

			const walkActions: TranslatedAction[] = ['walk-left', 'walk-right']
			const sprintActions: TranslatedAction[] = ['sprint-left', 'sprint-right']

			if (
				![...walkActions, ...sprintActions].some((action) =>
					actions.has(action)
				) &&
				entity.hasComponent(Collidable) &&
				entity.getComponent(Collidable).collisionBottom
			) {
				entity.vector.x = 0
			}

			if (!walkActions.some((action) => actions.has(action))) {
				entity.actions.walk.state = 'not-in-use'
				entity.actions.walk.durationMs = 0
			}

			if (!sprintActions.some((action) => actions.has(action))) {
				entity.actions.sprint.state = 'not-in-use'
				entity.actions.sprint.durationMs = 0
			}

			if (!actions.has('crouch')) {
				entity.actions.crouch.state = 'not-in-use'
				entity.actions.crouch.durationMs = 0
			}

			// 2. Update player state based on action states

			if (
				entity.hasComponent(Collidable) &&
				entity.getComponent(Collidable).collisionBottom
			) {
				entity.actions.ascend.state = 'not-in-use'
				entity.actions.ascend.durationMs = 0
				entity.actions.descend.state = 'not-in-use'
				entity.actions.descend.durationMs = 0
			}

			if (entity.actions.jump.state === 'complete') {
				entity.vector.y = -600
				entity.actions.ascend.state = 'in-use'

				if (entity.direction === 'left') {
					entity.vector.x = -200
				}

				if (entity.direction === 'right') {
					entity.vector.x = 200
				}
			}

			if (entity.actions.draw.state === 'complete') {
				entity.weapon.state = 'drawn'
			}

			if (
				entity.hasComponent(Collidable) &&
				!entity.getComponent(Collidable).collisionBottom &&
				entity.vector.y > 0
			) {
				entity.actions.descend.state = 'in-use'
			}

			// 3. Validate input and execute actions

			if (actions.has('walk-left')) {
				if (
					entity.hasComponent(Collidable) &&
					entity.getComponent(Collidable).collisionBottom
				) {
					entity.direction = 'left'
					entity.vector.x = -250
					entity.actions.walk.state = 'in-use'
				}
			}

			if (actions.has('sprint-left')) {
				if (
					entity.hasComponent(Collidable) &&
					entity.getComponent(Collidable).collisionBottom
				) {
					entity.direction = 'left'
					entity.vector.x = -500
					entity.actions.sprint.state = 'in-use'
				}
			}

			if (actions.has('walk-right')) {
				if (
					entity.hasComponent(Collidable) &&
					entity.getComponent(Collidable).collisionBottom
				) {
					entity.direction = 'right'
					entity.vector.x = 250
					entity.actions.walk.state = 'in-use'
				}
			}

			if (actions.has('sprint-right')) {
				if (
					entity.hasComponent(Collidable) &&
					entity.getComponent(Collidable).collisionBottom
				) {
					entity.direction = 'right'
					entity.vector.x = 500
					entity.actions.sprint.state = 'in-use'
				}
			}

			if (actions.has('jump')) {
				if (
					entity.hasComponent(Collidable) &&
					entity.getComponent(Collidable).collisionBottom
				) {
					entity.actions.jump.state = 'in-use'
				}
			}

			if (actions.has('leap')) {
				if (
					entity.hasComponent(Collidable) &&
					entity.getComponent(Collidable).collisionBottom
				) {
					entity.actions.jump.state = 'in-use'
				}
			}

			if (actions.has('draw-weapon')) {
				if (
					entity.hasComponent(Collidable) &&
					entity.getComponent(Collidable).collisionBottom
				) {
					entity.actions.draw.state = 'in-use'
				}
			}

			if (actions.has('stowe-weapon')) {
				if (
					entity.hasComponent(Collidable) &&
					entity.getComponent(Collidable).collisionBottom
				) {
					entity.actions.stowe.state = 'in-use'
					entity.weapon.state = 'not-drawn'
				}
			}

			this.resetCompletedActions(entity)
		}
	}

	/** Updates all player actions that are currently in-use and adds
	 * dt to the duration of those actions. Changes state if duration surpasses actions completion time */
	updateActionTimers(player: Player, dt: number) {
		// Would really love if we could do this in a loop; Object.entries destroys the type
		if (player.actions.walk.state === 'in-use')
			player.actions.walk.durationMs += dt * 1000
		if (player.actions.sprint.state === 'in-use')
			player.actions.sprint.durationMs += dt * 1000
		if (player.actions.draw.state === 'in-use')
			player.actions.draw.durationMs += dt * 1000
		if (player.actions.stowe.state === 'in-use')
			player.actions.stowe.durationMs += dt * 1000
		if (player.actions.jump.state === 'in-use')
			player.actions.jump.durationMs += dt * 1000
		if (player.actions.crouch.state === 'in-use')
			player.actions.crouch.durationMs += dt * 1000
		if (player.actions.ascend.state === 'in-use')
			player.actions.ascend.durationMs += dt * 1000
		if (player.actions.descend.state === 'in-use')
			player.actions.descend.durationMs += dt * 1000

		if (player.actions.draw.durationMs >= player.actions.draw.completeMs)
			player.actions.draw.state = 'complete'
		if (player.actions.stowe.durationMs >= player.actions.stowe.completeMs)
			player.actions.stowe.state = 'complete'
		if (player.actions.jump.durationMs >= player.actions.jump.completeMs)
			player.actions.jump.state = 'complete'
		if (player.actions.crouch.durationMs >= player.actions.crouch.completeMs)
			player.actions.crouch.state = 'complete'
		// if(player.actions.walk.durationMs >= player.actions.walk.completeMs) player.actions.walk.state = 'complete'
		// if(player.actions.sprint.durationMs >= player.actions.sprint.completeMs) player.actions.sprint.state = 'complete'
		// if(player.actions.ascend.durationMs >= player.actions.ascend.completeMs) player.actions.ascend.state = 'complete'
		// if(player.actions.descend.durationMs >= player.actions.descend.completeMs) player.actions.descend.state = 'complete'
	}

	/** Resets the state of completed actions */
	resetCompletedActions(player: Player) {
		// Would really love if we could do this in a loop; Object.entries destroys the type
		if (player.actions.walk.state === 'complete') {
			player.actions.walk.state = 'not-in-use'
			player.actions.walk.durationMs = 0
		}
		if (player.actions.sprint.state === 'complete') {
			player.actions.sprint.state = 'not-in-use'
			player.actions.sprint.durationMs = 0
		}
		if (player.actions.draw.state === 'complete') {
			player.actions.draw.state = 'not-in-use'
			player.actions.draw.durationMs = 0
		}
		if (player.actions.stowe.state === 'complete') {
			player.actions.stowe.state = 'not-in-use'
			player.actions.stowe.durationMs = 0
		}
		if (player.actions.jump.state === 'complete') {
			player.actions.jump.state = 'not-in-use'
			player.actions.jump.durationMs = 0
		}
		if (player.actions.crouch.state === 'complete') {
			player.actions.crouch.state = 'not-in-use'
			player.actions.crouch.durationMs = 0
		}
		if (player.actions.ascend.state === 'complete') {
			player.actions.ascend.state = 'not-in-use'
			player.actions.ascend.durationMs = 0
		}
		if (player.actions.descend.state === 'complete') {
			player.actions.descend.state = 'not-in-use'
			player.actions.descend.durationMs = 0
		}
	}
}
