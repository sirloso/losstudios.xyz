const p5 = require('p5')

export class P5Controller {
    constructor(title,tag) {
        this.init = this.init.bind(this)
        this.preload = this.preload.bind(this)
        this.setup = this.setup.bind(this)
        this.draw = this.draw.bind(this)
        this.redraw = this.redraw.bind(this)
        this.title = title
        this.tag = tag
        this.parentRedraw = ()=>{}
        // new p5(this.init, 'p5')
        this.start()
    }
    start(){
        this.canvas = document.createElement("canvas")
        this.canvas.id = this.tag
        this.canvas.style.visibility = "hidden"

        let width = 256
        let height = 256
        this.canvas.style.width = width + 'px'
        this.canvas.style.height = height + 'px'

        this.canvas.width = width * window.devicePixelRatio
        this.canvas.height = height * window.devicePixelRatio

        let ctx = this.canvas.getContext("2d")

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        let fontSize = window.innerWidth < 800 ? 150 : 40
        
        ctx.fillStyle = "white"
        ctx.font = `${fontSize}px Gruppo`;

        let height2 = ctx.canvas.height / 2

        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        let width2 = ctx.canvas.width / 2
        ctx.fillText(this.title,width2,height2);

        document.getElementById("scene").appendChild(this.canvas)
        setTimeout(()=>{
            if(this.registerCanvas) this.registerCanvas()
        },2000)
    }
    init(p) {
        this.testBin = ''
        for (let c of this.title) {
            this.testBin += c.charCodeAt(0).toString(2)
        }
        if(this.testBin.length<500) for(let i=0;i<600;i++)this.testBin += `${Math.floor(Math.random()*2)}`
        this.p = p
        this.w = 600
        this.h = 600
        this.mode = 2
        this.gruppo
        this.textData = []
        this.squareData = []
        this.len = this.testBin.length

        this.rectW = 30
        this.rectH = this.rectW
        this.rowCount = 30
        this.fontSize = 20
        this.textX = this.rectW * 1 / 2
        this.textY = this.textX + 6

        for (let i = 0; i < this.len; i++) {
            let offset = i % this.rowCount * this.rectW
            let offsetRow = Math.floor(i / this.rowCount) * this.rectW
            
            this.squareData.push({
                x: offset,
                y: offsetRow,
                color: [255,255,255]
            })
            this.textData.push({
                x: this.textX + offset,
                y: this.textY + offsetRow,
                data: this.testBin[i]
            })
        }

        this.p.setup = this.setup
        this.p.preload = this.preload
        this.p.draw = this.draw
    }

    sleep(num) {
        return new Promise(resolve => setTimeout(resolve, num))
    }

    updateMode(m) {
        this.mode = m
    }

    redraw(m) {
        if(!m) return
        if(m!==this.mode){
            this.updateMode(m)
            this.draw()
        }
    }

    async draw() {
        console.log(this.title)
         if (this.mode === 2) {
            // main 
            let w = this.w 
            let h = this.h
            this.p.fill(25,25,25)
            this.p.rect(0, 0, w, h)
            // await this.sleep(100)
            this.p.fill(255,255,255)
            this.p.textFont("Gruppo")
            this.p.textSize(100)
            this.p.textAlign(this.p.CENTER)
            this.p.text(this.title, w / 2, h / 2 +25)
            this.p.noLoop()
            this.parentRedraw()
        } 
        if(!this.c){
            this.c = document.getElementById('defaultCanvas0')
            await this.sleep(100)
            this.registerCanvas()
            this.parentRedraw()
        }
    }

    preload() {
        this.gruppo = this.p.loadFont('./Gruppo-Regular.c1045fba.ttf')
    }

    setup() {
        this._c = this.p.createCanvas(this.w,this.h)
        this._c.id(this.tag)
        // this._c.cl
        this._c.canvas.style.visibility = "hidden"
    }

    animate(i = 0) {
        if (i > 31) {
            return false
        }

        // colors
        let reds = []
        for (let q = 100; q < 225; q += 4) reds.push([q, 0, 0])

        // grab data
        let texts = this.textData.map((t, i) => {
            if (t.data === '1') return {
                "i": i,
                data: t.data,
                x: t.x,
                y: t.y
            }
        }).filter(t => t).flat()

        let squares = texts.map(t => {
            let _t = this.squareData[t.i]
            _t.color = reds[i]
            return _t
        }).flat()

        // draw animation
        for (let idx = 0; idx < squares.length; idx++) {
            this.redrawSquare(this.squares[idx], this.textData[idx])
            // await sleep(1)
        }

        return true
    }

    async redrawSquare(squareData, textData, drawText=false) {
        if(this.mode === 2) return
        if (!squareData.x && !squareData.y && !squareData.color) throw new Error('square Data needs x and y members')
        if (!textData.x && !textData.y) throw new Error('text Data needs x and y members')
        // this.p.fill(...squareData.color)
        this.p.fill(255,255,255)
        this.p.rect(
            squareData.x, squareData.y, this.rectW, this.rectH
        )
        if(textData.data === "1"){
            this.p.fill(255, 0, 0)
        }else{
            this.p.fill(0, 0, 0)
        }
        this.p.text(textData.data, textData.x, textData.y)
        this.p.textSize(this.fontSize)
        this.p.textAlign(this.p.CENTER)
        // await this.sleep(100)
        this.p.fill(255,255,255)
        this.p.rect(
            0,0, this.rectW, this.rectH
        )
    }

}