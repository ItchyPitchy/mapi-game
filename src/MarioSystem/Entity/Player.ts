import Entity from '../../shared/Entity'
import sheathBodySheet from '../../assets/sheath_upper_body_spritesheet-Sheet.png'
import sprintSheathedBodySheet from '../../assets/sprint_sheathed_upper_body_sprites-Sheet.png'
import sprintSheathedLegsSheet from '../../assets/sprint_sheathed_legs_sprites-Sheet.png'
import walkingBodySheet from '../../assets/walking_equipped_upper_body_sprites-Sheet.png'
import staleSheathedBodySprite from '../../assets/stale_sheathed_upper_body.png'
import staleEquippedBodySprite from '../../assets/stale_equipped_upper_body.png'
import walkingLegsSheet from '../../assets/walking_equipped_legs_sprites-Sheet.png'
import jumpEquippedBodySheet from '../../assets/jump_equipped_upper_body_sprites-Sheet.png'
import jumpLegsSheet from '../../assets/jump_legs_sprites-Sheet.png'
import jumpLegsStaleUpwardSprite from '../../assets/jump_legs_stale_upward.png'
import jumpEquippedBodyStaleUpwardSprite from '../../assets/jump_equipped_upper_body_stale_upward.png'
import staleLegsSprite from '../../assets/stale_legs.png'
import { Point } from '../../types'
import { Vector } from '../../shared/Vector'

const spriteWidth = 20
const spriteHeight = 28

const walkLegsAnimationSpritesQty = 10
const walkBodyAnimationSpritesQty = 9
const walkBodyAnimationDuration = 1125

const duckAnimationSpritesQty = 3
const duckAnimationDuration = 1200

const fallAnimationDuration = 750

const sheathAnimationSpritesQty = 15
const sheathAnimationDuration = 750

const sprintSheatedBodySpritesQty = 8
const sprintSheatedLegsSpritesQty = 10
const sprintBodyAnimationDuration = 800
const sprintLegsAnimationDuration = 1000

const jumpLegsSpritesQty = 6
const jumpLegsAnimationDuration = 500
const jumpEquippedBodySpritesQty = 6
const jumpEquippedBodyAnimationDuration = 500

export class Player extends Entity {
	public vector: Vector = new Vector(0, 0)

	private direction: 'left' | 'right' = 'right'

	public isSheathed: boolean = false
	public isJumping: boolean = false
	public action: {
		duck: {
			state: 'not-in-use' | 'in-use' | 'complete'
			progressMs: number
		}
		walk: {
			state: 'not-in-use' | 'in-use'
			progressMs: number
		}
		fall: {
			state: 'not-in-use' | 'in-use'
			progressMs: number
		}
		sheath: {
			state: 'not-in-use' | 'in-use'
			progressMs: number
		}
		jump: {
			state: 'not-in-use' | 'in-use'
			progressMs: number
		}
	} = {
		duck: { state: 'not-in-use', progressMs: 0 },
		walk: { state: 'not-in-use', progressMs: 0 },
		fall: { state: 'not-in-use', progressMs: 0 },
		sheath: { state: 'not-in-use', progressMs: 0 },
		jump: { state: 'not-in-use', progressMs: 0 },
	}

	public sheathBodySheet = new Image()
	public walkingBodySheet = new Image()
	public sprintSheathedBodySheet = new Image()
	public sprintSheathedLegsSheet = new Image()
	public staleSheathedBodySprite = new Image()
	public staleEquippedBodySprite = new Image()
	public jumpEquippedBodySheet = new Image()
	public jumpLegsSheet = new Image()
	public jumpLegsStaleUpwardSprite = new Image()
	public jumpEquippedBodyStaleUpwardSprite = new Image()
	public walkingLegsSheet = new Image()
	public staleLegsSprite = new Image()

