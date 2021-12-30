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

		let pad = squiggle.createScratchPadCanvas(ctx, 'white', 3, '#073642')
		pad.properties.autoSmoothing = true

		socket.emit('IjustJoined')

		socket.on('strokesSoFar', (strokes) => {
			console.log('strokeSoFar')
			pad.properties.strokes = [...strokes]
			pad.redrawStrokes()
		})

		//for mouse devices
		canvas.addEventListener('mousedown', (event) => {
			pad.events.publish('drawingStarted')
		})
		canvas.addEventListener('mousemove', (event) => {
			pad.events.publish('penMoved', canvasTools.getCanvasPosition(canvas, event))
		})

		canvas.addEventListener('mouseup', (event) => {
			pad.events.publish('drawingStopped')
		})

		//for touch devices
		canvas.addEventListener('touchstart', (event) => {
			pad.events.publish('drawingStarted')
		})

		canvas.addEventListener('touchmove', (touchEvent) => {
			pad.events.publish('penMoved',
				canvasTools.getCanvasPosition(canvas, { x: touchEvent.touches[0].clientX, y: touchEvent.touches[0].clientY })
			)
			console.log('touchmove', touchEvent)
		})

		canvas.addEventListener('touchend', (event) => {
			pad.events.publish('drawingStopped')
			console.log('touchend', event)
		})

		//socket will ask others to add this stroke to their strokes
		pad.events.subscribe('strokeAdded', (points) => {
			socket.emit('addThisStroke', points);
		})

		//redraw strokes to clear the drawn stroke for auto smoothing
		pad.events.subscribe('redraw', () => {
			pad.redrawStrokes()
			socket.emit('redrawYourStrokes')
		})

		socket.on('addThisStroke', (points) => {
			pad.properties.strokes.push(points)
		})

		socket.on('redrawYourStrokes', () => {
			pad.redrawStrokes()
		})
	}
}
window.addEventListener('load', main)