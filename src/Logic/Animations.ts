import Tween from 'tween'
import { ThreeController } from './ThreeController'
import * as three from 'three'
import { Tile } from './tile'

export class Panel{
    geometry: three.BoxGeometry 
    mesh: three.Mesh
    photos: Array<string>
    visiible: boolean

    constructor(){
        this.updateVisibility = this.updateVisibility.bind(this)
        this.hover = this.hover.bind(this)

        // set up geometry and mesh
        this.geometry = new three.BoxGeometry(20,20,0.1)
        let textures:Array<three.MeshBasicMaterial> = []
        for(let i = 0;i<6;i++){
            let color = Math.floor(Math.random()*16777215).toString(16)
            textures.push( 
                new three.MeshBasicMaterial({
                    color:new three.Color(`#${color}`)
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

    hover(){
        try{
            console.log("panel hover")
        }catch(e){
            console.log("unable to update and show gallery",e) 
        }
    }

}