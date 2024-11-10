import staleZombieV1BodyPng from '../../../assets/stale_zombie_v1_body.png'
import walkZombieV1LegsPng from '../../../assets/walk_zombie_v1_legs-Sheet.png'
import walkZombieV1BodyPng from '../../../assets/walk_zombie_v1_body-Sheet.png'
import dyingZombieV1FullBodyPng from '../../../assets/dying_zombie_v1_full_body-Sheet.png'
import dyingZombieV1StaleFullBodyPng from '../../../assets/dying_zombie_v1_stale_full_body.png'

export const spriteWidth = 20
export const spriteHeight = 28

const staleZombieV1BodyImg = new Image()
staleZombieV1BodyImg.src = staleZombieV1BodyPng
export const staleZombieV1BodyPresets = {
	sprites: 1,
	img: staleZombieV1BodyImg,
}

const walkZombieV1LegsImg = new Image()
walkZombieV1LegsImg.src = walkZombieV1LegsPng
export const walkZombieV1LegsPresets = {
	sprites: 6,
	img: walkZombieV1LegsImg,
}

const walkZombieV1BodyImg = new Image()
walkZombieV1BodyImg.src = walkZombieV1BodyPng
export const walkZombieV1BodyPresets = {
	sprites: 6,
	img: walkZombieV1BodyImg,
}

const dyingZombieV1FullBodyImg = new Image()
dyingZombieV1FullBodyImg.src = dyingZombieV1FullBodyPng
export const dyingZombieV1FullBodyPresets = {
	sprites: 5,
	img: dyingZombieV1FullBodyImg,
}

const dyingZombieV1StaleFullBodyImg = new Image()
dyingZombieV1StaleFullBodyImg.src = dyingZombieV1StaleFullBodyPng
export const dyingZombieV1StaleFullBodyPresets = {
	sprites: 1,
	img: dyingZombieV1StaleFullBodyImg,
}