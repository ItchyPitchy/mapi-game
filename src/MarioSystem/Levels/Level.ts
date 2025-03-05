export type LevelSetup = {
  entities: EntityKey[][]
  height: number
  width: number
}

enum EntityKey {
  NONE = 0,
  WALL = 1,
  CRAWLER = 97,
  ZOMBIE = 98,
  PLAYER = 99
}