const ThreeController = require('./ThreeController').ThreeController
const P5Controller = require('./P5Controller.js').P5Controller


export class Tile {
    constructor(geometry,title = 'los studios') {
        this.discard = this.discard.bind(this)
        let tag = this.getTag(title)
        // this.pc = new P5Controller(title,tag)
        this.tc = new ThreeController(geometry,title,tag)
        // this.pc.registerCanvas = this.tc.registerCanvas
        // this.tc.parentRedraw = this.pc.redraw
        // this.pc.parentRedraw = this.tc.redraw
        // this.tc.discard = this.discard
    }

    discard(){
        this.pc.p.remove()
    }

    getTag(title){
        let l = title.length
        let id = ''
        for(let i=0;i<l*2;i++)
            id += `${Math.floor( Math.random() * 10 )}`
        return id
    }

    async animate() {
        for (let i = 0; i < 32; i++) {
            // this.pc.animate(i)
            this.tc.redraw()
            i++
            await this.pc.sleep(10)
        }
    }
}
