import { CheckIcon } from "./CheckIcon.js"
import { RotateIcon } from "./RotateIcon.js"
import { ScrollBar, ScrollBarOrientation } from "./ScrollBar.js"
import { TilePanel } from "./TilePanel.js"

export class GUI {
    constructor(game, tileSet) {
        this.game = game
        this.tilePanel = new TilePanel(tileSet, 'b')
        this.tilePanel.setSelectChange((id) => {
            this.game.tile.id = id
        })

        this.scrollBar = new ScrollBar(0.125, 1, ScrollBarOrientation.VERTICAL, 'b')
        this.scrollBar.setValueChange((v) => {
            this.game.town.scaleTo(v)
        })
        this.scrollBar.setValue(0.25)

        this.rotateIcon = new RotateIcon('b')
        this.rotateIcon.setClick((e) => {
            if (this.game.tile.id >= 0) {
                this.game.tile.dir += 1
                this.game.tile.dir %= 4
            } else {
                this.game.town.rotate()
            }
        })


        this.checkIcon = new CheckIcon('b')
        this.checkIcon.setClick((e) => {
            // this.game.tile.id = -1
            this.tilePanel.setSelectIdx(-1)
        })
    }

    resize() {
        this.tilePanel.setGeometry(0, 50, 100, this.game.height-100)
        this.scrollBar.setGeometry(this.game.width - 50, 20, 30, 200)
        this.rotateIcon.setGeometry(this.game.width - 50, this.game.height - 50, 40, 40)
        this.checkIcon.setGeometry(this.game.width - 100, this.game.height - 50, 40, 40)
    }

    mousemove(event) {
        if (this.tilePanel.mousemove(event)) return true
        if (this.scrollBar.mousemove(event)) return true
        if (this.rotateIcon.mousemove(event)) return true
        if (this.checkIcon.mousemove(event)) return true

    }

    mousedown(event) {
        if (this.tilePanel.mousedown(event)) return true
        if (this.scrollBar.mousedown(event)) return true
        if (this.rotateIcon.mousedown(event)) return true
        if (this.checkIcon.mousedown(event)) return true
    }

    mouseup(event) {
        if (this.tilePanel.mouseup(event)) return true
        if (this.scrollBar.mouseup(event)) return true
        if (this.rotateIcon.mouseup(event)) return true
        if (this.checkIcon.mouseup(event)) return true

    }

    render(context) {
        this.tilePanel.render(context)
        this.scrollBar.render(context)
        this.rotateIcon.render(context)
        this.checkIcon.render(context)
    }
}