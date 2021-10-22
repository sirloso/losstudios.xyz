import { Rotater } from './ThreeController'
import * as Three from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'

export class Panel {
    canvasID: string
    color: string
    mesh: THREE.Mesh
    obj: THREE.Object3D
    rotator: Rotater
    geometry: Three.BufferGeometry
    div: HTMLElement
    divObj: CSS3DObject
    divMaterial: Three.MeshBasicMaterial
    renderer: CSS3DRenderer

    constructor(
        geometry: Three.BufferGeometry,
        div: HTMLElement,
        sceneBoundingBox: DOMRect,
        color: string | Three.Color = "white",
        createRenderer: boolean = true
    ) {
        this.geometry = geometry
        this.obj = new Three.Object3D()

        this.discard = this.discard.bind(this)
        this._rotate = this._rotate.bind(this)

        this.divMaterial = new Three.MeshBasicMaterial({
            color: color,
            side: Three.DoubleSide,
            opacity: 1,
            blending: Three.NoBlending,
        })

        if (createRenderer) this.setupCSSRenderer(sceneBoundingBox)

        div.style.opacity = "0.999"
        this.divObj = new CSS3DObject(div)

        //@ts-ignore
        this.obj.css3dObject = this.divObj

        this.obj.add(this.divObj)


        this.mesh = new Three.Mesh(this.geometry, this.divMaterial)
        //@ts-ignore
        this.obj.lightShadowMesh = this.mesh
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true

        // this.divObj.position.set(0,0,50)
        // this.mesh.position.set(0,0,50)

        this.obj.add(this.mesh)
    }

    setupCSSRenderer(sbb: DOMRect) {
        this.renderer = new CSS3DRenderer()
        let r = this.renderer

        r.setSize(sbb.width, sbb.height)
        r.domElement.style.position = 'absolute';
        r.domElement.style.top = "0";
    }

    _rotate(x: number, y: number) {
        if (x === 0 && y === 0) {
            this.mesh.rotation.x = 0
            this.mesh.rotation.y = 0
            return
        }
        let rotation = this.rotator.calculateRotation(x, y)
        if (!rotation) return
        this.mesh.rotation.x = rotation[0]
        this.mesh.rotation.y = rotation[1]
    }

    setColor(color: string) {
        this.color = color
    }

    discard() {
    }

}

export class WorkPanel {
    geometry: Three.BoxGeometry
    inTransition: boolean
    mesh: Three.Mesh
    photos: Array<string>
    visiible: boolean
    homeColor: Three.Color
    obj: Three.Object3D
    cssObj: CSS3DObject
    tmpDiv: CSS3DObject
    constructor() {
        this.updateVisibility = this.updateVisibility.bind(this)
        this.hover = this.hover.bind(this)

        let scale = 1.5
        // set up geometry and mesh
        if (window.innerWidth < 800) this.geometry = new Three.BoxGeometry(1000 , 1250 , 0.1)
        else this.geometry = new Three.BoxGeometry(700 * scale , 500 * scale, 0.1)
        let textures: Array<Three.MeshBasicMaterial> = []
        //@ts-ignore
        let color = window.color ? window.color : Math.floor(Math.random() * 16777215).toString(16)
        this.homeColor = new Three.Color(`#${color}`)

        for (let i = 0; i < 6; i++) {
            textures.push(
                new Three.MeshBasicMaterial({
                    color: this.homeColor,
                    wireframe: false,
                    side: Three.DoubleSide,
                    opacity: 1,
                    blending: Three.NoBlending,
                })
            )
        }

        this.obj = new Three.Object3D()

        let div = document.getElementById("workwork")
        div.style.opacity = "0.999"
        div.style.width = "500px"
        div.style.height = "500px"
        this.cssObj = new CSS3DObject(div)
        //@ts-ignore
        // this.obj.css3dObject = this.cssObj

        //@ts-ignore
        this.mesh = new Three.Mesh(this.geometry, textures)
        //@ts-ignore
        this.mesh.getParent = () => { return this }
        // this.mesh.hover = this.hover
        //@ts-ignore
        this.mesh._rotate = () => { }

        this.obj.add(this.mesh)
        this.obj.add(this.cssObj)
        //@ts-ignore
        this.obj.hover = this.hover

    }

    updateVisibility(visiible: boolean = this.visiible) {
        try {
            // update mesh 
            this.visiible = visiible
        } catch (e) {
            console.log("unable to update visibility", e)
        }
    }

    hover(newColor: string | CSS3DObject) {
        try {
            if (!newColor || newColor == "") return
            // let newMesh = new Three.MeshBasicMaterial()
            // newMesh.copy(newColor)
            // let oldm:Three.MeshBasicMaterial = this.mesh.material[4]
            // this.mesh.material[4] = newColor
            // if(oldm) oldm.dispose()

            //todo: make this a 3d object
            // let oldm: Three.MeshBasicMaterial = this.mesh.material[4]
            // this.mesh.material[4] = new Three.MeshBasicMaterial({
            //     map: newColor,
            // })
            // if (oldm) oldm.dispose()

            // implementing div lookup here
            // in the chance that react isn't fast enough to create gallery component
            if (!this.tmpDiv) {
                // console.log(newColor)
                if(typeof newColor === "string"){

                let div = document.getElementById(newColor)
                // console.log("DLJ",div)
                this.tmpDiv = new CSS3DObject(div)

                this.cssObj.parent.remove(this.cssObj)
                this.obj.matrixWorldNeedsUpdate = true

                // this.tmpDiv.position.copy(this.obj.position)
                this.obj.add(this.tmpDiv)

                this.obj.matrixWorldNeedsUpdate = true

                let arrows = Array.from(document.getElementsByClassName("arrow"))
                arrows.forEach((e)=>{ 
                    //@ts-ignore
                    e.style.visibility = "hidden" 
                }) 

                return this.tmpDiv
                }else{
                        // console.log(newColor)
                        this.cssObj.parent.remove(this.cssObj)
                        this.obj.add(newColor)
                        this.obj.matrixWorldNeedsUpdate = true
                        this.tmpDiv = newColor
                }
            }
        } catch (e) {
            console.log("unable to update panel color", e)
        }
    }

    resetColor() {
        if (this.tmpDiv) {
            this.tmpDiv.parent.remove(this.tmpDiv)
            this.obj.add(this.cssObj)
            this.obj.matrixWorldNeedsUpdate = true
            this.tmpDiv = null
        }
    }
}

export class ButtonPanel{
    geometry: Three.BoxGeometry
    material: Three.MeshBasicMaterial
    mesh: Three.Mesh

    constructor(width: number,height: number){
        this.geometry =  new Three.BoxGeometry(width,height,5)
        this.material = new Three.MeshBasicMaterial({color: "black"})
        this.mesh = new Three.Mesh(this.geometry,this.material)
    }
}