	constructor(
		position: Point,
		rotation = 0,
		size = { height: spriteHeight, width: spriteWidth }
	) {
		super(position, size, rotation)

		this.sheathBodySheet.src = sheathBodySheet
		this.walkingBodySheet.src = walkingBodySheet
		this.sprintSheathedBodySheet.src = sprintSheathedBodySheet
		this.sprintSheathedLegsSheet.src = sprintSheathedLegsSheet
		this.staleSheathedBodySprite.src = staleSheathedBodySprite
		this.staleEquippedBodySprite.src = staleEquippedBodySprite
		this.jumpEquippedBodySheet.src = jumpEquippedBodySheet
		this.jumpLegsSheet.src = jumpLegsSheet
		this.jumpLegsStaleUpwardSprite.src = jumpLegsStaleUpwardSprite
		this.jumpEquippedBodyStaleUpwardSprite.src =
			jumpEquippedBodyStaleUpwardSprite
		this.walkingLegsSheet.src = walkingLegsSheet
		this.staleLegsSprite.src = staleLegsSprite
	}

	update(dt: number, actions: Array<'move' | 'duck' | 'sheath' | 'jump'>) {
		if (!actions.some((action) => action === 'duck')) {
			this.action.duck.progressMs = 0
			this.action.duck.state = 'not-in-use'
		}

		if (!actions.some((action) => action === 'move')) {
			this.action.walk.state = 'not-in-use'
			this.action.walk.progressMs = 0
		}

		if (this.action.sheath.state === 'in-use') {
			const nextStateProgress = this.action.sheath.progressMs + dt * 1000

			if (nextStateProgress > sheathAnimationDuration) {
				this.action.sheath.progressMs = 0
				this.action.sheath.state = 'not-in-use'
			} else {
				this.action.sheath.progressMs += dt * 1000
			}

			if (actions.some((action) => action === 'sheath')) {
				actions.splice(actions.indexOf('sheath'), 1)
			}
		}

		if (this.action.jump.state === 'in-use') {
			const nextStateProgress = this.action.jump.progressMs + dt * 1000

			if (nextStateProgress > jumpLegsAnimationDuration) {
				this.action.jump.progressMs = 0
				this.action.jump.state = 'not-in-use'
				this.vector.y -= 500
				this.isJumping = true
			} else {
				this.action.jump.progressMs += dt * 1000
			}

			if (actions.some((action) => action === 'jump')) {
				actions.splice(actions.indexOf('jump'), 1)
			}
		}

		// TODO: Check if colliding with floor (not falling)
		if (true) {
			this.action.fall.state = 'not-in-use'
			this.action.fall.progressMs = 0
		} else {
			this.action.fall.state = 'in-use'
			this.action.fall.progressMs += dt * 1000

			this.action.walk.state = 'not-in-use'
			this.action.walk.progressMs = 0
		}

		for (const action of actions) {
			if (action === 'move') {
				if (this.vector.x !== 0) {
					if (this.vector.x > 0) {
						this.direction = 'right'
					} else {
						this.direction = 'left'
					}
				}

				this.action.walk.state = 'in-use'
				this.action.walk.progressMs += dt * 1000
			}

			if (action === 'sheath') {
				this.isSheathed = !this.isSheathed
				this.action.sheath.progressMs += dt * 1000
				this.action.sheath.state = 'in-use'
			}

			if (action === 'duck') {
				this.action.duck.progressMs += dt * 1000
				this.action.duck.state =
					this.action.duck.progressMs >= duckAnimationDuration
						? 'complete'
						: 'in-use'
			}

			if (action === 'jump') {
				this.action.jump.progressMs += dt * 1000
				this.action.jump.state = 'in-use'
			}
		}

		this.position.x += this.vector.x * dt
		this.position.y += this.vector.y * dt
	}

