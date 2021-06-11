import * as THREE from 'three'
import { Panel } from './panel'
// import * as DAT from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
const TWEEN = require('tween')

let camera = new THREE.PerspectiveCamera(
	45, window.innerWidth / window.innerHeight, 0.1, 4000
);

let rc = new THREE.Raycaster()
let m = new THREE.Vector2()

let titlePanel: Panel
let aboutPanel: Panel

let interaction

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

export const handleLogoMouseEnter = () => {
	if(aboutPanel.obj.position.z == 0) return
	let pos = {
		x: 0,
		y: 57,
		z: -30000
	}
	let end = {
		x:0,
		y: 57,
		z: 0
	}
	new TWEEN	
	.Tween(
		pos,4000
	)
	.to(
		end
	)
        // .easing(TWEEN.Easing.Linear.In)
        .onUpdate(function () {
            aboutPanel.obj.position.set(pos.x,pos.y,pos.z);
        })
        .onComplete(function () {
        })
        .start();
    camera.updateProjectionMatrix();
}

	console.log(TWEEN.Easing)
export const handleLogoMouseLeave = () => {
	let pos = {
		x: aboutPanel.obj.position.x,
		y: aboutPanel.obj.position.y,
		z: aboutPanel.obj.position.z
	}
	let end = {
		x:0,
		y: 57,
		z: -30000
	}
	new TWEEN	
	.Tween(
		pos,2000
	)
	.to(
		end
	)
        // .easing(TWEEN.Easing.Linear.Out)
        .onUpdate(function () {
            aboutPanel.obj.position.set(pos.x,pos.y,pos.z);
        })
        .onComplete(function () {
        })
        .start();
    camera.updateProjectionMatrix();
}

export const setup = async (home: HTMLElement, css: HTMLElement, webgl: HTMLElement) => {
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

	// los studios panel
	titlePanel = createPanel(homeTitle, sceneBoundingBox, "white")
	titlePanel.obj.position.set(380,-210,0)


	css.appendChild(titlePanel.renderer.domElement)
	// controls = new OrbitControls(camera, titlePanel.renderer.domElement)

	scene.add(titlePanel.obj)

	let homeAbout = document.getElementById("HomeAbout")
	homeAbout.style.width = "500px"
	homeAbout.style.height = "500px"

	aboutPanel = createPanel(homeAbout, sceneBoundingBox, "black", false)
	aboutPanel.obj.position.set(0,57,-30000)
	// aboutPanel.obj.position.set(0,57,0)

	scene.add(aboutPanel.obj)

	animate(renderer, titlePanel.renderer, camera, scene)
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

function animate(renderer: THREE.Renderer, cssrenderer: CSS3DRenderer, camera: THREE.Camera, scene: THREE.Scene) {
	//@ts-ignore
	if (window.stopHome) return
	// controls.update()
	TWEEN.update()

	scene.updateMatrixWorld()

	cssrenderer.render(scene, camera)
	renderer.render(scene, camera);

	rc.setFromCamera(m, camera);

	requestAnimationFrame(() => { animate(renderer, cssrenderer, camera, scene) });
}