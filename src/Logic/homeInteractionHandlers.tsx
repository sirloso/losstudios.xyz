const THREE = require("three")
const TWEEN = require("@tweenjs/tween.js")
import { createWorkPanel } from './homeThreeCreators'
import {
    offsetX,
    offsetY,
    cameraPosition,
    workStartPos,
    workPanelFocusedPos,
    homePos,
    aboutPos,
    workDescPanel
} from './values'
import { Pages } from "./types"
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
    // camera.updateProjectionMatrix();
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

let lastTap
export function onDoubleClick(h) {
    event.preventDefault()
    var now = new Date().getTime();
    var timesince = now - lastTap;
    if ((timesince < 600) && (timesince > 0)) {
        let tmp = h.lastobj
        h.lastobj.hover(1)
        setTimeout(
            () => { tmp.hover(2); }, 2000
        )
        zoomIntoWork(h)
    }
    lastTap = new Date().getTime();
}

let sy = 0
let vec = new THREE.Vector3(); // create once and reuse
let clearMouse

export function onScroll(h){
    h.event.preventDefault()
    // check if on work page
    // check scroll direction
    // scroll up if not at bottom
    // scroll down if not at top
}

export function onTouchEnd({ event, scrolling, zooming, lastobj, workPanel, camera, tileGroup, rc }) {
    console.log("touch",scrolling,lastobj)
    event.preventDefault()
    if (zooming && !lastobj) return
        if (lastobj && !scrolling) {
            if (lastobj === workPanel.mesh) return
            // this was used to draw the small squares
            // if (lastobj.hover) lastobj.hover(1)
            // zoomIn()
        }
        // console.log(e)
    scrolling = false

    let mouse = { x: 0, y: 0 }

    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    rc.setFromCamera(mouse, camera)
    let intersects = rc.intersectObjects(tileGroup.children);
    let obj = intersects[0]
    console.log(obj,scrolling,clearMouse,obj ? obj.object != workPanel : "no obj")
    if (obj && !scrolling && !clearMouse && obj.object != workPanel) {
        // obj.object.colorize()
        // lastobj.hover(1)
        console.log("were here")
        lastobj = obj.object

        if(!lastobj.controller) return

        let img = lastobj.controller.heroDiv || lastobj.controller.hero || ""

        console.log(img)
        // if the last object is the same as work panel object
        // then we should reset everything
        let hoverobj = workPanel.hover(img)

        if(img){
            console.log("HELL")
            lastobj.controller.updateHeroDiv(hoverobj)
        }

        // if (lastobj.registerCanvas) lastobj.registerCanvas()
        
    } else {
        if (lastobj) {
            // vec.set(0, 0, 0)
            workPanel.resetColor()
            lastobj = null
        }
    }
    scrolling = false
}

export function onTouchMove(h) {
    // event.preventDefault()
    h.scrolling = true
    h.m.x = (h.event.touches[0].clientX / window.innerWidth) * 2 - 1
    h.m.y = - (h.event.touches[0].clientY / window.innerHeight) * 2 + 1
    let position = new THREE.Vector3()
    // position.setPositionFromMatrix( tileGroup.matrixWorld );

    let speed = 0.001

    let move = h.event.touches[0].pageY
    var deltaY = (move - sy);
    var box = new THREE.Box3().setFromObject(h.tileGroup);
    let height = box.max.y - box.min.y

    if (h.tileGroup.position.y + (deltaY * speed) < 0) return
    if (h.tileGroup.position.y + (deltaY * speed) > height - 2) {
        return
    }

    h.tileGroup.position.y += (deltaY * speed);
}

export function onTouchStart(event) {
    sy = event.touches[0].pageY;
}

export function onWindowResize({ camera, renderer, cssrenderer, scene }) {
    location.reload()
    camera.aspect = window.innerWidth / window.innerHeight;

    renderer.setSize(window.innerWidth, window.innerHeight);
    cssrenderer.setSize(window.innerWidth, window.innerHeight)

    camera.updateProjectionMatrix();

    cssrenderer.render(scene, camera)
    renderer.render(scene, camera);
}

