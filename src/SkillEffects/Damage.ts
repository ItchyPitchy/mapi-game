import { SkillEffect } from './SKillEffect'

export class Damage extends SkillEffect {
  constructor(public points: number, triggerInMs: number) {
    super(triggerInMs)
  }
}
