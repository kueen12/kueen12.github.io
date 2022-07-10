import { fillRing } from "./Utils.js"

const colorOptions = {
    'w': ['#999999', '#FFFFFF', '#EEEEEE'],
    'b': ['#1989B8', '#35BAF3', '#1EA7E1'],
    'g': ['#5FB13A', '#88E060', '#73CD4B'],
    'y': ['#CDA400', '#FFD948', '#FFCC00'],
    'r': ['#CD5D12', '#FA8132', '#E86A17']
}

const width = 10


const MouseState = {
    NONE: 0,
    PRESS: 1,
    MOVE: 2,
    CLICK: 3,
    LONGCLICK: 4
}

export class RotateIcon {
    constructor(color) {
        this.colors = colorOptions[color]

        this.mouseState = MouseState.NONE
        this.lastPoint = null

    }


    setClick(click) {
        this.click = click
    }

    
    setGeometry(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
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
            let dx = event.offsetX - this.lastPoint.x
            let dy = event.offsetY - this.lastPoint.y
            if (dx * dx + dy * dy >= 100) {
                this.mouseState = MouseState.MOVE
            }
            return true
        }

    }

    mouseup(event) {
        if (this.mouseState == MouseState.PRESS) {
            if (this.click) this.click(event)
            this.mouseState = MouseState.NONE
            this.lastPoint = null
            return true
        }
    }

    collide(x, y) {
        return x >= this.x && x < this.x + this.width
            && y >= this.y && y < this.y + this.height
    }


    render(context) {
        context.fillStyle = this.colors[0]
        fillRing(context, this.x, this.y, this.width, width)
        context.fillStyle = this.colors[1]
        fillRing(context, this.x+2, this.y+2, this.width-4, width-4)
        context.fillStyle = this.colors[2]
        fillRing(context, this.x + 4, this.y + 4, this.width - 8, width-8)
    }
}