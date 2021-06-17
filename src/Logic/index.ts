// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const Tile = require("./tile").Tile
const Panel = require('./Animations').Panel
// const DAT = require('dat.gui')
// const gui = new DAT.GUI()
const mobile = window.innerWidth < 800

import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer"
import { SlideShow } from "../Components/Gallery"

let camera, lastobj, lastTap, clearMouse, zoomed, zooming, scene, renderer, backPanel, tileGroup, scrolling, cssRenderer
let controls
zoomed = false
let modalMode = false
let tiles = []
var vec = new THREE.Vector3(); // create once and reuse

scrolling = false

let NUM_ROWS = 3
let TILES_PER_ROW = 2

// let startX = 1.5
// let startY = 3.0
// let startZ = 5.5
// let startX = -1
// let startY = 0
// let startZ = 6

const desktopCamera = {
    x: 1.5,
    y: 3.0,
    z: 5.5
}
const mobileCamera = {
    x: -1,
    y: 0,
    z: 6
}

const cameraPosition = mobile ? mobileCamera : desktopCamera

// todo: fix this
let offsetX = 0//-.001
let offsetY = 0//.10

// scene setup 
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// gui.add(camera.position,"x")
// gui.add(camera.position,"y")
// gui.add(camera.position,"z")
let rc = new THREE.Raycaster()
let m = new THREE.Vector2()
renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.autoClear = false
renderer.setClearColor(0x101000);
renderer.setSize(window.innerWidth, window.innerHeight)

cssRenderer = new CSS3DRenderer()
// let controls = new MapControls(camera,renderer.domElement)
// controls.autoRotate = false
// controls.enableRotate = false
// controls.touches.ONE = THREE.TOUCH.PAN;
// controls.enableZoom = false

// window listeners
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false)
window.addEventListener('touchmove', onTouchMove, false);
window.addEventListener('touchstart', onTouchStart, false);
window.addEventListener('touchend', onTouchEnd, false)

// window.addEventListener('touchend', onDoubleClick, false);

// geometry
let geometry = new THREE.BoxGeometry(2, 2, 0.125);
let titles = ['one', 'two', 'trhe', 'four', 'fix', '8', 'a', 'b', 'c', 'd', 'e', '1', '2', '3', '4', '123123']


tileGroup = new THREE.Group()

export const setup = async (galleryArray: Array<any>) => {
    let sceneElement = document.getElementById('webglScene')
    let sceneBoundingBox = sceneElement.getBoundingClientRect()
    renderer.setSize(sceneBoundingBox.width, sceneBoundingBox.height)
    renderer.setPixelRatio(window.devicePixelRatio);

    sceneElement.appendChild(renderer.domElement);
    scene = new THREE.Scene()

    let cssSceneElement = document.getElementById('cssScene')
    let cssbb = cssSceneElement.getBoundingClientRect()
    cssRenderer.setSize(cssbb.width, cssbb.height)
    cssSceneElement.appendChild(cssRenderer.domElement);
    // controls = new OrbitControls(camera,cssRenderer.domElement)

    scene.background = new THREE.Color('white')
    let g = [
        [
            "https://nsc.nyc3.digitaloceanspaces.com/028b1fcfd219e13b4ccb9730fce149e2.jpg",
            "https://nsc.nyc3.digitaloceanspaces.com/0916a7105953013e63163bdd14e400e5.jpg",
            "https://nsc.nyc3.digitaloceanspaces.com/1b216267fbb791c07454464904b926dc.jpg"
        ],
        [
            "https://nsc.nyc3.digitaloceanspaces.com/2f042879c3f563f8f80b5099f72aef1b.jpg",
            "https://nsc.nyc3.digitaloceanspaces.com/538de8ac4a27900d915e5feeb53a352b.jpg",
            "https://nsc.nyc3.digitaloceanspaces.com/72e9f3caacfb3b30855130756c616fd5.jpg",
        ]
    ]
    for (let i = 0; i < titles.length; i++) {
        tiles.push(
            new Tile(
                geometry,
                titles[i],
                g[i % 2],
                galleryArray
            )
        )
        // await tiles[i].setup()
    }

    // todo: make the row based on the height
    // lay tiles out
    for (let i = 0; i < tiles.length; i++) {
        tileGroup.add(tiles[i].tc.obj)
        if (window.innerWidth < 800) {
            let rowOffest = i * -3  //- 9
            tiles[i].tc.mesh.position.set(0.5, rowOffest, -1)
        } else {
            let colOffset = i % TILES_PER_ROW * NUM_ROWS
            let rowOffest = Math.floor(i / TILES_PER_ROW) * NUM_ROWS

            tiles[i].tc.mesh.position.set(colOffset, rowOffest, 0)
            scene.add(tiles[i].tc.obj)
        }
    }

    if (mobile) scene.add(tileGroup)

    // scene.add(boxHelper)
    backPanel = new Panel()

    backPanel.obj.position.set(1.5, 3.4, -29)
    for(const c of backPanel.obj.children){
    }
    scene.add(backPanel.obj)

    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
    // controls.target.set( 0, 0, 0 ); // view direction perpendicular to XY-plane
    // controls.enableZoom = true; // optional
    // controls.update()
    // addLight(0,5,10); addLight( 0, -5, 10);
    animate()
}


