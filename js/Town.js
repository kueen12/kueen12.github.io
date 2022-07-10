import { collide } from "./Utils.js"

const tileOffset = {
    'x': [-110, 50],
    'y': [110, 50],
    'z': [0, -110]
}
const tileSize = [256, 352]
const sSurface = [{x:128, y:134}, {x:18, y:184}, {x:128, y:234}, {x:238, y:184}]
const lSurface = [{x:18, y:184}, {x:128, y:234}, {x:128, y:344}, {x:18, y:294}]
const rSurface = [{x:128, y:234}, {x:238, y:184}, {x:238, y:294}, {x:128, y:344}]

export class Town {
    constructor(game, tileSet) {
        this.game = game

        this.x = 0
        this.y = 0
        this.tileSet = tileSet
        this.tiles = new Array()
        this.radio = 1

        this.tileWidth = tileSize[0]
        this.tileHeight = tileSize[1]
        this.highlightSurface = null
    }

    addTile(tile) {
        if (tile.id < 0) return
        for (let i = 0; i < this.tiles.length; ++i) {
            if (this.tiles[i].r == tile.r
                    && this.tiles[i].c == tile.c
                    && this.tiles[i].d == tile.d) {
                this.tiles[i].id = tile.id
                this.tiles[i].dir = tile.dir
                return
            }
        }

        this.tiles.push(tile)
        let point = this.grid2Point(tile.c, tile.r, tile.d)
        tile.x = point.x - 128 * this.radio
        tile.y = point.y - 242 * this.radio
        this.tiles.sort((a, b) => {
            if ((a.c + a.r + a.d) != (b.c + b.r + b.d)) return (a.c + a.r + a.d) > (b.c + b.r + b.d) ? 1 : -1
            if (a.d != b.d) return a.d < b.d ? 1 : -1
            return a.r > b.r ? 1 : -1
        })
    }

    moveTo(x, y) {
        this.x = x
        this.y = y
        this.layout()
    }

    move(dx, dy) {
        this.x += dx
        this.y += dy
        this.layout()
    }

    scaleTo(radio) {
        let grid = {
            c: ((this.game.height/2 - this.y) / 100 - (this.game.width/2 - this.x)/ 220) / this.radio,
            r: ((this.game.height/2 - this.y) / 100 + (this.game.width/2 - this.x)/ 220) / this.radio
        }
        this.radio = radio
        let point = this.grid2Point(grid.c, grid.r, 0)
        this.move(this.game.width / 2 - point.x, this.game.height / 2 - point.y)

        this.tileWidth = tileSize[0] * this.radio
        this.tileHeight = tileSize[1] * this.radio
        this.layout()
    }

    layout() {
        for (let i = 0; i < this.tiles.length; ++i) {
            if (this.tiles[i].id < 0) continue
            let point = this.grid2Point(this.tiles[i].c, this.tiles[i].r, this.tiles[i].d)
            this.tiles[i].x = point.x - 128 * this.radio
            this.tiles[i].y = point.y - 242 * this.radio
        }
    }

    resize() {
        // this.moveTo(this.game.width / 2, this.game.height / 2)
    }

    render(context) {

        context.strokeStyle = '#ffffff'

        let leftTop = this.point2Grid(0, 0)
        let rightTop = this.point2Grid(this.game.width, 0)
        let leftBottom = this.point2Grid(0, this.game.height)
        let rightBottom = this.point2Grid(this.game.width, this.game.height)

        for (let i = leftTop.r; i <= rightBottom.r; ++i) {
            context.beginPath()
            let point = this.grid2Point(rightTop.c, i, 0)
            context.moveTo(point.x, point.y)
            point = this.grid2Point(leftBottom.c, i, 0)
            context.lineTo(point.x, point.y)
            context.stroke()
        }

        for (let i = rightTop.c; i <= leftBottom.c; ++i) {
            context.beginPath()
            let point = this.grid2Point(i, leftTop.r, 0)
            context.moveTo(point.x, point.y)
            point = this.grid2Point(i, rightBottom.r, 0)
            context.lineTo(point.x, point.y)
            context.stroke()
        }

        for (let i = 0; i < this.tiles.length; ++i) {
            if (this.tiles[i].id < 0) continue
            if (this.tiles[i].x + this.tileWidth < 0) continue
            if (this.tiles[i].y + this.tileHeight < 0) continue
            if (this.tiles[i].y >= this.game.height) continue
            if (this.tiles[i].x >= this.game.width) continue
            context.drawImage(this.getTile(i), 
                this.tiles[i].x, this.tiles[i].y, 
                this.tileWidth, this.tileHeight)
        }

        if (this.game.tile.id >= 0) {
            let img = this.tileSet.at(this.game.tile.id, this.game.tile.dir)
            let point = this.grid2Point(this.game.tile.c, this.game.tile.r, this.game.tile.d)
            context.drawImage(img, point.x  - 128 * this.radio, point.y - 242 * this.radio, this.tileWidth, this.tileHeight)
        }

        if (this.highlightSurface) {
            context.strokeStyle = '#ffcc00'
            context.beginPath()
            context.moveTo(this.highlightSurface[0].x, this.highlightSurface[0].y)
            for (let i = this.highlightSurface.length-1; i >= 0; --i) 
                context.lineTo(this.highlightSurface[i].x, this.highlightSurface[i].y)
            context.stroke()
        }
    }

