import * as THREE from 'three'
import { Panel } from './panel'
// import * as DAT from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';

let camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 0.1, 4000
    );

let rc = new THREE.Raycaster()
let m = new THREE.Vector2()


let renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.autoClear = false
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap



let hover = false
// let gui = new DAT.GUI()
let scene = new THREE.Scene()

// let controls = new OrbitControls(camera,renderer.domElement)
let controls: OrbitControls

export const setup = async (home: HTMLElement,css:HTMLElement,webgl:HTMLElement) => {
	// main page
	let sceneBoundingBox = home.getBoundingClientRect()
	renderer.setSize(sceneBoundingBox.width, sceneBoundingBox.height)
	webgl.appendChild(renderer.domElement)

	scene.background = new THREE.Color('white')


	// camera
	camera.position.set(0, 0, 1000);

	// get div to use
	let homeTitle = document.getElementById("HomeLogo")
	homeTitle.style.width = "250px"
	homeTitle.style.height = "100px"

	let panel = createPanel(homeTitle,sceneBoundingBox)

	// panel.obj.position.set(0,0,-50)

	css.appendChild(panel.renderer.domElement)
	controls = new OrbitControls(camera,panel.renderer.domElement)

	scene.add(panel.obj)

	// gui.add(panel.obj.rotation,"x")
	// gui.add(panel.obj.rotation,"y")
	// gui.add(panel.obj.rotation,"z")


	animate(renderer,panel.renderer,camera,scene)
}

const createPanel = (div: HTMLElement,sceneBoundingBox: DOMRect) => {
	let geometry = new THREE.BoxGeometry(
		parseInt(div.style.width.split("px")[0]),
		parseInt(div.style.height.split("px")[0]),
		10
		)
	let box = new Panel(geometry, div,sceneBoundingBox,'red')

	return box
}

function animate(renderer: THREE.Renderer ,cssrenderer: CSS3DRenderer,camera: THREE.Camera,scene: THREE.Scene) {
	//@ts-ignore
	if (window.stopHome) return
	controls.update()

	scene.updateMatrixWorld()

	cssrenderer.render(scene,camera)
	renderer.render(scene, camera);
	//     TWEEN.update()

	rc.setFromCamera(m, camera);

	// calculate objects intersecting the picking ray
	var intersects = rc.intersectObjects(scene.children);

	// knowing this will only contain one object
	if (intersects[0] && hover) {
		// @ts-ignore
		intersects[0].object._rotate(
			intersects[0].point.x,
			intersects[0].point.y
		)
		document.getElementById('scene').style.cursor = 'pointer'

		//reset the tiles if we hover on the back board
		// if (intersects[0].object === backPanel.mesh && lastobj) {
		//     // set rotation to zero
		//     lastobj._rotate(0, 0)
		//     // lastobj = null
		//     if (!zooming && !zoomed) backPanel.resetColor()
		// }

		// lastobj = intersects[0].object

	} else {
		// if (lastobj) {
		//     document.getElementById('scene').style.cursor = 'default'
		//     vec.set(0, 0, 0)
		//     // set rotation to zero
		//     lastobj._rotate(0,0)
		//     if (!zooming && !zoomed) backPanel.resetColor()
		//     lastobj = null
		// }
	}
	//     if(mobile){
	//             if(intersects[0] && !scrolling && !clearMouse){
	//                 let img = intersects[0].object.hero
	//                 backPanel.hover(img)
	//             }
	//     }

	requestAnimationFrame(()=>{ animate(renderer,cssrenderer,camera,scene) });
}