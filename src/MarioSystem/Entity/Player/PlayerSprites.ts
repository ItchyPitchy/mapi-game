import walkDrawnGunBodyPng from '../../../assets/walk_drawn_gun__body-Sheet.png'
import walkDrawnGunLegsPng from '../../../assets/walk_drawn_gun_legs-Sheet.png'
import sprintStowedGunBodyPng from '../../../assets/sprint_stowed_gun_body_v2-Sheet.png'
import sprintStowedGunLegsPng from '../../../assets/sprint_stowed_gun_legs_v2-Sheet.png'
import stoweGunBodyPng from '../../../assets/stowe_gun_body-Sheet.png'
import drawGunBodyPng from '../../../assets/draw_gun_body-Sheet.png'
import jumpDrawnGunBodyPng from '../../../assets/jump_drawn_gun_body_v2-Sheet.png'
import jumpDrawnGunLegsPng from '../../../assets/jump_drawn_gun_legs-Sheet.png'
import leapStowedGunBodyPng from '../../../assets/leap_stowed_gun_body-Sheet.png'
import leapStowedGunLegsPng from '../../../assets/leap_stowed_gun_legs-Sheet.png'
import ascendDrawnGunBodyPng from '../../../assets/ascend_drawn_gun_body.png'
import ascendDrawnGunLegsPng from '../../../assets/ascend_drawn_gun_legs.png'
import staleStowedGunBodyPng from '../../../assets/stale_stowed_gun_body.png'
import staleDrawnGunBodyPng from '../../../assets/stale_drawn_gun_body.png'
import staleStandingLegsPng from '../../../assets/stale_standing_legs.png'

export const spriteWidth = 20
export const spriteHeight = 28

const walkDrawnGunBodyImg = new Image()
walkDrawnGunBodyImg.src = walkDrawnGunBodyPng
export const walkDrawnGunBodyPresets = {
	sprites: 9,
	img: walkDrawnGunBodyImg,
}

const walkLegsImg = new Image()
walkLegsImg.src = walkDrawnGunLegsPng
export const walkLegsPresets = {
	sprites: 10,
	img: walkLegsImg,
}

const sprintStowedGunBodyImg = new Image()
sprintStowedGunBodyImg.src = sprintStowedGunBodyPng
export const sprintStowedGunBodyPresets = {
	sprites: 8,
	img: sprintStowedGunBodyImg,
}

const sprintStowedGunLegsImg = new Image()
sprintStowedGunLegsImg.src = sprintStowedGunLegsPng
export const sprintStowedGunLegsPresets = {
	sprites: 10,
	img: sprintStowedGunLegsImg,
}

const drawGunBodyImg = new Image()
drawGunBodyImg.src = drawGunBodyPng
export const drawGunBodyPresets = {
	sprites: 15,
	img: drawGunBodyImg,
}

const stoweGunBodyImg = new Image()
stoweGunBodyImg.src = stoweGunBodyPng
export const stoweGunBodyPresets = {
	sprites: 15,
	img: stoweGunBodyImg,
}

const jumpDrawnGunBodyImg = new Image()
jumpDrawnGunBodyImg.src = jumpDrawnGunBodyPng
export const jumpDrawnGunBodyPresets = {
	sprites: 5,
	img: jumpDrawnGunBodyImg,
}

const jumpDrawnGunLegsImg = new Image()
jumpDrawnGunLegsImg.src = jumpDrawnGunLegsPng
export const jumpLegsPresets = {
	sprites: 5,
	img: jumpDrawnGunLegsImg,
}

const leapStowedGunBodyImg = new Image()
leapStowedGunBodyImg.src = leapStowedGunBodyPng
export const leapStowedGunBodyPresets = {
	sprites: 5,
	img: leapStowedGunBodyImg,
}

const leapStowedGunLegsImg = new Image()
leapStowedGunLegsImg.src = leapStowedGunLegsPng
export const leapStowedGunLegsPresets = {
	sprites: 7,
	img: leapStowedGunLegsImg,
}

const ascendDrawnGunBodyImg = new Image()
ascendDrawnGunBodyImg.src = ascendDrawnGunBodyPng
export const ascendDrawnGunBodyPresets = {
	sprites: 1,
	img: ascendDrawnGunBodyImg,
}

const ascendDrawnGunLegsImg = new Image()
ascendDrawnGunLegsImg.src = ascendDrawnGunLegsPng
export const ascendDrawnGunLegsPresets = {
	sprites: 1,
	img: ascendDrawnGunLegsImg,
}

const descendDrawnGunBodyImg = new Image()
descendDrawnGunBodyImg.src = ascendDrawnGunBodyPng // TODO: Change once we have the spritesheet ready
export const descendDrawnGunBodyPresets = {
	sprites: 1,
	img: descendDrawnGunBodyImg,
}

const descendDrawnGunLegsImg = new Image()
descendDrawnGunLegsImg.src = ascendDrawnGunLegsPng // TODO: Change once we have the spritesheet ready
export const descendDrawnGunLegsPresets = {
	sprites: 1,
	img: descendDrawnGunLegsImg,
}

const staleStowedGunBodyImg = new Image()
staleStowedGunBodyImg.src = staleStowedGunBodyPng
export const staleStowedGunBodyPresets = {
	sprites: 1,
	img: staleStowedGunBodyImg,
}

const staleDrawnGunBodyImg = new Image()
staleDrawnGunBodyImg.src = staleDrawnGunBodyPng
export const staleDrawnGunBodyPresets = {
	sprites: 1,
	img: staleDrawnGunBodyImg,
}

const staleStandingLegsImg = new Image()
staleStandingLegsImg.src = staleStandingLegsPng
export const staleStandingLegsPresets = {
	sprites: 1,
	img: staleStandingLegsImg,
}
