import * as THREE from 'three'
import { WorkPanel,Panel } from './panel'
import * as DAT from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { SQUARE_SIZE } from './values';
import {
	createPanel,
	createTiles,
	createWorkPanel
} from './homeThreeCreators'
import { isMobile } from './values'
import {
    onWindowResize,
    onMouseMove,
    onMouseDown,
    onTouchMove,
    onTouchStart,
    onTouchEnd,
    zoomOut
} from './homeInteractionHandlers'

let scrolling,zooming,lastobj
const TWEEN = require('@tweenjs/tween.js')

let camera = new THREE.PerspectiveCamera(
	45, window.innerWidth / window.innerHeight, 0.1, 4000
);

let rc = new THREE.Raycaster()
let m = new THREE.Vector2()


let zoomed = false
let titlePanel: Panel
let aboutPanel: Panel
let workPanel: WorkPanel
let tileGroup: THREE.Group

let interaction

let cssrenderer: CSS3DRenderer
let renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.autoClear = false
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap



let hover = false
// let gui = new DAT.GUI()
let scene = new THREE.Scene()

let controls: OrbitControls

export const setupMobile = async (home: HTMLElement, css: HTMLElement, webgl: HTMLElement) => {
	// main page
	let sceneBoundingBox = home.getBoundingClientRect()
	renderer.setSize(sceneBoundingBox.width, sceneBoundingBox.height)
	webgl.appendChild(renderer.domElement)

	scene.background = new THREE.Color('white')


	// camera
	camera.position.set(-8, 0, 1200);

	// get div to use
	let homeTitle = document.getElementById("HomeLogo")
	homeTitle.style.width = "250px"
	homeTitle.style.height = "100px"

	// los studios panel
	titlePanel = createPanel(homeTitle, sceneBoundingBox, "white")
	// titlePanel.obj.position.set(384,-210,0)
	let startX = 500
	titlePanel.obj.position.set(startX, 150, 1)
	let pos = {
		x: startX,
		y: 150,
		z: 1
	}
	let end = {
		x: 150,
		y: 150,
		z: 1
	}
	new TWEEN
		.Tween(
			pos
		)
		.to(
			end, 2500
		)
		// .easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(function () {
			titlePanel.obj.position.set(pos.x, pos.y, pos.z)
			titlePanel.obj.matrixWorldNeedsUpdate = true
		})
		.onComplete(function () {
		})
		.start();


	css.appendChild(titlePanel.renderer.domElement)
	// controls = new OrbitControls(camera, titlePanel.renderer.domElement)

	scene.add(titlePanel.obj)

	let homeAbout = document.getElementById("HomeAbout")
	homeAbout.style.width = "500px"
	homeAbout.style.height = "500px"

	aboutPanel = createPanel(homeAbout, sceneBoundingBox, "black", false)
	// aboutPanel.obj.position.set(0,57,-30000)
	aboutPanel.obj.position.set(0, 57, 0)
	// aboutPanel.obj.rotateX(THREE.MathUtils.degToRad(95))


	scene.add(aboutPanel.obj)

	cssrenderer = titlePanel.renderer
	animate(renderer, cssrenderer, camera, scene)

}
export const setup = async (home: HTMLElement, css: HTMLElement, webgl: HTMLElement, ga: (title:string)=>void) => {
	if (isMobile()) {
		setupMobile(home, css, webgl)
		return
	}

	// main page
	let sceneBoundingBox = home.getBoundingClientRect()
	renderer.setSize(sceneBoundingBox.width, sceneBoundingBox.height)
	webgl.appendChild(renderer.domElement)

	scene.background = new THREE.Color('white')


	// camera
	// camera.position.set(0, 0, 1000);


	// get div to use
	let homeTitle = document.getElementById("HomeLogo")
	homeTitle.style.width = "250px"
	homeTitle.style.height = "100px"

	// los studios panel
	titlePanel = createPanel(homeTitle, sceneBoundingBox, "white")
	titlePanel.obj.position.set(384, -210, 0)

	css.appendChild(titlePanel.renderer.domElement)
	// controls = new OrbitControls(camera, titlePanel.renderer.domElement)

	scene.add(titlePanel.obj)

	let homeAbout = document.getElementById("HomeAbout")
	homeAbout.style.width = "500px"
	homeAbout.style.height = "500px"

	aboutPanel = createPanel(homeAbout, sceneBoundingBox, "black", false)
	// aboutPanel.obj.position.set(0,57,-30000)
	aboutPanel.obj.position.set(0, 57, 0)
	// aboutPanel.obj.rotateX(THREE.MathUtils.degToRad(95))


	scene.add(aboutPanel.obj)

	// work
	workPanel = createWorkPanel()
	scene.add(workPanel.obj)
	workPanel.obj.position.set(1000, 0, 1)
	camera.position.set(1000, 0, 1000)

	// tiles
	let geometry = new THREE.BoxGeometry(SQUARE_SIZE,SQUARE_SIZE, 0.125);
	let titles = ['one', 'two', 'trhe', 'four', 'fix', '8', 'a', 'b', 'c', 'd', 'e', '1', '2', '3', '4', '123123']
	let gallery = [
		"https://nsc.nyc3.digitaloceanspaces.com/028b1fcfd219e13b4ccb9730fce149e2.jpg",
		"https://nsc.nyc3.digitaloceanspaces.com/0916a7105953013e63163bdd14e400e5.jpg",
		"https://nsc.nyc3.digitaloceanspaces.com/1b216267fbb791c07454464904b926dc.jpg"
	]
	let tiles = createTiles(titles, geometry, gallery, ga)
	tileGroup = tiles.tileGroup
	//@ts-ignore
	window.tiles = tiles

	// if(mobile) scene.add(tileGroup)
	scene.add(tileGroup)

	tileGroup.position.set(980,-17,850)
	// gui.add(tileGroup.position, "x")
	// gui.add(tileGroup.position, "y")
	// gui.add(tileGroup.position, "z")

	cssrenderer = titlePanel.renderer
	// controls = new OrbitControls(camera,cssrenderer.domElement)
	// controls.target = new THREE.Vector3(980,-17,850)
	animate(renderer, cssrenderer, camera, scene)
}

