
export function collide(points, point) {
    let res = 0

    for (let i = 0; i < points.length; ++i) {
        let dx1 = point.x - points[i].x
        let dy1 = point.y - points[i].y
        let dx2 = points[(i+points.length-1) % points.length].x - points[i].x
        let dy2 = points[(i+points.length-1) % points.length].y - points[i].y
        res += (dx1 * dy2 - dx2 * dy1) > 0 ? 1 : -1
    }
    return res >= points.length || res <= -points.length
}

export function fillRadiusRect(context, x, y, w, h, r) {
    context.beginPath()
    context.moveTo(x + r, y)
    context.lineTo(x + w - r, y)
    context.arc(x+w-r, y+r, r, Math.PI * 1.5, 0, false)
    context.lineTo(x + w, y + h - r)
    context.arc(x+w-r, y+h-r, r, 0, Math.PI * 0.5, false)
    context.lineTo(x + r, y + h)
    context.arc(x+r, y+h-r, r, Math.PI * 0.5, Math.PI, false)
    context.lineTo(x, y + r)
    context.arc(x+r, y+r, r, Math.PI, Math.PI * 1.5, false)
    context.fill()
}

export function strokeLine(context, x1, y1, x2, y2) {
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.stroke()
}

export function fillCircle(context, x, y, r) {
    context.beginPath()
    context.arc(x, y, r, 0, Math.PI * 2, false)
    context.fill()
}


export function fillPentagonRight(context, x, y, w, h, r) {
    context.beginPath()
    context.moveTo(x + r, y)
    context.lineTo(x + w * 0.75 - r, y)
    context.lineTo(x + w, y + h/2)
    context.lineTo(x + w * 0.75 - r, y+h)
    context.lineTo(x + r, y + h)
    context.arc(x+r, y+h-r, r, Math.PI * 0.5, Math.PI, false)
    context.lineTo(x, y + r)
    context.arc(x+r, y+r, r, Math.PI, Math.PI * 1.5, false)
    context.fill()
}

export function fillRing(context, x, y, w, d) {
    context.beginPath()
    context.moveTo(x + w/2, y + w)
    context.arc(x + w / 2, y + w / 2, w / 2, Math.PI * 0.5, Math.PI, true)
    context.lineTo(x + d / 2, y + w / 2 + d / 2)
    context.lineTo(x + d, y + w / 2)
    context.arc(x + w / 2, y + w / 2, w / 2 - d, Math.PI, Math.PI*0.5)
    context.arc(x + w / 2, y + w - d / 2, d / 2, Math.PI * 0.5, Math.PI * 1.5)
    context.fill()
}