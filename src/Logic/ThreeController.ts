import { ReactComponentElement } from 'react'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import * as THREE from 'three'
import { isMobile } from './values'
export class Rotater{
    _width: number
    _height: number
    w: number
    h: number
    rmax: number
    center: {x:number,y:number}
    constructor(width:number,height:number,center:{x:number,y:number}){
        this._width = width
        this._height = height 

        this.w = width / 2
        this.h = height/ 2

        // determined based off experimentation
        this.rmax = 0.5
        this.center = center
    }

    calculateRotation(x:number,y:number){
        x = this.center.x - x 
        y = this.center.y - y
        // creates tilt effect
        let xr = x/this.w * this.rmax
        let yr = y/this.h * this.rmax
        return [xr,yr]
    }
}

export class ThreeController {
    opacity = 0.2
    // opacity = 1
    geometry: THREE.BufferGeometry
    c:HTMLCanvasElement 
    cdesc: HTMLCanvasElement
    tag: string
    title: string
    mesh: THREE.Mesh
    obj: THREE.Mesh
    rotator: Rotater
    canvasTexture: THREE.CanvasTexture
    hero: string
    heroDiv: CSS3DObject
    heroTexture: THREE.Texture
    descDiv: CSS3DObject
    constructor(geometry: THREE.BufferGeometry,  canvasTitle = 'defaultCanvas0',tag:string) {
        this.geometry = geometry
        this.tag = tag
        this.redraw = this.redraw.bind(this)
        this.hover = this.hover.bind(this)
        this._rotate = this._rotate.bind(this)
        this.registerCanvas = this.registerCanvas.bind(this)
        this.colorize = this.colorize.bind(this)
        this.resetColor = this.resetColor.bind(this)
        this.updateHeroDiv = this.updateHeroDiv.bind(this)
        this.updateDescDiv = this.updateDescDiv.bind(this)
        this.title = canvasTitle
        this.hero = canvasTitle
        let textures = []


        // new THREE.TextureLoader().load( hero,(result)=>{
        //     this.heroTexture = result
        //     //@ts-ignore
        //     this.obj.hero = result
        // } );

        // todo: make this variable on the projects uploaded
        for(let i = 0;i<6;i++){
            //note textures[4] is front facing
            textures.push(
                new THREE.MeshPhongMaterial({
                    color: 'black',
                    opacity: isMobile() ? 1.0 : this.opacity,
                    transparent: true,
                })
            )
        }

        this.mesh = new THREE.Mesh(this.geometry, textures)
        this.obj = this.mesh

        //@ts-ignore
        this.obj.hero = this.hero

        //@ts-ignore
        this.mesh.hover = this.hover
        //@ts-ignore
        this.mesh._rotate = this._rotate
        //@ts-ignore
        this.mesh.colorize = this.colorize
        //@ts-ignore
        this.mesh.resetColor = this.resetColor
        //@ts-ignore
        this.mesh.registerCanvas = this.registerCanvas
        //@ts-ignore
        this.obj.controller = this

        this.rotator = new Rotater(
            //@ts-ignore
            this.geometry.parameters.width,
            //@ts-ignore
            this.geometry.parameters.width,
            this.mesh.position
        )
        
        //@ts-ignore
        this.obj.hero = this.hero
    }

    _rotate(x:number,y:number){
        if(x===0 && y===0){
            this.mesh.rotation.x = 0
            this.mesh.rotation.y = 0
            return
        }
        let rotation = this.rotator.calculateRotation(x,y)
        if(!rotation) return
        this.mesh.rotation.x = rotation[0]
        this.mesh.rotation.y = rotation[1]
    }

    async registerCanvas() {
        this.c = document.getElementById(this.tag) as HTMLCanvasElement
        if(!this.c) return
        // this.cdesc = document.getElementById(`${this.hero}_desc`) as HTMLCanvasElement
        // if(!this.c || !this.cdesc) return
        let ctx = this.c.getContext("2d")

        let texture = new THREE.CanvasTexture(ctx.canvas) 

        //@ts-ignore
        for (let i =0;i<this.mesh.material.length;i++){
            this.mesh.material[i].transperant = false
            this.mesh.material[i].opacity = 1
        }

        this.mesh.material[4] = new THREE.MeshBasicMaterial({
            map: texture
        })

        this.mesh.material[4].map.minFilter = THREE.LinearMipmapNearestFilter
    }

    async redraw() {
        let tmp = this.mesh.material[4]
        this.mesh.material[4] = new THREE.MeshBasicMaterial({
            //@ts-ignore
            map: new THREE.CanvasTexture(this.c)
        })
        try{
            tmp.dispose()
        }catch(e){
            console.log(e);
        }
    }

    async hover(m) {
        //@ts-ignore
    }

    sleep(num) {
        return new Promise(resolve => setTimeout(resolve, num))
    }

    colorize(){
        this.mesh.material[4] = new THREE.MeshPhongMaterial({
           color: "black",
           transparent: true,
           opacity: isMobile() ? 1.0 : this.opacity,
        })
    }

    updateHeroDiv(div: CSS3DObject){
        if(!this.heroDiv) this.heroDiv = div
    }

    updateDescDiv(div: CSS3DObject){
        if(!this.descDiv) this.descDiv = div
    }

    resetColor(){
        this.registerCanvas()
    }
}