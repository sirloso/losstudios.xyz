const THREE = require('three')
const TWEEN = require('tween')
const Tile = require("./tile").Tile
const Panel = require('./Animations').Panel
const DAT = require('dat.gui')

const gui = new DAT.GUI()


let camera, lastobj, lastTap, clearMouse, zoomed, zooming, scene, renderer, backPanel
let composer
zoomed = false
let modalMode = false
let tiles = []
var vec = new THREE.Vector3(); // create once and reuse


let NUM_ROWS = 3
let TILES_PER_ROW = 2

let startX = 1.5
let startY = 3.0
let startZ = 5.5
let reading = false
// todo: fix this
let offsetX = 0//-.001
let offsetY = 0//.10

// scene setup 
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let rc = new THREE.Raycaster()
let m = new THREE.Vector2()
renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.autoClear = false
renderer.setClearColor(0x101000);


// window listeners
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false)
window.addEventListener('touchmove', onTouchMove, false);
window.addEventListener('touchend', onDoubleClick, false);

// geometry
let geometry = new THREE.BoxGeometry(2, 2, 0.125);
for (let i = 0; i < 6; i++) {
    // tiles.push(new c.Tile(geometry, `${i}\nstudio`))
    tiles.push(new Tile(geometry, `shaya`))
}


export const setup = () => {
    let sceneElement = document.getElementById('scene')
    let sceneBoundingBox = sceneElement.getBoundingClientRect()
    renderer.setSize(sceneBoundingBox.width, sceneBoundingBox.height)

    sceneElement.appendChild(renderer.domElement);
    scene = new THREE.Scene()
    scene.background = new THREE.Color('white')

    // todo: make the row based on the height
    // lay tiles out
    for (let i = 0; i < tiles.length; i++) {
        scene.add(tiles[i].tc.obj)
        let colOffset = i % TILES_PER_ROW * NUM_ROWS
        let rowOffest = Math.floor(i / TILES_PER_ROW) * NUM_ROWS
        tiles[i].tc.mesh.position.set(colOffset, rowOffest, 0)
    }

    backPanel = new Panel()

    backPanel.mesh.position.set(1.5, 3.4, -29)
    scene.add(backPanel.mesh)

    camera.position.set(startX, startY, startZ)

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

function onTouchMove(event) {
    event.preventDefault()
    m.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1 + offsetX
    m.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1 + offsetY
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
}

function onMouseDown(event) {
    event.preventDefault()
    if (zooming && !lastobj) return
    try {
        if (event.type === 'mousedown' && lastobj && !reading) {
            if (lastobj === backPanel.mesh) return
            if (lastobj.hover)
                lastobj.hover(1)
            zoomIn()
        }
    } catch (e) {
        console.log(e)
    }
}

function onFooterHover(state) {
    clearMouse = state
}

// dat.gui
let control = {
    zoomIn,
    zoomOut,
    resetCamera
}

// threejs functions
function resetCamera() {
    if (modalMode) return
    // reset all rotations
    for (let o of tiles)
        if (o.tc.obj.rotation.x !== 0 || o.tc.obj.rotation.y !== 0)
            o.tc.obj._rotate(0, 0)

    camera.position.set(startX, startY, startZ)
    camera.lookAt(new THREE.Vector3(startX, startY, startZ))
}

function zoomIn() {
    if (!lastobj) return

    let to = {
        x: 1.5,
        y: 3.3,
        z: -15.1
    }

    zooming = true
    lastobj = null

    let tween = new TWEEN.Tween(from())
        .to(to, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            camera.position.set(this.x, this.y, this.z);
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
    let to = {
        x: startX,
        y: startY,
        z: startZ
    }

    reading = false

    let tween = new TWEEN.Tween(from())
        .to(to, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            camera.position.set(this.x, this.y, this.z);
        })
        .onComplete(function () {
            zoomed = false
        })
        .start();

    camera.position.set(startX, startY, startZ)
    camera.fov = 75
    camera.updateProjectionMatrix();
    modalMode = false
}

// animation
function animate() {
    sleep(100)
    requestAnimationFrame(animate);
    TWEEN.update()

    rc.setFromCamera(m, camera);

    // calculate objects intersecting the picking ray
    var intersects = rc.intersectObjects(scene.children);

    // knowing this will only contain one object
    if (intersects[0] && !reading && !clearMouse) {
        intersects[0].object._rotate(
            intersects[0].point.x,
            intersects[0].point.y
        )
        document.getElementById('scene').style.cursor = 'pointer'


        // update back panel to color of tile
        let meshMaterials = intersects[0].object.material

        if (meshMaterials[4]) backPanel.hover(meshMaterials[4].color)

        //reset the tiles if we hover on the back board
        if (intersects[0].object === backPanel.mesh && lastobj) {
            // set rotation to zero
            lastobj._rotate(0, 0)
            // lastobj = null
            if (!zooming && !zoomed) backPanel.resetColor()
        }

        lastobj = intersects[0].object

    } else {
        if (lastobj) {
            document.getElementById('scene').style.cursor = 'default'
            vec.set(0, 0, 0)
            // set rotation to zero
            lastobj._rotate(0, 0)
            lastobj = null

            if (!zooming && !zoomed) backPanel.resetColor()
        }
    }


    renderer.render(scene, camera);
}


function sleep(num) {
    return new Promise(resolve => setTimeout(resolve, num))
}