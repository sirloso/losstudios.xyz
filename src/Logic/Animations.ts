import { Tween } from '@tweenjs/tween.js'
import * as three from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

export class WorkPanel {
    geometry: three.BoxGeometry
    inTransition: boolean
    mesh: three.Mesh
    photos: Array<string>
    visiible: boolean
    homeColor: three.Color
    obj: three.Object3D
    cssObj: CSS3DObject
    constructor() {
        this.updateVisibility = this.updateVisibility.bind(this)
        this.hover = this.hover.bind(this)

        // set up geometry and mesh
        if (window.innerWidth < 800) this.geometry = new three.BoxGeometry(25, 45, 0.1)
        else this.geometry = new three.BoxGeometry(25, 20, 0.1)
        let textures: Array<three.MeshBasicMaterial> = []
        //@ts-ignore
        let color = window.color ? window.color : Math.floor(Math.random() * 16777215).toString(16)
        this.homeColor = new three.Color(`#${color}`)

        for (let i = 0; i < 6; i++) {
            textures.push(
                new three.MeshBasicMaterial({
                    color: this.homeColor,
                    wireframe: false,
                    side: three.DoubleSide,
                    opacity: 1,
                    blending: three.NoBlending,
                })
            )
        }

        this.obj = new three.Object3D()

        let div = document.getElementById("workwork")
        div.style.opacity = "0.999"
        div.style.width ="25px"
        div.style.height = "20px"
        this.cssObj = new CSS3DObject(div)
        //@ts-ignore
        this.obj.css3dObject = this.cssObj
        this.obj.add(this.cssObj)

        //@ts-ignore
        this.mesh = new three.Mesh(this.geometry, textures)
        // this.mesh.hover = this.hover
        //@ts-ignore
        this.mesh._rotate = () => { }

        this.obj.add(this.mesh)
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

    hover(newColor: string) {
        try {
            if (!newColor || newColor == "") return
            // let newMesh = new three.MeshBasicMaterial()
            // newMesh.copy(newColor)
            // let oldm:three.MeshBasicMaterial = this.mesh.material[4]
            // this.mesh.material[4] = newColor
            // if(oldm) oldm.dispose()

            //todo: make this a 3d object
            // let oldm: three.MeshBasicMaterial = this.mesh.material[4]
            // this.mesh.material[4] = new three.MeshBasicMaterial({
            //     map: newColor,
            // })
            // if (oldm) oldm.dispose()

            // implementing div lookup here
            // in the chance that react isn't fast enough to create gallery component
            let div = document.getElementById(newColor)
            let tmpDiv = new CSS3DObject(div)

            console.log(div)

            this.obj.children[0] = tmpDiv
            this.obj.matrixWorldNeedsUpdate = true
        } catch (e) {
            console.log("unable to update panel color", e)
        }
    }


    resetColor() {
        this.mesh.material[4] = new three.MeshBasicMaterial({ color: this.homeColor })
    }
}
