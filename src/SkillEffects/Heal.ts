import { SkillEffect } from './SKillEffect'

export class Heal extends SkillEffect {
  constructor(public points: number, triggerInMs: number) {
    super(triggerInMs)
  }
}
