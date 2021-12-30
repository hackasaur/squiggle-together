import * as bezier from './bezier.js'
import * as canvasTools from './canvas tools.js'

export function drawOnCanvas(ctx, color, lineWidth, prevPosition, position) {
    ctx.beginPath(); // begin
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color
    ctx.moveTo(prevPosition.x, prevPosition.y); // from
    ctx.lineTo(position.x, position.y); // to
    ctx.stroke()
    ctx.closePath()
}

function divideStroke(stroke, parts) {
    let points = []
    let startPoint = stroke[0]
    points.push({ x: (t) => startPoint[0], y: (t) => startPoint[1] })
    for (let i = 0; i < stroke.length - 1; i += Math.ceil((stroke.length - 2) / parts)) {
        if (i === 0) {
            continue
        }
        points.push({ x: (t) => stroke[i][0], y: (t) => stroke[i][1] })
    }
    let endPoint = stroke[stroke.length - 1]
    points.push({ x: (t) => endPoint[0], y: (t) => endPoint[1] })
    return points
}

const drawFromPoints = (ctx, pointsArray, color = 'white', lineWidth) => {
    let path = new Path2D
    ctx.beginPath(path)
    path.moveTo(pointsArray[0][0], pointsArray[0][1])
    for (let i = 0; i < pointsArray.length; i++) {
        path.lineTo(pointsArray[i][0], pointsArray[i][1])
    }
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke(path)
    ctx.closePath()
}

const pubSub = (events) => {
    let eventCallbacks = {}

    for (let event of events) {
        eventCallbacks[event] = []
    }

    return {
        subscribe: (eventName, callback) => {
            eventCallbacks[eventName].push(callback)
        },
        publish: (eventName, arg) => {
            if (eventCallbacks[eventName]) {
                for (let callback of eventCallbacks[eventName]) {
                    if (arg) {
                        callback(arg)
                    }
                    else {
                        callback()
                    }
                }
            }
            else {
                eventCallbacks[eventName] = []
                console.log(eventCallbacks)
            }
        },
        eventCallbacks
    }
}

export const createScratchPadCanvas = (ctx, strokeColor = 'white', strokeWidth = '3', backgroundColor = 'black') => {
    let properties = {
        strokeColor: strokeColor,
        strokeWidth: strokeWidth,
        autoSmoothing: false,
        smoothingCurveOrder: 8,
        backgroundColor: backgroundColor,
        strokes: []
    }

    const redrawStrokes = () => {
        canvasTools.paintBackground(ctx, properties.backgroundColor, ctx.canvas.width, ctx.canvas.height)
        for (let stroke of properties.strokes) {
            drawFromPoints(ctx, stroke, properties.strokeColor, properties.strokeWidth)
        }
    }

    let isDrawing = false
    let prevPosition, currentPosistion
    let stroke = []
    let refreshStrokes = false
    let events = pubSub(['strokeAdded', 'penMoved', 'drawingStarted', 'drawingStopped', 'redraw'])

    // canvas.addEventListener('mousedown', () => {
    //     writing = true
    // })

    // stroke.push([event.x - canvas.offsetLeft, event.y - canvas.offsetTop])
    const draw = (penCoords) => {
        if (isDrawing) {
            stroke.push([penCoords.x, penCoords.y])
            currentPosistion = { x: penCoords.x, y: penCoords.y }
            if (prevPosition !== undefined) {
                drawOnCanvas(ctx, properties.strokeColor, properties.strokeWidth, prevPosition, currentPosistion)
            }
            prevPosition = { x: penCoords.x, y: penCoords.y }
        }
    }

    events.subscribe('penMoved', draw)
    events.subscribe('drawingStarted', () => {isDrawing = true})

    // canvas.addEventListener('mouseup', (event) => {
    const penLifted = () => {
        isDrawing = false
        prevPosition = undefined
        if (properties.autoSmoothing) {
            //clear the stroke
            let points = divideStroke(stroke, properties.smoothingCurveOrder)
            // bezier.drawControlPoints(ctx, points)
            let bezierPoint = bezier.getBezierPoint(points)
            let bezierStrokePoints = bezier.getCurvePointsFromBezierPoint(bezierPoint, 100)
            // strokes.push(bezierStrokePoints)
            stroke = bezierStrokePoints
            refreshStrokes = true
        }

        let strokeVar = [...stroke]
        properties.strokes.push(strokeVar)
        events.publish('strokeAdded', strokeVar)
        stroke = []

        if (refreshStrokes) {
            events.publish('redraw')
        }
    }

    events.subscribe('drawingStopped', penLifted)

    return {
        properties,
        events,
        redrawStrokes
    }
}