function animate(renderer: THREE.Renderer, cssrenderer: CSS3DRenderer, camera: THREE.Camera, scene: THREE.Scene) {
	//@ts-ignore
	if (window.stopHome) {
		while (scene.children.length > 0) {
			scene.remove(scene.children[0]);
		}
		return
	}
	// controls.update()
	TWEEN.update()

	scene.updateMatrixWorld()

	cssrenderer.render(scene, camera)
	renderer.render(scene, camera);

	rc.setFromCamera(m, camera);

	requestAnimationFrame(() => { animate(renderer, cssrenderer, camera, scene) });
}

window.addEventListener('resize', ()=>{
	onWindowResize(camera,renderer,cssrenderer,scene)
}, false);
window.addEventListener('mousemove', (event)=>{
	onMouseMove(event,m,camera,scrolling,isMobile(),scene,workPanel,lastobj,zooming,zoomed,rc,tileGroup)
}, false);
window.addEventListener('mousedown', (event)=>{
	onMouseDown(event,zooming,lastobj,isMobile(),workPanel,scrolling,zoomed,camera)
}, false)
window.addEventListener('touchmove', (event)=>{
	onTouchMove(event,scrolling,m,tileGroup)
}, false);
window.addEventListener('touchstart', onTouchStart, false);
window.addEventListener('touchend', (event)=>{
	onTouchEnd(event,scrolling,zooming,lastobj,workPanel,camera,tileGroup,rc)
}, false)

export const zo = () => {
	return zoomOut(camera,scrolling,zoomed)
}