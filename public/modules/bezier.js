import * as canvasTools from './canvas tools.js';

export function bezierLinear(point1, point2) {
    return canvasTools.createPointObject(
        (t) => point1.x(t) + (point2.x(t) - point1.x(t)) * t,
        (t) => point1.y(t) + (point2.y(t) - point1.y(t)) * t)
}

export function bezierInsidePoints(points) {
    let insidePoints = []
    for (let i = 0; i < points.length - 1; i++) {
        insidePoints.push(bezierLinear(points[i], points[i + 1]))
    }
    return insidePoints
}

//get a bezier point of the form {x: (t) => {...}, y: (t) => {...}} for an array of control points, which can be traced later
export function getBezierPoint(controlPoints) {
    let points = controlPoints
    while (points.length > 1) {
        points = bezierInsidePoints(points)
    }
    return points[0]
}

//points is an array of object points of structure { x: (t)={...}, y: () => {...} }, and order of desired curve(e.g. 2 is quadratic)
export function getBezierSpline(points, order) {
    let bezierPoints = []
    for (let i = 0; i < points.length; i += order - 1) {
        let pointSubGroup = []
        if (points.length - i < order) { //remaining points less than order
            for (let offset = 0; offset < points.length - i; offset++) {
                pointSubGroup.push(points[i + offset])
            }
        }


        else if (points.length - i >= order) {
            for (let offset = 0; offset < order; offset++) { //add points equal to order to pointsSubGroup
                pointSubGroup.push(points[i + offset])
            }
        }
        bezierPoints.push(getBezierPoint(pointSubGroup))
    }
    return bezierPoints
}

export function drawBezierPointOnCanvas(ctx, bezierPoint, parts) {
    ctx.beginPath()
    ctx.moveTo(bezierPoint.x(0), bezierPoint.y(0))
    for (let r = 0; r <= parts; r++) {
        let t = r * 1 / parts
        ctx.lineTo(bezierPoint.x(t), bezierPoint.y(t))
    }
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.closePath()
}

export function drawBezierPointsOnCanvas(ctx, bezierPoints, parts) {
    let path = new Path2D
    ctx.beginPath(path)

    ctx.moveTo(bezierPoints[0].x(0), bezierPoints[0].y(0))

    for (let bezierPoint of bezierPoints) {
        for (let r = 0; r <= parts; r++) {
            let t = r * 1 / parts
            ctx.lineTo(bezierPoint.x(t), bezierPoint.y(t))
        }
    }

    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.closePath(path)
}

export function drawControlPoints(ctx, points) {
    //assuming each x,y are funcitons of t
    for (let point of points) {
        ctx.beginPath()
        ctx.arc(point.x(0), point.y(0), 8, 0, 2 * Math.PI)
        ctx.strokeStyle = 'skyblue'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.closePath()
    }
}

export function getCurvePointsFromBezierPoint(bezierPoint, parts) {
    let curvePoints = []
    for (let r = 0; r <= parts; r++) {
        let t = r * 1 / parts
        curvePoints.push(canvasTools.createPoint(bezierPoint.x(t), bezierPoint.y(t)))
    }
    return curvePoints
}