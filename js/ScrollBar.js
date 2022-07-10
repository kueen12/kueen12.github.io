import { fillCircle, fillPentagonRight, strokeLine } from "./Utils.js"

const colorOptions = {
    'w': ['#999999', '#FFFFFF', '#EEEEEE'],
    'b': ['#1989B8', '#35BAF3', '#1EA7E1'],
    'g': ['#5FB13A', '#88E060', '#73CD4B'],
    'y': ['#CDA400', '#FFD948', '#FFCC00'],
    'r': ['#CD5D12', '#FA8132', '#E86A17']
}

export const ScrollBarOrientation = {
    VERTICAL: 0,
    HORIZONTAL: 1
}

const MouseState = {
    NONE: 0,
    PRESS: 1,
    MOVE: 2,
    CLICK: 3,
    LONGCLICK: 4
}

const radius = 3
const pointWidth = 20


export class ScrollBar {
    constructor(vMin, vMax, orientation, color) {
        this.vMin = vMin
        this.vMax = vMax
        this.colors = colorOptions[color]
        this.value = (vMin + vMax) / 2
        this.orientation = orientation

        this.mouseState = MouseState.NONE
        this.lastPoint = null
    }

    setGeometry(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    setValueChange(valueChange) {
        this.valueChange = valueChange
    }

    setValue(value) {
        this.value = value
        if (this.valueChange) this.valueChange(value)
    }


    mousedown(event) {
        if (!this.collide(event.offsetX, event.offsetY)) return false
        this.mouseState = MouseState.PRESS
        this.lastPoint = {
            x: event.offsetX,
            y: event.offsetY
        }
        return true
    }


    mousemove(event) {
        if (this.mouseState == MouseState.PRESS) {
            if (this.orientation == ScrollBarOrientation.VERTICAL) {
                let v = (event.offsetY - this.lastPoint.y) / (this.height - radius * 4 - pointWidth)
                this.value += v * (this.vMax - this.vMin)
                if (this.value < this.vMin) this.value = this.vMin
                if (this.value > this.vMax) this.value = this.vMax
                if (this.valueChange) this.valueChange(this.value)
            }
            this.lastPoint = {
                x: event.offsetX,
                y: event.offsetY
            }
            return true
        }

    }

    mouseup(event) {
        if (this.mouseState == MouseState.PRESS) {
            this.mouseState = MouseState.NONE
            this.lastPoint = null
            return true
        }
    }

    collide(x, y) {
        let v = (this.height - radius * 4 - pointWidth) * (this.value - this.vMin) / (this.vMax - this.vMin)
        return x >= this.x && x < this.x + this.width
            && y >= radius*2 + pointWidth + v && y < radius*2 + pointWidth + v + pointWidth
    }

    render(context) {
        if (this.orientation == ScrollBarOrientation.VERTICAL) {
            context.lineWidth = 2
            context.strokeStyle = '#ffffff'
            strokeLine(context, this.x + this.width / 3-1, this.y + radius, this.x+this.width/3-1, this.y+this.height - radius * 2)
            context.strokeStyle = '#999999'
            strokeLine(context, this.x + this.width / 3+1, this.y + radius, this.x+this.width/3+1, this.y+this.height - radius * 2)
            context.fillStyle = '#ffffff'
            fillCircle(context, this.x + this.width / 3-1, this.y + radius, radius)
            fillCircle(context, this.x + this.width / 3-1, this.y+this.height - radius * 2, radius)
            context.fillStyle = '#999999'
            fillCircle(context, this.x + this.width / 3+1, this.y + radius, radius)
            fillCircle(context, this.x + this.width / 3+1, this.y+this.height - radius * 2, radius)

            let v = (this.height - radius * 4 - pointWidth) * (this.value - this.vMin) / (this.vMax - this.vMin)

            context.fillStyle = this.colors[0]
            fillPentagonRight(context, this.x, radius*2 + pointWidth + v, this.width, pointWidth, radius)
            context.fillStyle = this.colors[1]
            fillPentagonRight(context, this.x + 2, radius*2 + pointWidth+ v + 2, this.width - 4, pointWidth - 4, radius)
            context.fillStyle = this.colors[2]
            fillPentagonRight(context, this.x + 4, radius*2 + pointWidth + v + 4, this.width - 8, pointWidth - 8, radius)
        
        } else {
            context.lineWidth = 2
            context.strokeStyle = '#ffffff'
            strokeLine(context, this.x + radius, this.y + this.height / 2 - 1, this.x + this.width - radius * 2, this.y + this.height / 2 - 1)
            context.strokeStyle = '#999999'
            strokeLine(context, this.x + radius, this.y + this.height / 2 + 1, this.x + this.width - radius * 2, this.y + this.height / 2 + 1)
            context.fillStyle = '#ffffff'
            fillCircle(context, this.x + radius, this.y + this.height / 2 - 1, radius)
            fillCircle(context, this.x + this.width - radius * 2, this.y + this.height / 2 - 1, radius)
            context.fillStyle = '#999999'
            fillCircle(context, this.x + radius, this.y + this.height / 2 + 1, radius)
            fillCircle(context, this.x + this.width - radius * 2, this.y + this.height / 2 + 1, radius)
        }
    }
}