export function onMouseMove(h) {
    h.event.preventDefault()
    h.m.x = (h.event.clientX / window.innerWidth) * 2 - 1 + offsetX
    h.m.y = - (h.event.clientY / window.innerHeight) * 2 + 1 + offsetY
    h.rc.setFromCamera(h.m, h.camera);
    // calculate objects intersecting the picking ray
    var intersects = h.scene === undefined || h.tileGroup === undefined ? [] : h.rc.intersectObjects([h.transitionButton.mesh ,...h.tileGroup.children]);
    // knowing this will only contain one object
    if (intersects[0] && !h.scrolling && !clearMouse && !h.mobile) {
        // intersects[0].object._rotate(
        //     intersects[0].point.x,
        //     intersects[0].point.y
        // )
        document.body.style.cursor = 'pointer'

        let intersected = intersects[0].object
        if(intersected == h.transitionButton.mesh){
            h.lastObj = intersected
            return
        } 
        // update back panel to color of tile
        let img = intersected.controller.heroDiv || intersected.hero

        let obj = h.workPanel.hover(img)

        // save created 3d object
        if (!intersected.controller.heroDiv) intersected.controller.updateHeroDiv(obj)

        if (intersects[0].object.registerCanvas) intersects[0].object.registerCanvas()

        //reset the tiles if we hover on the back board
        if (intersects[0].object === h.workPanel.mesh && h.lastobj) {
            // set rotation to zero
            //     lastobj._rotate(0, 0)
            // lastobj = null
            if (!h.zooming && !h.zoomed) h.workPanel.resetColor()
        }

        h.lastobj = intersects[0].object
    } else {
        // if (lastobj && !mobile) {
        // if(lastobj.colorize)lastobj.colorize()
        document.body.style.cursor = 'default'
        vec.set(0, 0, 0)
        // set rotation to zero
        //     lastobj._rotate(0, 0)
        if (!h.zooming && !h.zoomed) h.workPanel.resetColor()
        h.lastobj = null
        // }
    }
}

let speed = 0.125
let lastY = 0 
export function onMouseScroll(h){
    h.event.preventDefault()
    if(h.currentPage !== Pages.WORK) return
    if(h.mobile) return
    try{

        // var deltaY = (move - sy);
        var box = new THREE.Box3().setFromObject(h.tileGroup);
        let height = box.max.y - box.min.y

        // console.log("DELTA",deltaY)
        let delta = h.event.deltaY
        // this can be hardcoded as it's the bottom
        if (h.tileGroup.position.y + delta * speed > -17 ) return 
        if (h.tileGroup.position.y + delta * speed < -(height + -17) ) return 

        // top is 220
        // bottom is -17

        h.tileGroup.position.y += (delta * speed);
        console.log(height, h.tileGroup.position.y)
    }catch(e){
        console.log(e)
    }
}

export function onMouseDown(h) {
    h.event.preventDefault()
    if (h.zooming && !h.lastobj && h.mobile) return
    try {
        if(h.lastObj == h.transitionButton.mesh && h.zoomed){
            if(!h.onWorkDesc){
                moveToDesc(h)
                h.onWorkDesc = true
                return
            }else{
                zoomIntoWork(h)
                h.onWorkDesc = false
                h.lastobj = h.transitionButton
                return 
            }
        } 
        // uncertain if h.event is correctly assigned
        if (h.event.type === 'mousedown' && h.lastobj && !h.scrolling) {
            if (h.lastobj === h.workPanel.mesh) return
            // this was used to draw the small squares
            if (h.lastobj.hover) h.lastobj.hover(1)
            zoomIntoWork(h)
            // register data to be used by the website
            h.uca(h.lastobj.hero)
        }
        // if(h.event.type==="mousedown" && h.lastobj === h.transitionButton.mesh)
    } catch (e) {
        console.log(e)
    }
}

function moveToDesc(h){
    let to = workDescPanel
    h.zooming = true
    h.zoomed = false
    h.lastobj = null
    let start = from(h.camera)
    let tween = new TWEEN.Tween(start)
        .to(to, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            h.camera.position.set(start.x, start.y, start.z);
            h.camera.updateProjectionMatrix();
        })
        .onComplete(function () {
            h.zooming = false
            h.zoomed = true
            h.desc = true
            // let arrows = Array.from(document.getElementsByClassName("arrow"))
            // arrows.forEach((e) => {
            //     //@ts-ignore
            //     e.style.visibility = "visible"
            // })zoomIntoWork
            // h.transitionButton.mesh.visible = true
        })
        .start();
}