	draw({ ctx }: { ctx: CanvasRenderingContext2D }) {
		ctx.save()

		ctx.imageSmoothingEnabled = false

		const scale =
			this.direction === 'right' ? ctx.scale(-1, 1) : ctx.scale(1, 1)
		const scaleBasedPositionMultiplier = this.direction === 'right' ? -1 : 1

		console.log(this.isJumping)
		switch (true) {
			case this.isJumping: {
				ctx.drawImage(
					this.jumpEquippedBodyStaleUpwardSprite,
					0,
					0,
					spriteWidth,
					spriteHeight,
					scaleBasedPositionMultiplier * this.position.x -
						(spriteWidth * 5) / 2,
					this.position.y - spriteHeight * 5,
					spriteWidth * 5,
					spriteHeight * 5
				)

				break
			}
			case this.action.jump.state === 'in-use': {
				const percentProgress =
					this.action.jump.progressMs > jumpEquippedBodyAnimationDuration
						? (this.action.jump.progressMs %
								jumpEquippedBodyAnimationDuration) /
						  jumpEquippedBodyAnimationDuration
						: this.action.jump.progressMs / jumpEquippedBodyAnimationDuration
				const jumpAnimationStep = Math.floor(
					percentProgress * jumpEquippedBodySpritesQty
				)

				ctx.drawImage(
					this.jumpEquippedBodySheet,
					jumpAnimationStep * spriteWidth,
					0,
					spriteWidth,
					spriteHeight,
					scaleBasedPositionMultiplier * this.position.x -
						(spriteWidth * 5) / 2,
					this.position.y - spriteHeight * 5,
					spriteWidth * 5,
					spriteHeight * 5
				)

				break
			}
			case this.action.fall.state === 'in-use': {
				break
			}
			case this.action.sheath.state === 'in-use': {
				const percentProgress =
					this.action.sheath.progressMs > sheathAnimationDuration
						? (this.action.sheath.progressMs % sheathAnimationDuration) /
						  sheathAnimationDuration
						: this.action.sheath.progressMs / sheathAnimationDuration
				const sheathAnimationStep = this.isSheathed
					? Math.floor(percentProgress * sheathAnimationSpritesQty)
					: sheathAnimationSpritesQty -
					  1 -
					  Math.floor(percentProgress * sheathAnimationSpritesQty)

				ctx.drawImage(
					this.sheathBodySheet,
					sheathAnimationStep * spriteWidth,
					0,
					spriteWidth,
					spriteHeight,
					scaleBasedPositionMultiplier * this.position.x -
						(spriteWidth * 5) / 2,
					this.position.y - spriteHeight * 5,
					spriteWidth * 5,
					spriteHeight * 5
				)

				break
			}
			case this.action.walk.state === 'in-use' &&
				this.isSheathed &&
				this.action.sheath.state === 'not-in-use': {
				const percentProgress =
					this.action.walk.progressMs > sprintBodyAnimationDuration
						? (this.action.walk.progressMs % sprintBodyAnimationDuration) /
						  sprintBodyAnimationDuration
						: this.action.walk.progressMs / sprintBodyAnimationDuration
				const walkAnimationStep = Math.floor(
					percentProgress * sprintSheatedBodySpritesQty
				)

				ctx.drawImage(
					this.sprintSheathedBodySheet,
					walkAnimationStep * spriteWidth,
					0,
					spriteWidth,
					spriteHeight,
					scaleBasedPositionMultiplier * this.position.x -
						(spriteWidth * 5) / 2,
					this.position.y - spriteHeight * 5,
					spriteWidth * 5,
					spriteHeight * 5
				)

				break
			}
			case this.action.walk.state === 'in-use': {
				const percentProgress =
					this.action.walk.progressMs > walkBodyAnimationDuration
						? (this.action.walk.progressMs % walkBodyAnimationDuration) /
						  walkBodyAnimationDuration
						: this.action.walk.progressMs / walkBodyAnimationDuration
				const walkAnimationStep = Math.floor(
					percentProgress * walkBodyAnimationSpritesQty
				)

				ctx.drawImage(
					this.walkingBodySheet,
					walkAnimationStep * spriteWidth,
					0,
					spriteWidth,
					spriteHeight,
					scaleBasedPositionMultiplier * this.position.x -
						(spriteWidth * 5) / 2,
					this.position.y - spriteHeight * 5,
					spriteWidth * 5,
					spriteHeight * 5
				)
				break
			}
			default: {
				ctx.drawImage(
					this.isSheathed
						? this.staleSheathedBodySprite
						: this.staleEquippedBodySprite,
					0,
					0,
					spriteWidth,
					spriteHeight,
					scaleBasedPositionMultiplier * this.position.x -
						(spriteWidth * 5) / 2,
					this.position.y - spriteHeight * 5,
					spriteWidth * 5,
					spriteHeight * 5
				)
				break
			}
		}

		switch (true) {
			case this.isJumping: {
				ctx.drawImage(
					this.jumpLegsStaleUpwardSprite,
					0,
					0,
					spriteWidth,
					spriteHeight,
					scaleBasedPositionMultiplier * this.position.x -
						(spriteWidth * 5) / 2,
					this.position.y - spriteHeight * 5,
					spriteWidth * 5,
					spriteHeight * 5
				)

				break
			}
			case this.action.jump.state === 'in-use': {
				const percentProgress =
					this.action.jump.progressMs > jumpLegsAnimationDuration
						? (this.action.jump.progressMs % jumpLegsAnimationDuration) /
						  jumpLegsAnimationDuration
						: this.action.jump.progressMs / jumpLegsAnimationDuration
				const jumpAnimationStep = Math.floor(
					percentProgress * jumpLegsSpritesQty
				)

				ctx.drawImage(
					this.jumpLegsSheet,
					jumpAnimationStep * spriteWidth,
					0,
					spriteWidth,
					spriteHeight,
					scaleBasedPositionMultiplier * this.position.x -
						(spriteWidth * 5) / 2,
					this.position.y - spriteHeight * 5,
					spriteWidth * 5,
					spriteHeight * 5
				)

				break
			}
			case this.action.fall.state === 'in-use': {
				break
			}
			case this.action.walk.state === 'in-use' &&
				this.isSheathed &&
				this.action.sheath.state === 'not-in-use': {
				const percentProgress =
					this.action.walk.progressMs > sprintLegsAnimationDuration
						? (this.action.walk.progressMs % sprintLegsAnimationDuration) /
						  sprintLegsAnimationDuration
						: this.action.walk.progressMs / sprintLegsAnimationDuration
				const sprintAnimationStep = Math.floor(
					percentProgress * sprintSheatedLegsSpritesQty
				)

				ctx.drawImage(
					this.sprintSheathedLegsSheet,
					sprintAnimationStep * spriteWidth,
					0,
					spriteWidth,
					spriteHeight,
					scaleBasedPositionMultiplier * this.position.x -
						(spriteWidth * 5) / 2,
					this.position.y - spriteHeight * 5,
					spriteWidth * 5,
					spriteHeight * 5
				)

				break
			}
			case this.action.walk.state === 'in-use': {
				const percentProgress =
					this.action.walk.progressMs > walkBodyAnimationDuration
						? (this.action.walk.progressMs % walkBodyAnimationDuration) /
						  walkBodyAnimationDuration
						: this.action.walk.progressMs / walkBodyAnimationDuration
				const walkAnimationStep = Math.floor(
					percentProgress * walkLegsAnimationSpritesQty
				)

				ctx.drawImage(
					this.walkingLegsSheet,
					walkAnimationStep * spriteWidth,
					0,
					spriteWidth,
					spriteHeight,
					scaleBasedPositionMultiplier * this.position.x -
						(spriteWidth * 5) / 2,
					this.position.y - spriteHeight * 5,
					spriteWidth * 5,
					spriteHeight * 5
				)

				break
			}
			default: {
				ctx.drawImage(
					this.staleLegsSprite,
					0,
					0,
					spriteWidth,
					spriteHeight,
					scaleBasedPositionMultiplier * this.position.x -
						(spriteWidth * 5) / 2,
					this.position.y - spriteHeight * 5,
					spriteWidth * 5,
					spriteHeight * 5
				)

				break
			}
		}

		ctx.restore()
	}
}
