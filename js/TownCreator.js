import { GUI } from './GUI.js'
import { TileSet } from './TileSet.js'
import { Town } from './Town.js'


const MouseState = {
    NONE: 0,
    PRESS: 1,
    MOVE: 2,
    CLICK: 3,
    LONGCLICK: 4
}

export class TownCreator {
    constructor(id) {
        this.canvas = document.getElementById(id)
        this.context = this.canvas.getContext('2d')

        this.width = 0
        this.height = 0
        this.isTouch = false

        this.canvas.addEventListener('mousedown', (event) => {
            // console.log('mousedown')
            this.mousedown(event)
        })
        this.canvas.addEventListener('mousemove', (event) => {
            // console.log('mousemove')
            this.mousemove(event)
        })
        this.canvas.addEventListener('mouseup', (event) => {
            // console.log('mouseup')
            this.mouseup(event)
        })

        this.canvas.addEventListener('touchstart', (event) => {
            // console.log('touchstart')
            this.touchstart(event)
        })

        this.canvas.addEventListener('touchmove', (event) => {
            // console.log('touchmove')
            this.touchmove(event)
        })
        this.canvas.addEventListener('touchend', (event) => {
            // console.log('touchend')
            this.touchend(event)

        })

        window.onresize = (event) => {
            this.resize()
        }

        this.mouseState = MouseState.NONE
        this.lastPoint = null

        this.tileSet = new TileSet()
        this.town = new Town(this, this.tileSet)
        this.gui = new GUI(this, this.tileSet)

        this.tile = {
            id: -1,
            dir: 0,
            r: 0,
            c: 0,
            d: 0
        }

        this.resize()
    }

    resize() {
        if (Math.abs(document.body.clientWidth - this.width) >= 5
            || Math.abs(document.body.clientHeight - this.height) >= 5) {
            this.width = document.body.clientWidth
            this.height = document.body.clientHeight

            this.canvas.width = this.width
            this.canvas.height = this.height
            
            this.town.resize()
            this.gui.resize()
        }
    }

    mousedown(event) {
        if (this.isTouch) return
        if (this.gui.mousedown(event)) {
            this.town.highlightSurface = null
            return
        }

        this.mouseState = MouseState.PRESS
        this.longClickId = setTimeout(()=>{
            this.mouseState = MouseState.LONGCLICK
            let tile = this.town.removeTile(event.offsetX,event.offsetY)
            if (tile) {
                this.tile.dir = tile.dir
                this.gui.tilePanel.setSelectIdx(tile.id)
            }
        }, 350)
        this.lastPoint = {
            x: event.offsetX,
            y: event.offsetY
        }
        this.initPoint = {
            x: event.offsetX,
            y: event.offsetY        
        }
    }

    mousemove(event) {
        if (this.isTouch) return
        if (this.gui.mousemove(event)) return
        if (this.mouseState == MouseState.NONE) {
            this.mouseState = MouseState.HOVER
        }
        if (this.mouseState == MouseState.PRESS) {
            let dx = event.offsetX - this.initPoint.x
            let dy = event.offsetY - this.initPoint.y
            if (dx * dx + dy * dy >= 100) {
                this.mouseState = MouseState.MOVE
                if (this.longClickId) {
                    clearTimeout(this.longClickId)
                    this.longClickId = null
                }
            }
        }
        if (this.mouseState == MouseState.MOVE) {
            this.town.move(event.offsetX - this.lastPoint.x, event.offsetY - this.lastPoint.y)
        }
        this.lastPoint = {
            x: event.offsetX,
            y: event.offsetY
        }
        this.town.highlight(event.offsetX, event.offsetY)
        let grid = this.town.attach(event.offsetX, event.offsetY)
        this.tile.r = grid.r
        this.tile.c = grid.c
        this.tile.d = grid.d
    }
    mouseup(event) {
        if (this.isTouch) {
            this.isTouch = false
            return
        }
        if (this.gui.mouseup(event)) return
        if (this.mouseState == MouseState.PRESS) {
            if (this.longClickId) {
                clearTimeout(this.longClickId)
                this.longClickId = null
            }
            this.mouseState = MouseState.CLICK
        }

        if (this.mouseState == MouseState.CLICK) {
            let grid = this.town.attach(event.offsetX,event.offsetY)
            this.town.addTile({
                id: this.tile.id,
                dir: this.tile.dir,
                r: grid.r,
                c: grid.c,
                d: grid.d
            })
        }
        this.mouseState = MouseState.NONE
        this.lastPoint = null
    }

    
    touchstart(event) {
        this.isTouch = true
        if (this.gui.mousedown({
            offsetX: event.changedTouches[0].clientX,
            offsetY: event.changedTouches[0].clientY
        })) {
            this.town.highlightSurface = null
            return
        }

        this.mouseState = MouseState.PRESS
        this.longClickId = setTimeout(()=>{
            this.mouseState = MouseState.LONGCLICK
            let tile = this.town.removeTile(event.changedTouches[0].clientX,event.changedTouches[0].clientY)
            if (tile) {
                this.tile.dir = tile.dir
                this.gui.tilePanel.setSelectIdx(tile.id)
            }
        }, 350)
        this.lastPoint = {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY
        }
        this.initPoint = {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY   
        }
    }

    touchmove(event) {
        this.isTouch = true

        if (this.gui.mousemove({
            offsetX: event.changedTouches[0].clientX,
            offsetY: event.changedTouches[0].clientY
        })) return
        if (this.mouseState == MouseState.NONE) {
            this.mouseState = MouseState.HOVER
        }
        if (this.mouseState == MouseState.PRESS) {
            let dx = event.changedTouches[0].clientX - this.initPoint.x
            let dy = event.changedTouches[0].clientY - this.initPoint.y
            if (dx * dx + dy * dy >= 100) {
                this.mouseState = MouseState.MOVE
                if (this.longClickId) {
                    clearTimeout(this.longClickId)
                    this.longClickId = null
                }
            }
        }
        if (this.mouseState == MouseState.MOVE) {
            this.town.move(event.changedTouches[0].clientX - this.lastPoint.x, event.changedTouches[0].clientY - this.lastPoint.y)
        }
        this.lastPoint = {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY
        }
        this.town.highlight(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
        let grid = this.town.attach(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
        this.tile.r = grid.r
        this.tile.c = grid.c
        this.tile.d = grid.d
    }

    touchend(event) {
        this.isTouch = true

        if (this.gui.mouseup({
            offsetX: event.changedTouches[0].clientX,
            offsetY: event.changedTouches[0].clientY
        })) return
        if (this.mouseState == MouseState.PRESS) {
            if (this.longClickId) {
                clearTimeout(this.longClickId)
                this.longClickId = null
            }
            this.mouseState = MouseState.CLICK
        }

        if (this.mouseState == MouseState.CLICK) {
            let grid = this.town.attach(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
            this.town.addTile({
                id: this.tile.id,
                dir: this.tile.dir,
                r: grid.r,
                c: grid.c,
                d: grid.d
            })
        }
        this.mouseState = MouseState.NONE
        this.lastPoint = null
    }

    run() {
        const that = this
        function loop(tick) {
            that.context.fillStyle = '#d7bda5'
            that.context.fillRect(0, 0, that.width, that.height)
            that.town.render(that.context)
            that.gui.render(that.context)
            requestAnimationFrame(loop)
        }
        requestAnimationFrame(loop)
    }
}