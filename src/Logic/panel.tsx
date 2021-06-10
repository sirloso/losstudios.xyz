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

    constructor(geometry: Three.BufferGeometry, div: HTMLElement,sceneBoundingBox:DOMRect, color: string|Three.Color = "white") {
	this.geometry = geometry
	this.obj = new Three.Object3D()

        this.discard = this.discard.bind(this)
	this._rotate = this._rotate.bind(this)

	this.divMaterial = new Three.MeshBasicMaterial({
		color: color,
		// side: Three.DoubleSide,
		opacity: 0.15,
		blending: Three.NoBlending,
	} )

	this.setupCSSRenderer(sceneBoundingBox)
	div.style.opacity = "0.999"
	this.divObj =  new CSS3DObject(div) 

	//@ts-ignore
	this.obj.css3dObject = this.divObj

	this.obj.add(this.divObj)


	this.mesh = new Three.Mesh(this.geometry,this.divMaterial) 
	//@ts-ignore
	this.obj.lightShadowMesh = this.mesh
	this.mesh.castShadow = true
	this.mesh.receiveShadow = true

	this.divObj.position.set(0,0,50)
	this.mesh.position.set(0,0,50)

	this.obj.add(this.mesh)
    }

    setupCSSRenderer(sbb: DOMRect){
	    this.renderer = new CSS3DRenderer()
	    let r = this.renderer

	    r.setSize(sbb.width, sbb.height)
	    r.domElement.style.position = 'absolute';
	    r.domElement.style.top = "0";
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

    setColor(color:string){
        this.color = color
    }

    discard() {
    }

}
