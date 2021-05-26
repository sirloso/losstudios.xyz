import Tween from 'tween'
import { ThreeController } from './ThreeController'
import * as three from 'three'
import { Tile } from './tile'

export class Panel{
    geometry: three.BoxGeometry 
    mesh: three.Mesh
    photos: Array<string>
    visiible: boolean
    homeColor: three.Color 

    constructor(){
        this.updateVisibility = this.updateVisibility.bind(this)
        this.hover = this.hover.bind(this)

        // set up geometry and mesh
        if(window.innerWidth< 800) this.geometry = new three.BoxGeometry(25,45,0.1)
        else this.geometry = new three.BoxGeometry(25,20,0.1)
        let textures:Array<three.MeshBasicMaterial> = []
        let color = Math.floor(Math.random()*16777215).toString(16)
        this.homeColor = new three.Color(`#${color}`)

        for(let i = 0;i<6;i++){
            textures.push( 
                new three.MeshBasicMaterial({
                    color: this.homeColor,
                    wireframe: false
                })
            )
        }

        //@ts-ignore
        this.mesh = new three.Mesh(this.geometry,textures)
        // this.mesh.hover = this.hover
        //@ts-ignore
        this.mesh._rotate = ()=>{}
        //@ts-ignore
        this.mesh.hover = this.hover
    }

    updateVisibility(visiible: boolean = this.visiible){
        try{
            // update mesh 
            this.visiible = visiible
        }catch(e){
            console.log("unable to update visibility",e)
        }
    }

    hover(newColor: three.Texture){
        try{
            console.log("hover panel")
            if(!newColor) return
            // let newMesh = new three.MeshBasicMaterial()
            // newMesh.copy(newColor)
            // let oldm:three.MeshBasicMaterial = this.mesh.material[4]
            // this.mesh.material[4] = newColor
            // if(oldm) oldm.dispose()
            let oldm:three.MeshBasicMaterial = this.mesh.material[4]
            this.mesh.material[4] = new three.MeshBasicMaterial({map:newColor})
            if(oldm) oldm.dispose()
        }catch(e){
            console.log("unable to update panel color",e) 
        }
    }


    resetColor(){
        this.mesh.material[4] = new three.MeshBasicMaterial({color: this.homeColor})
    }
}
