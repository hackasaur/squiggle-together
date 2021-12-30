export const createPoint = (x, y) => {
    let point = [x, y]
    return point
}

export const createPointObject = (x, y) => {
    return {'x': x, 'y': y}
}

export function getCanvasPosition(canvas, pen) {
    let pos = {}
    pos.x = pen.x - canvas.offsetLeft;
    pos.y = pen.y - canvas.offsetTop;
    return pos
}

export const setCanvasFont = (ctx, font) => {
    ctx.fillStyle = `${font.color}`
    ctx.font = `${font.size}px ${font.font}`
}

export const getFontHeight = (ctx) => {
    return ctx.measureText('l').fontBoundingBoxAscent
}

export const getCharacterWidth = (ctx, character) => {
    return ctx.measureText(character).width
}

export const isPointInsideBox = (point, topLeftCoords, width, height) => {
    return (
        point[0] > topLeftCoords[0] &&
        point[0] < topLeftCoords[0] + width &&
        point[1] > topLeftCoords[1] &&
        point[1] < topLeftCoords[1] + height)
}

export const isPointInsideBox2 = (point, topLeftCoords, bottomRightCoords) => {
    return (
        point[0] >= topLeftCoords[0] &&
        point[0] <= bottomRightCoords[0] &&
        point[1] >= topLeftCoords[1] &&
        point[1] <= bottomRightCoords[1])
}

export const areBoxesOverlapping = (topLeftCoords1, width1, height1, topLeftCoords2, width2, height2) => {
    let topRightCoords1 = createPoint(topLeftCoords1[0] + width1, topLeftCoords1[1])
    let bottomRightCoords1 = createPoint(topLeftCoords1[0] + width1, topLeftCoords1[1] + height1)
    let bottomLeftCoords1 = createPoint(topLeftCoords1[0], topLeftCoords1[1] + height1)

    if (isPointInsideBox(topLeftCoords1, topLeftCoords2, width2, height2) ||
        isPointInsideBox(topRightCoords1, topLeftCoords2, width2, height2) ||
        isPointInsideBox(bottomRightCoords1, topLeftCoords2, width2, height2) ||
        isPointInsideBox(bottomLeftCoords1, topLeftCoords2, width2, height2)
    ) {
        return true
    }

    let topRightCoords2 = createPoint(topLeftCoords2[0] + width2, topLeftCoords2[1])
    let bottomRightCoords2 = createPoint(topLeftCoords2[0] + width2, topLeftCoords2[1] + height2)
    let bottomLeftCoords2 = createPoint(topLeftCoords2[0], topLeftCoords2[1] + height2)

    if (isPointInsideBox(topLeftCoords2, topLeftCoords1, width1, height1) ||
        isPointInsideBox(topRightCoords2, topLeftCoords1, width1, height1) ||
        isPointInsideBox(bottomRightCoords2, topLeftCoords1, width1, height1) ||
        isPointInsideBox(bottomLeftCoords2, topLeftCoords1, width1, height1)
    ) {
        return true
    }
    return false
}


export const whereTwoRectsOverlap = (topLeftCoords1, width1, height1, topLeftCoords2, width2, height2) => {
    let topRightCoords1 = createPoint(topLeftCoords1[0] + width1, topLeftCoords1[1])
    let bottomRightCoords1 = createPoint(topLeftCoords1[0] + width1, topLeftCoords1[1] + height1)
    let bottomLeftCoords1 = createPoint(topLeftCoords1[0], topLeftCoords1[1] + height1)

    let cornerCoords1 = [topLeftCoords1, topRightCoords1, bottomRightCoords1, bottomLeftCoords1]

    for (let coord of cornerCoords1) {
        if (isPointInsideBox(coord, topLeftCoords2, width2, height2)) {
            return coord
        }
    }

    let topRightCoords2 = createPoint(topLeftCoords2[0] + width2, topLeftCoords2[1])
    let bottomRightCoords2 = createPoint(topLeftCoords2[0] + width2, topLeftCoords2[1] + height2)
    let bottomLeftCoords2 = createPoint(topLeftCoords2[0], topLeftCoords2[1] + height2)

    let cornerCoords2 = [topLeftCoords2, topRightCoords2, bottomRightCoords2, bottomLeftCoords2]

    for (let coord of cornerCoords2) {
        if (isPointInsideBox(coord, topLeftCoords1, width1, height1)) {
            return coord
        }
    }

    return undefined
}

export const paintBackground = (ctx, color, width, height) => {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)
}

export const distanceBetweenPoints = (coords1, coords2) => {
    let deltaX = coords2[0] - coords1[0]
    let deltaY = coords2[1] - coords1[1]
    // slope = deltaY / deltaX
    return Math.sqrt(deltaX ** 2 + deltaY ** 2)
}

export const getSlope2Points = (coords1, coords2) => {
    let deltaX = coords2[0] - coords1[0]
    let deltaY = coords2[1] - coords1[1]
    return deltaY/deltaX
}