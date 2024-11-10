import Game from '../../game.js'
import { System } from './System.js'
import { Entity } from '../Entity/Entity.js'
import { Stats } from '../Component/Stats.js'
import { Damage } from '../Component/Damage.js'
import { Delete } from '../Component/Delete.js'
import { BloodSplatter } from '../Entity/Zombie/BloodSplatter.js'
import { ZombieV1 } from '../Entity/Zombie/ZombieV1.js'

export class EffectSystem extends System {
	constructor() {
		super()
	}

	appliesTo(entity: Entity) {
		return entity.hasComponent(Stats) && entity.hasComponent(Damage)
	}

	update(game: Game, entities: Entity[], dt: number) {
		for (const entity of entities) {
      if (!entity.hasComponent(Stats) || !entity.hasComponent(Damage)) throw new Error('#appliesTo not called before update')
      
      const stats = entity.getComponent(Stats)
      const damage = entity.getComponent(Damage)

      if (damage.triggerInMs <= 0) {
        stats.hp -= damage.points
        entity.removeComponent(damage)
        
        // switch(true) {
        //   case entity instanceof ZombieV1: {
        //     const durationMs = 500
        //     const bloodSplatter = new BloodSplatter({ x: damage.hitPosition.x, y: damage.hitPosition.y }, damage.hitDirection, durationMs)
        //     bloodSplatter.addComponents(new Delete(durationMs))

        //     game.marioSystem.entities.push(bloodSplatter)
            
        //     break
        //   }
        //   default: {}
        // }
      }

      if (stats.hp <= 0) {
        // entity.addComponents(new Delete())
      }

      damage.triggerInMs -= dt * 1000
		}
	}
}
