import { ThreeController } from './ThreeController'
import * as Three from 'three'
import { P5Controller } from './P5Controller'
import { ReactComponentElement } from 'react'
import { SlideShow } from '../Components/Gallery'

export class Tile {
    tc: ThreeController
    _canvas: HTMLElement
    canvasID: string
    color: string
    gallery: [ReactComponentElement<any>,string]
    pc: P5Controller

    constructor(geometry: Three.BufferGeometry, title = 'los studios', images: Array<string>,ga: Array<any> ) {
        this.discard = this.discard.bind(this)
        let tag = this.getTag(title)
        this.pc = new P5Controller(title,tag)

        let titles = ga.map((el)=>el.title) 
        if(!titles.includes(title)){
            //@ts-ignore
            this.gallery = SlideShow(images,title)
            ga.push({ title:title ,gallery:this.gallery})
        } 

        this.tc = new ThreeController(geometry, title, tag,this.gallery[0],this.gallery[1])

        //@ts-ignore
        this.pc.registerCanvas = this.tc.registerCanvas
        //@ts-ignore
        this.tc.parentRedraw = this.pc.redraw
        this.pc.parentRedraw = this.tc.redraw
        //@ts-ignore
        this.tc.discard = this.discard

        // this.tc.registerCanvas()
    }

    setColor(color:string){
        this.color = color
    }

    discard() {
        this.pc.p.remove()
    }

    getTag(title) {
        let l = title.length
        let id = ''
        for (let i = 0; i < l * 2; i++)
            id += `${Math.floor(Math.random() * 10)}`
        return id
    }

    async animate() {
        for (let i = 0; i < 32; i++) {
            // this.pc.animate(i)
            this.tc.redraw()
            i++
            // await this.pc.sleep(10)
        }
    }
}
