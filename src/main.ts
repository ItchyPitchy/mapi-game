import Game from './game'

const mainCanvas = document.querySelector('#gameScreen') as HTMLCanvasElement
const mainCtx = mainCanvas.getContext('2d') as CanvasRenderingContext2D

mainCtx.imageSmoothingEnabled = true
mainCtx.imageSmoothingQuality = 'high'

// const GAME_WIDTH = window.innerWidth
// const GAME_HEIGHT = window.innerHeight

const GAME_WIDTH = 800
const GAME_HEIGHT = 600

mainCanvas.width = GAME_WIDTH
mainCanvas.height = GAME_HEIGHT

const game = new Game(GAME_WIDTH, GAME_HEIGHT, mainCtx)

let oldTimeStamp: number = 0

function gameLoop(timestamp: number) {
	// dt i sekunder
	let dt = (timestamp - oldTimeStamp) / 1000
	oldTimeStamp = timestamp

	mainCtx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

	game.update(dt)
	game.draw(mainCtx)

	requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)
