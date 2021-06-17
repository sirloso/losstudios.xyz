import * as THREE from 'three'
import { Panel, WorkPanel } from './panel'
import * as DAT from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { Tile } from './tile'
import { isMobile } from './values'
const TWEEN = require('@tweenjs/tween.js')

let camera = new THREE.PerspectiveCamera(
	45, window.innerWidth / window.innerHeight, 0.1, 4000
);

let rc = new THREE.Raycaster()
let m = new THREE.Vector2()

const NUM_ROWS = 40
const TILES_PER_ROW = 2
const SQUARE_SIZE = 25

let titlePanel: Panel
let aboutPanel: Panel

const mobile = window.innerWidth < 800

let interaction

let cssrenderer: CSS3DRenderer
let renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.autoClear = false
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap



let hover = false
let gui = new DAT.GUI()
let scene = new THREE.Scene()

// let controls = new OrbitControls(camera,renderer.domElement)
let controls: OrbitControls

export const handleLogoMouseEnter = () => {
	// if(aboutPanel.obj.rotation.x == 0) return
	// // @ts-ignore
	// window.setupHome = false
	// let pos = {
	// 	// x: 0,
	// 	// y: 57,
	// 	// z: -30000
	// 	v:THREE.MathUtils.radToDeg(aboutPanel.obj.rotation.x)
	// }
	// let end = {
	// 	// x:0,
	// 	// y: 57,
	// 	// z: 0
	// 	v:0
	// }
	// new TWEEN	
	// .Tween(
	// 	pos,10000
	// )
	// .to(
	// 	end
	// )
	// .easing(TWEEN.Easing.Cubic.Out)
	// .onUpdate(function () {
	//     aboutPanel.obj.rotation.set(THREE.MathUtils.degToRad(pos.v),0,0);
	//     aboutPanel.obj.matrixWorldNeedsUpdate = true
	// })
	// .onComplete(function () {
	// })
	// .start();
	camera.updateProjectionMatrix();
}

export const handleLogoMouseLeave = () => {
	// let pos = {
	// 	// x: aboutPanel.obj.position.x,
	// 	// y: aboutPanel.obj.position.y,
	// 	// z: aboutPanel.obj.position.z
	// 	v: 0
	// }
	// let end = {
	// 	// x:0,
	// 	// y: 57,
	// 	// z: -30000
	// 	v: 95 
	// }
	// new TWEEN	
	// .Tween(
	// 	pos,2000
	// )
	// .to(
	// 	end
	// )
	// .easing(TWEEN.Easing.Cubic.Out)
	// .onUpdate(function () {
	//     aboutPanel.obj.rotation.set(THREE.MathUtils.degToRad(pos.v),0,0);
	//     aboutPanel.obj.matrixWorldNeedsUpdate = true
	// })
	// .onComplete(function () {
	// })
	// .start();
	//     camera.updateProjectionMatrix();
}

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
export const setup = async (home: HTMLElement, css: HTMLElement, webgl: HTMLElement, ga: Array<any>) => {
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
	camera.position.set(0, 0, 1000);

	gui.add(camera.position, "x", -2000, 2000)
	gui.add(camera.position, "y", -2000, 2000)
	gui.add(camera.position, "z", -2000, 2000)

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
	let backPanel = createWorkPanel()
	scene.add(backPanel.obj)
	backPanel.obj.position.set(1000, 0, 1)
	camera.position.set(1000, 0, 1000)

	// tiles
	let geometry = new THREE.BoxGeometry(SQUARE_SIZE,SQUARE_SIZE, 0.125);
	let titles = ['one', 'two', 'trhe', 'four', 'fix', '8', 'a', 'b', 'c', 'd', 'e', '1', '2', '3', '4', '123123']
	let gallery = [
		"https://nsc.nyc3.digitaloceanspaces.com/028b1fcfd219e13b4ccb9730fce149e2.jpg",
		"https://nsc.nyc3.digitaloceanspaces.com/0916a7105953013e63163bdd14e400e5.jpg",
		"https://nsc.nyc3.digitaloceanspaces.com/1b216267fbb791c07454464904b926dc.jpg"
	]
	let { tiles, tileGroup } = createTiles(titles, geometry, gallery, ga)

	// if(mobile) scene.add(tileGroup)
	scene.add(tileGroup)

	tileGroup.position.set(980,-10,850)

	cssrenderer = titlePanel.renderer
	animate(renderer, cssrenderer, camera, scene)
}

const createWorkPanel = () => {
	let backPanel = new WorkPanel()

	for (const c of backPanel.obj.children) {
	}

	return backPanel
}

const createPanel = (div: HTMLElement, sceneBoundingBox: DOMRect, color: string = "red", createRenderer: boolean = true) => {
	let geometry = new THREE.BoxGeometry(
		parseInt(div.style.width.split("px")[0]),
		parseInt(div.style.height.split("px")[0]),
		10
	)
	let box = new Panel(geometry, div, sceneBoundingBox, color, createRenderer)

	return box
}

const createTiles = (
	titles: Array<string>,
	geometry: THREE.BoxGeometry,
	g: Array<string>,
	galleryArray: Array<any>
) => {
	const tiles = []
	const tileGroup = new THREE.Group()

	for (let i = 0; i < titles.length; i++) {
		const tile = new Tile(
			geometry,
			titles[i],
			g,
			galleryArray
		)
		tiles.push(tile)
		tileGroup.add(tile.tc.obj)
		if (mobile) {
			let rowOffest = i * -3  //- 9
			tiles[i].tc.mesh.position.set(0.5, rowOffest, -1)
		} else {
			let colOffset = i % TILES_PER_ROW * NUM_ROWS 
			let rowOffest = Math.floor(i / TILES_PER_ROW) * NUM_ROWS

			tiles[i].tc.mesh.position.set(colOffset, rowOffest, 0)
		}
	}

	return { tiles, tileGroup }
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

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;

	renderer.setSize(window.innerWidth, window.innerHeight);
	cssrenderer.setSize(window.innerWidth, window.innerHeight)
	camera.updateProjectionMatrix();
	cssrenderer.render(scene, camera)
	renderer.render(scene, camera);
}
