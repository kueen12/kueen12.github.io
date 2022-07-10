import { fillCircle, fillRadiusRect } from "./Utils.js"

const colorOptions = {
    'w': ['#999999', '#FFFFFF', '#EEEEEE'],
    'b': ['#1989B8', '#35BAF3', '#1EA7E1'],
    'g': ['#5FB13A', '#88E060', '#73CD4B'],
    'y': ['#CDA400', '#FFD948', '#FFCC00'],
    'r': ['#CD5D12', '#FA8132', '#E86A17']
}
const radius = 5

const tileSize = [32, 44]

const margin = 10


const MouseState = {
    NONE: 0,
    PRESS: 1,
    MOVE: 2,
    CLICK: 3,
    LONGCLICK: 4
}

export class TilePanel {
    constructor(tileSet, color) {
        this.tileSet = tileSet
        this.selectIdx = -1
        this.colors = colorOptions[color]

        this.scrollY = 0

        this.mouseState = MouseState.NONE
        this.lastPoint = null
    }

    setGeometry(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height


        this.cols = Math.floor(this.width / (tileSize[0] + margin))
        this.rows = Math.ceil(this.tileSet.size() / this.cols)

        this.margin = (this.width - tileSize[0] * this.cols) / (this.cols + 1)
        
    }

    setSelectChange(selectChange) {
        this.selectChange = selectChange
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

        if (this.mouseState == MouseState.MOVE) {
            this.scrollY -= event.offsetY - this.lastPoint.y
            if (this.scrollY >= this.rows * (tileSize[1] + this.margin) - this.height) {
                this.scrollY = this.rows * (tileSize[1] + this.margin) - this.height
            }
            if (this.scrollY < 0) this.scrollY = 0
            this.lastPoint = {
                x: event.offsetX,
                y: event.offsetY
            }
            return true
        }
    }

    selectTile(x, y) {
        let c = Math.floor((x - this.x - this.margin / 2) / (tileSize[0] + this.margin))
        let r = Math.floor((y + this.scrollY - this.y - this.margin / 2) / (tileSize[1] + this.margin))
        if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
            this.selectIdx = r * this.cols + c
        } else {
            this.selectIdx = -1
        }

        if (this.selectChange) this.selectChange(this.selectIdx)
    }

    getSelectIdx() {
        return this.selectIdx
    }

    setSelectIdx(selectIdx) {
        this.selectIdx = selectIdx
        if (this.selectChange) this.selectChange(selectIdx)
    }

    mouseup(event) {
        if (this.mouseState == MouseState.MOVE) {
            this.mouseState = MouseState.NONE
            this.lastPoint = null
            return true
        }
        if (this.mouseState == MouseState.PRESS) {
            this.selectTile(event.offsetX, event.offsetY)
            this.mouseState = MouseState.NONE
            this.lastPoint = null
            return true
        }
    }

    render(context) {
        context.strokeStyle = 'none'
        context.fillStyle = this.colors[0]
        fillRadiusRect(context, this.x, this.y, this.width, this.height, radius)
        context.fillStyle = this.colors[1]
        fillRadiusRect(context, this.x+2, this.y+2, this.width-4, this.height-4, radius)
        context.fillStyle = this.colors[2]
        fillRadiusRect(context, this.x+4, this.y+4, this.width-8, this.height-8, radius)

        for (let i = 0; i < this.tileSet.size(); ++i) {
            let r = Math.floor(i / this.cols)
            let c = i % this.cols

            let x = this.x + this.margin + (this.margin + tileSize[0]) * c
            let y = this.y + this.margin + (this.margin + tileSize[1]) * r - this.scrollY
            if (y < this.y) continue
            if (y + tileSize[1] >= this.y + this.height) continue
            context.drawImage(this.tileSet.at(i, 0), x, y, tileSize[0], tileSize[1])

            if (this.selectIdx == i) {
                context.fillStyle = '#FFCC00'
                fillCircle(context, x+5, y+5, 5)
            }
        }
    }

    collide(x, y) {
        return x >= this.x && x < this.x + this.width
            && y >= this.y && y < this.y + this.height
    }
}