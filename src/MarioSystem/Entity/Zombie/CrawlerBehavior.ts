import Game from '../../../game'
import { Collidable } from '../../Component/Collidable'
import { Stats } from '../../Component/Stats'
import { System } from '../../System/System'
import { Entity } from '../Entity'
import { Crawler } from './Crawler'

export class CrawlerBehavior extends System {
  constructor() {
    super()
  }

  appliesTo(entity: Entity): boolean {
    return entity instanceof Crawler
  }

  update(game: Game, entities: Entity[], dt: number) {
    const player = game.marioSystem.player

    for (const zombie of entities) {
      if (!(zombie instanceof Crawler)) throw new Error('#appliesTo not called before update')

      this.updateActionTimers(zombie, dt)

      if (
        zombie.hasComponent(Collidable) &&
        zombie.getComponent(Collidable).collisionBottom.length !== 0
      ) {
        if (zombie.vector.y > 1000) {
          zombie.vector.y = 0
        }
      }

      if (
        zombie.hasComponent(Collidable) &&
        zombie.getComponent(Collidable).collisionBottom.some((collision) => collision.initialCollision)
      ) {
        if (zombie.actions.jumpAttack.state === 'in-use') {
          zombie.actions.jumpAttack.state = 'not-in-use'
          zombie.vector.x = 0
        }
      }

      if (zombie.hasComponent(Stats) && zombie.getComponent(Stats).hp <= 0 && zombie.actions.die.state === 'not-in-use') {
        if (zombie.hasComponent(Collidable)) {
          zombie.getComponent(Collidable).collisionGroup = 'cadaver'
        }

        zombie.actions.die.state = 'in-use'
        zombie.vector.x = 0
      }

      if (zombie.actions.jumpAttack.state === 'in-use') continue
      
      if (!player || zombie.hasComponent(Stats) && zombie.getComponent(Stats).hp <= 0) continue
      
      const vicinityRange = 950
      const distanceToPlayers = [player].map((player) => ({
        distance: zombie.distanceTo(player),
        player: player,
      }))

      const nearestPlayerRange = distanceToPlayers.sort((playerA, playerB) => playerA.distance - playerB.distance)[0]
      const playerIsInVicinity = nearestPlayerRange.distance <= vicinityRange

      if (playerIsInVicinity) {
        const maxSpeed = 700

        // Player is to the left
        if (nearestPlayerRange.player.position.x < zombie.position.x) {
          zombie.direction = 'left'

          if (nearestPlayerRange.distance <= 200 && zombie.vector.x <= -350) {
            zombie.actions.jumpAttack.state = 'in-use'
            zombie.vector.x = -1000
            zombie.vector.y = -250
          } else {
            zombie.actions.walk.state = 'in-use'
  
            if (zombie.vector.x - 800 * dt <= -maxSpeed) {
              zombie.vector.x = -maxSpeed
            } else {
              zombie.vector.x -= 800 * dt
            }
          }

        }
        
        // Player is to the right
        if (nearestPlayerRange.player.position.x > zombie.position.x) {
          zombie.direction = 'right'

          if (nearestPlayerRange.distance <= 200 && zombie.vector.x >= 350) {
            zombie.actions.jumpAttack.state = 'in-use'
            zombie.vector.x = 1000
            zombie.vector.y = -250
          } else {
            zombie.actions.walk.state = 'in-use'
  
            if (zombie.vector.x + 800 * dt >= maxSpeed) {
              zombie.vector.x = maxSpeed
            } else {
              zombie.vector.x += 800 * dt
            }
          }
        }
      } else {
        zombie.actions.walk.state = 'not-in-use'
        zombie.actions.walk.durationMs = 0
        zombie.vector.x = 0
      }
    }
  }

  updateActionTimers(entity: Crawler, dt: number) {
    // Would really love if we could do this in a loop; Object.entries destroys the type
    if (entity.actions.stale.state === 'in-use')
      entity.actions.stale.durationMs += dt * 1000
    if (entity.actions.walk.state === 'in-use')
      entity.actions.walk.durationMs += dt * 1000
    if (entity.actions.die.state === 'in-use')
      entity.actions.die.durationMs += dt * 1000
    if (entity.actions.jumpAttack.state === 'in-use')
      entity.actions.jumpAttack.durationMs += dt * 1000

    if (entity.actions.die.durationMs >= entity.actions.die.completeMs)
      entity.actions.die.state = 'complete'
  }
}