    getTile(index) {
        return this.tileSet.at(this.tiles[index].id, this.tiles[index].dir)
    }

    grid2Point(c, r, d) {
        return {
            x: this.x + c * tileOffset['x'][0] * this.radio + r * tileOffset['y'][0] * this.radio + d * tileOffset['z'][0] * this.radio,
            y: this.y + c * tileOffset['x'][1] * this.radio + r * tileOffset['y'][1] * this.radio + d * tileOffset['z'][1] * this.radio
        }
    }

    point2Grid(x, y) {
        return {
            c: Math.floor(((y - this.y) / 100 - (x - this.x)/ 220) / this.radio),
            r: Math.floor(((y - this.y) / 100 + (x - this.x)/ 220) / this.radio),
        }
    }

    attach(x, y) {
        for (let i = this.tiles.length-1; i >= 0; --i) {
            if (this.tiles[i].id < 0) continue
            let point = {
                x: (x - this.tiles[i].x) / this.radio,
                y: (y - this.tiles[i].y) / this.radio
            }

            if (collide(sSurface, point)) {
                return {
                    r: this.tiles[i].r,
                    c: this.tiles[i].c,
                    d: this.tiles[i].d+1
                }
            }
            if (collide(lSurface, point)) {
                return {
                    r: this.tiles[i].r,
                    c: this.tiles[i].c+1,
                    d: this.tiles[i].d
                }
            }
            if (collide(rSurface, point)) {
                return {
                    r: this.tiles[i].r+1,
                    c: this.tiles[i].c,
                    d: this.tiles[i].d
                }
            }
        }
        let grid = this.point2Grid(x, y)
        return {
            r: grid.r,
            c: grid.c,
            d: 0
        }
    }

    removeTile(x, y) {
        for (let i = this.tiles.length-1; i >= 0; --i) {
            if (this.tiles[i].id < 0) continue
            let point = {
                x: (x - this.tiles[i].x) / this.radio,
                y: (y - this.tiles[i].y) / this.radio
            }

            if (collide(sSurface, point) || collide(lSurface, point) || collide(rSurface, point)) {
                let tile = {
                    id: this.tiles[i].id,
                    dir: this.tiles[i].dir
                }
                this.tiles[i].id = -1
                this.highlight(x, y)
                return tile
            }
        }
        return null
    }
    
    rotate() {
        let center = this.point2Grid(this.game.width / 2, this.game.height / 2)
        for (let i = 0; i < this.tiles.length; ++i) {
            if (this.tiles[i].id < 0) continue
            this.tiles[i].dir += 1
            this.tiles[i].dir %= 4

            let t = this.tiles[i].r - center.r
            this.tiles[i].r = this.tiles[i].c - center.c + center.r
            this.tiles[i].c = - t + center.c
        }
        this.tiles.sort((a, b) => {
            if ((a.c + a.r + a.d) != (b.c + b.r + b.d)) return (a.c + a.r + a.d) > (b.c + b.r + b.d) ? 1 : -1
            if (a.d != b.d) return a.d < b.d ? 1 : -1
            return a.r > b.r ? 1 : -1
        })
        this.layout()
    }
    

    highlight(x, y) {
        this.highlightSurface = new Array()
        for (let i = this.tiles.length-1; i >= 0; --i) {
            if (this.tiles[i].id < 0) continue
            let point = {
                x: (x - this.tiles[i].x) / this.radio,
                y: (y - this.tiles[i].y) / this.radio
            }

            if (collide(sSurface, point)) {
                for (let j = 0; j < sSurface.length; ++j) {
                    this.highlightSurface.push({
                        x: this.tiles[i].x + sSurface[j].x * this.radio,
                        y: this.tiles[i].y + sSurface[j].y * this.radio,
                    })
                }
                return
            }
            if (collide(lSurface, point)) {
                for (let j = 0; j < lSurface.length; ++j) {
                    this.highlightSurface.push({
                        x: this.tiles[i].x + lSurface[j].x * this.radio,
                        y: this.tiles[i].y + lSurface[j].y * this.radio,
                    })
                }
                return
            }
            if (collide(rSurface, point)) {
                for (let j = 0; j < rSurface.length; ++j) {
                    this.highlightSurface.push({
                        x: this.tiles[i].x + rSurface[j].x * this.radio,
                        y: this.tiles[i].y + rSurface[j].y * this.radio,
                    })
                }
                return
            }
        }
        let grid = this.point2Grid(x, y)
        this.highlightSurface.push(this.grid2Point(grid.c, grid.r, 0))
        this.highlightSurface.push(this.grid2Point(grid.c+1, grid.r, 0))
        this.highlightSurface.push(this.grid2Point(grid.c+1, grid.r+1, 0))
        this.highlightSurface.push(this.grid2Point(grid.c, grid.r+1, 0))
    }

}