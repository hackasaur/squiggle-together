import * as canvasTools from './modules/canvas tools.js'
import * as bezier from './modules/bezier.js'
import * as squiggle from './modules/squiggle.js'

var socket = io()

function main() {
	const canvas = document.getElementById('scene')
	if (canvas.getContext) {
		let yPadding = 140
		let xPadding = 300
		const ctx = canvas.getContext('2d')
		ctx.canvas.width = window.innerWidth - xPadding
		ctx.canvas.height = window.innerHeight - yPadding

		canvasTools.paintBackground(ctx, '#073642', ctx.canvas.width, ctx.canvas.height)
		
		let pad = squiggle.createScratchPadCanvas(canvas, ctx, 'white', 3, '#073642')
		pad.properties.autoSmoothing = true
		socket.emit('IjustJoined')

		socket.on('strokesSoFar',(strokes) => {
			console.log('strokeSoFar')
			pad.properties.strokes = [...strokes]
			pad.redrawStrokes()
		})

		pad.events.subscribe('strokeAdded', (points) => {
			socket.emit('addThisStroke', points);
		})

		pad.events.subscribe('redraw', () => {
			pad.redrawStrokes()
			socket.emit('redrawYourStrokes')
		})

		socket.on('addThisStroke', (points) => {
			pad.properties.strokes.push(points)
		})

		socket.on('redrawYourStrokes', () => {
			pad.redrawStrokes()
		} )
		// pen1.update()
		// pen1.write()

		// if (mouseCoordsGlobal) {
		// 	canvasTools.setCanvasFont(ctx, { font: 'Fira Mono', color: 'black', size: '10' })
		// 	ctx.fillText(`x:${mouseCoordsGlobal[0]}, y:${mouseCoordsGlobal[1]}`, mouseCoordsGlobal[0], mouseCoordsGlobal[1])
		// }
		// 	window.requestAnimationFrame(animationLoop)
		// }
		// animationLoop()
	}
}
window.addEventListener('load', main)