function onDoubleClick() {
    event.preventDefault()
    var now = new Date().getTime();
    var timesince = now - lastTap;
    if ((timesince < 600) && (timesince > 0)) {
        let tmp = lastobj
        lastobj.hover(1)
        setTimeout(
            () => { tmp.hover(2); }, 2000
        )
        zoomIn()
    }
    lastTap = new Date().getTime();
}

let sy = 0

function onTouchEnd(event) {
    console.log("scrolling", scrolling)
    event.preventDefault()
    if (zooming && !lastobj) return
    try {
        if (lastobj && !scrolling) {
            if (lastobj === backPanel.mesh) return
            // this was used to draw the small squares
            // if (lastobj.hover) lastobj.hover(1)
            // zoomIn()
        }
    } catch (e) {
        console.log(e)
        scrolling = false
    }
    console.log("scrolling", scrolling)
    let mouse = { x: 0, y: 0 }

    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    rc.setFromCamera(mouse, camera)
    let intersects = rc.intersectObjects(tileGroup.children);

    let obj = intersects[0]
    if (obj && !scrolling && !clearMouse && obj.object != backPanel) {
        obj.object.colorize()
        lastobj = obj
    } else {
        if (lastobj) {
            vec.set(0, 0, 0)
            lastobj.object.resetColor()
            lastobj = null
        }
    }
    scrolling = false
}

function onTouchMove(event) {
    // event.preventDefault()
    scrolling = true
    m.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1 + offsetX
    m.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1 + offsetY
    let position = new THREE.Vector3()
    // position.setPositionFromMatrix( tileGroup.matrixWorld );

    let speed = 0.001

    let move = event.touches[0].pageY
    var deltaY = (move - sy);
    var box = new THREE.Box3().setFromObject(tileGroup);
    let height = box.max.y - box.min.y

    if (tileGroup.position.y + (deltaY * speed) < 0) return
    if (tileGroup.position.y + (deltaY * speed) > height - 2) {
        return
    }

    tileGroup.position.y += (deltaY * speed);
}

function onTouchStart(event) {
    sy = event.touches[0].pageY;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    event.preventDefault()
    m.x = (event.clientX / window.innerWidth) * 2 - 1 + offsetX
    m.y = - (event.clientY / window.innerHeight) * 2 + 1 + offsetY
    rc.setFromCamera(m, camera);

    // calculate objects intersecting the picking ray
    var intersects = scene === undefined ? [] : rc.intersectObjects(scene.children);

    // knowing this will only contain one object
    if (intersects[0] && !scrolling && !clearMouse && !mobile) {
        intersects[0].object._rotate(
            intersects[0].point.x,
            intersects[0].point.y
        )
        document.body.style.cursor = 'pointer'

        // update back panel to color of tile
        let img = intersects[0].object.hero
        backPanel.hover(img)
        if (intersects[0].object.registerCanvas) intersects[0].object.registerCanvas()

        //reset the tiles if we hover on the back board
        if (intersects[0].object === backPanel.mesh && lastobj) {
            // set rotation to zero
            lastobj._rotate(0, 0)
            // lastobj = null
            if (!zooming && !zoomed) backPanel.resetColor()
        }

        lastobj = intersects[0].object

    } else {
        if (lastobj && !mobile) {
            // if(lastobj.colorize)lastobj.colorize()
            document.body.style.cursor = 'default'
            vec.set(0, 0, 0)
            // set rotation to zero
            lastobj._rotate(0, 0)
            if (!zooming && !zoomed) backPanel.resetColor()
            lastobj = null
        }
    }
}

function onMouseDown(event) {
    event.preventDefault()
    if (zooming && !lastobj && mobile) return
    try {
        if (event.type === 'mousedown' && lastobj && !scrolling) {
            if (lastobj === backPanel.mesh) return
            // this was used to draw the small squares
            if (lastobj.hover) lastobj.hover(1)
            zoomIn()
        }
    } catch (e) {
        console.log(e)
    }
}

function onFooterHover(state) {
    clearMouse = state
}


// threejs functions
function zoomIn() {
    if (!lastobj) return

    let to = {
        x: 1.5,
        y: 3.3,
        z: -15.1
    }

    zooming = true
    zoomed = false
    lastobj = null
    let start = from()
    let tween = new TWEEN.Tween(start)
        .to(to, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            camera.position.set(start.x, start.y, start.z);
        })
        .onComplete(function () {
            setTimeout(() => {
                zooming = false
                zoomed = true
            }, 500)
        })
        .start();

    camera.updateProjectionMatrix();
}

let from = () => {
    return {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    }
}

export function zoomOut() {
    scrolling = true
    let start = from()
    let tween = new TWEEN.Tween(start)
        .to({ ...cameraPosition }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            camera.position.set(start.x, start.y, start.z);
        })
        .onComplete(function () {
            zoomed = false
            scrolling = false
        })
        .start();

    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
    camera.fov = 75
    camera.updateProjectionMatrix();
    modalMode = false

}

tiles.forEach((tile) => {
    tile.discard()
});

// animation
function animate() {
    //@ts-ignore
    if (window.stopWork) return
    sleep(100)
    requestAnimationFrame(animate);
    TWEEN.update()

    // controls.update()
    renderer.render(scene, camera);
    cssRenderer.render(scene, camera)
}

function sleep(num) {
    return new Promise(resolve => setTimeout(resolve, num))
}

function addLight(...pos) {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    scene.add(light);
}