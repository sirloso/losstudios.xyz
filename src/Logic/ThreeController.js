const THREE = require('three')
class Rotater{
    constructor(width,height,center){
        this._width = width
        this._height = height 

        this.w = width / 2
        this.h = height/ 2

        // determined based off experimentation
        this.rmax = 0.5
        this.center = center
    }

    calculateRotation(x,y){
        x = this.center.x - x 
        y = this.center.y - y
        // creates tilt effect
        let xr = x/this.w * this.rmax
        let yr = y/this.h * this.rmax
        return [xr,yr]
    }
}

export class ThreeController {
    constructor(geometry,  canvasTitle = 'defaultCanvas0',tag) {
        this.geometry = geometry
        this.tag = tag
        this.redraw = this.redraw.bind(this)
        this.hover = this.hover.bind(this)
        this._rotate = this._rotate.bind(this)
        this.registerCanvas = this.registerCanvas.bind(this)
        this.title = canvasTitle
        let textures = []

        // todo: make this variable on the projects uploaded
        for(let i = 0;i<6;i++){
            //note textures[4] is front facing
            let color = Math.floor(Math.random()*16777215).toString(16)
            textures.push(
                new THREE.MeshBasicMaterial({
                    color:new THREE.Color(`#${color}`)
                })
            )
        }

        // textures[4] = new THREE.MeshBasicMaterial({
        //             color:new THREE.Color('red')
        //         })

        this.mesh = new THREE.Mesh(this.geometry, textures)
        this.obj = this.mesh
        this.mesh.hover = this.hover
        this.mesh._rotate = this._rotate

        this.rotator = new Rotater(
            this.geometry.parameters.width,
            this.geometry.parameters.width,
            this.mesh.position
        )
    }

    _rotate(x,y){
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
        // this.c = document.getElementById(this.tag)
        // this.mesh.material[4] = new THREE.MeshBasicMaterial({
        //     map: new THREE.CanvasTexture(this.c)
        // })
    }

    async redraw() {
        // let tmp = this.mesh.material[4]
        // this.mesh.material[4] = new THREE.MeshBasicMaterial({
        //     map: new THREE.CanvasTexture(this.c)
        // })
        // await this.sleep(100)
        // try{
        //     tmp.dispose()
        // }catch(e){
        //     console.log(e);
        // }
    }

    async hover(m) {
        //  this.parentRedraw(m)
    }

    sleep(num) {
        return new Promise(resolve => setTimeout(resolve, num))
    }
}