function zoomIntoWork(h) {
    // if (!h.lastobj) return

    let to = workPanelFocusedPos

    h.zooming = true
    h.zoomed = false
    h.lastobj = null
    let start = from(h.camera)
    let tween = new TWEEN.Tween(start)
        .to(to, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            h.camera.position.set(start.x, start.y, start.z);
            h.camera.updateProjectionMatrix();
        })
        .onComplete(function () {
            h.zooming = false
            h.zoomed = true
            let arrows = Array.from(document.getElementsByClassName("arrow"))
            arrows.forEach((e) => {
                //@ts-ignore
                e.style.visibility = "visible"
            })
            h.transitionButton.mesh.visible = true
        })
        .start();

    h.camera.updateProjectionMatrix();
    // showWork()

    let header = Array.from(window.document.getElementsByClassName("Header")) || []
    if(header.length !== 0 ) {
        let node = header[0].children[1]
        // don't add another back button if present
        if(header[0].children[1].children.length >= 2) return
        let back = document.createElement("div")
        back.id = "back_button"
        back.innerText = "back "
        back.className = "hover"
        back.onclick = ()=>{zoomOutOfWork(h)}
        node.prepend(back)
    }
}

let from = (camera) => {
    return {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    }
}

export function zoomOutOfWork(h) {
    h.zooming = true
    // remove back button
    let bb = document.getElementById("back_button")
    bb.parentElement.removeChild(bb)
    h.transitionButton.mesh.visible = false
    h.workPanel.resetColor()
    let start = from(h.camera)
    let tween = new TWEEN.Tween(start)
        .to({ ...workStartPos }, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            h.camera.position.set(start.x, start.y, start.z);
        })
        .onComplete(function () {
            h.zoomed = false
            h.zooming = false
            let arrows = Array.from(document.getElementsByClassName("arrow"))
            arrows.forEach((e) => {
                //@ts-ignore
                e.style.visibility = "hidden"
            })
        })
        .start();

    // h.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
    // h.camera.fov = 75
    // h.camera.updateProjectionMatrix();
    //     modalMode = false

}

const addWorkDesc = (h) => {
    let newPanel = createWorkPanel()

    h.scene.add(newPanel)

    h.newPanel = h
}

const removeWorkDesc = (h) => {
    // (h.newPanel)
}

export const moveToWork = (h) => {
	h.currentPage = Pages.WORK
    h.scrolling = true

    let start = from(h.camera)

    let tween = new TWEEN.Tween(start)
        .to(workStartPos , 2000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate((o) => {
            h.camera.position.set(start.x, start.y, start.z);
            h.camera.updateProjectionMatrix();
            h.scene.updateMatrixWorld()
        })
        .onComplete(function () {
            h.zoomed = false
            h.scrolling = false
        })

    tween.start()
}

export const moveToAbout = (h) => {
	h.currentPage = Pages.ABOUT
    h.scrolling = true

    let start = from(h.camera)

    let tween = new TWEEN.Tween(start)
        .to(aboutPos , 2000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate((o) => {
            h.camera.position.set(start.x, start.y, start.z);
            h.camera.updateProjectionMatrix();
            h.scene.updateMatrixWorld()
        })
        .onComplete(function () {
            h.zoomed = false
            h.scrolling = false
        })

    tween.start()
}

export const moveToHome = (h) => {
	h.currentPage = Pages.HOME
    h.scrolling = true

    let start = from(h.camera)

    let tween = new TWEEN.Tween(start)
        .to(homePos , 2000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate((o) => {
            h.camera.position.set(start.x, start.y, start.z);
            h.camera.updateProjectionMatrix();
            h.scene.updateMatrixWorld()
        })
        .onComplete(function () {
            h.zoomed = false
            h.scrolling = false
        })

    tween.start()
}

export const showWork = () =>{

}