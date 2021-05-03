// require('regenerator-runtime/runtime')
const THREE = require('three')
const TWEEN = require('tween')
const Tile = require("./tile").Tile
const Panel = require('./Animations').Panel
const DAT = require('dat.gui')

const gui = new DAT.GUI()

let camera, lastobj, lastTap, hiddenObj, clearMouse
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

// window listeners
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false)
window.addEventListener('touchmove', onTouchMove, false);
window.addEventListener('touchend', onDoubleClick, false);
window.zoomOut = zoomOut
window.resetCamera = resetCamera
window.onFooterHover = onFooterHover

// geometry
let geometry = new THREE.BoxGeometry(2, 2, 0.125);
for (let i = 0; i < 6; i++) {
    // tiles.push(new c.Tile(geometry, `${i}\nstudio`))
    tiles.push(new Tile(geometry, `shaya`))
}

let sceneElement = document.getElementById('scene')
console.log(sceneElement);
let sceneBoundingBox = sceneElement.getBoundingClientRect()
renderer.setSize(sceneBoundingBox.width, sceneBoundingBox.height)

sceneElement.appendChild(renderer.domElement);
let scene = new THREE.Scene()
scene.background = new THREE.Color('white')

// todo: make the row based on the height
// lay tiles out
for (let i = 0; i < tiles.length; i++) {
    scene.add(tiles[i].tc.obj)
    let colOffset = i % TILES_PER_ROW * NUM_ROWS
    let rowOffest = Math.floor(i / TILES_PER_ROW) * NUM_ROWS
    tiles[i].tc.mesh.position.set(colOffset, rowOffest, 0)
}

let backPanel = new Panel()

scene.add(backPanel.mesh)
backPanel.mesh.position.set(1.5,3.4,-29)

// gui.add(backPanel.mesh.position,"x")
// gui.add(backPanel.mesh.position,"y")
// gui.add(backPanel.mesh.position,"z")

camera.position.set(startX, startY, startZ)
light = new THREE.AmbientLight(0x00FFFF, 1);

// window functions
// let width = document.body.clientWidth 
// if(width < 800){
//     let _modal = document.getElementById('modal')
//     let text = _modal.children[1]
//     let e = document.createElement('div')
//     let b = document.createElement('div')
// }

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
    if (event.type === 'mousedown' && lastobj && !reading) {
        let tmp = lastobj
        console.log(lastobj)
        lastobj.hover(1)
        setTimeout(
            () => { tmp.hover(2) }, 2000
        )
        // zoomIn()
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

// gui.add(control, 'zoomIn')
// gui.add(control, 'zoomOut')
// gui.add(control, 'resetCamera')
// gui.add(camera.position,'x')
// gui.add(camera.position,'y')
// gui.add(camera.position,'z')

// threejs functions
function resetCamera() {
    if (modalMode) return
    // reset all rotations
    for (let o of tiles)
        if (o.tc.obj.rotation.x !== 0 || o.tc.obj.rotation.y !== 0)
            o.tc.obj._rotate(0, 0)

    camera.position.set(startX, startY, startZ)
    camera.lookAt(new THREE.Vector3(startX, startY, startZ))
    document.getElementById('reset').style.setProperty('color', 'black')
    if (hiddenObj) hiddenObj.visible = true
}

function zoomIn() {
    if (!lastobj) return

    var direction = new THREE.Vector3();
    hiddenObj = lastobj
    lastobj.getWorldDirection(direction);
    camera.position.copy(lastobj.position).add(direction.multiplyScalar(1));
    camera.lookAt(lastobj.position);
    modalMode = true
    setTimeout(() => {
        hiddenObj.visible = false
        reading = true
        lastobj = null
        // document.getElementById('modalWrapper').style.setProperty('visibility', 'visible')
        // document.getElementById('back').style.setProperty('color', 'red')
        // document.getElementById('reset').style.setProperty('color', 'black')
    }, 1500)
}

let from = () => {
    return {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    }
}

function zoomOut() {
    let to = {
        x: startX / 2,
        y: startY / 2,
        z: startZ / 2
    }
    hiddenObj.visible = true
    document.getElementById('modalWrapper').style.setProperty('visibility', 'hidden')
    document.getElementById('reset').style.setProperty('color', 'red')
    document.getElementById('back').style.setProperty('color', 'black')
    reading = false

    let tween = new TWEEN.Tween(from())
        .to(to, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            camera.position.set(this.x, this.y, this.z);
            // camera.lookAt(new THREE.Vector3(0,0,0));
        })
        .onComplete(function () {
            // camera.position.set(startX,startY,startZ)
            // camera.lookAt(new THREE.Vector3(0,0,0));
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

        if(meshMaterials[4]) backPanel.hover(meshMaterials[4].color)

        //reset the tiles if we hover on the back board
        if(intersects[0].object === backPanel.mesh && lastobj){
            // set rotation to zero
            lastobj._rotate(0, 0)
            // lastobj = null
            backPanel.resetColor()
        }

        lastobj = intersects[0].object

    } else {
        if (lastobj) {
            document.getElementById('scene').style.cursor = 'default'
            vec.set(0, 0, 0)
            // set rotation to zero
            lastobj._rotate(0, 0)
            lastobj = null

            backPanel.resetColor()
        }
    }

    renderer.render(scene, camera);
}

animate()

function sleep(num) {
    return new Promise(resolve => setTimeout(resolve, num))
}