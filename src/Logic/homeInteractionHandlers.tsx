const THREE = require("three")
const TWEEN = require("@tweenjs/tween.js")
import {
	offsetX,
	offsetY,
	cameraPosition
} from './values'
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
export function onDoubleClick(zooming,zoomed,camera,lastobj) {
    event.preventDefault()
    var now = new Date().getTime();
    var timesince = now - lastTap;
    if ((timesince < 600) && (timesince > 0)) {
        let tmp = lastobj
        lastobj.hover(1)
        setTimeout(
            () => { tmp.hover(2); }, 2000
        )
        zoomIn(zooming,zoomed,camera,lastobj)
    }
    lastTap = new Date().getTime();
}

let sy = 0
let vec = new THREE.Vector3(); // create once and reuse
let clearMouse
export function onTouchEnd(event,scrolling,zooming,lastobj,backPanel,camera,tileGroup,rc) {
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

export function onTouchMove(event,scrolling,m,tileGroup) {
    // event.preventDefault()
    scrolling = true
    m.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1 
    m.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1 
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

export function onTouchStart(event) {
    sy = event.touches[0].pageY;
}

export function onWindowResize(camera,renderer,cssrenderer,scene) {
	camera.aspect = window.innerWidth / window.innerHeight;

	renderer.setSize(window.innerWidth, window.innerHeight);
	cssrenderer.setSize(window.innerWidth, window.innerHeight)

	camera.updateProjectionMatrix();

	cssrenderer.render(scene, camera)
	renderer.render(scene, camera);
}

export function onMouseMove(event,m,camera,scrolling,mobile,scene,backPanel,lastobj,zooming,zoomed,rc,tileGroup) {
    event.preventDefault()
    m.x = (event.clientX / window.innerWidth) * 2 - 1 + offsetX
    m.y = - (event.clientY / window.innerHeight) * 2 + 1 + offsetY
    rc.setFromCamera(m, camera);

    // calculate objects intersecting the picking ray
    var intersects = scene === undefined || tileGroup === undefined ? [] : rc.intersectObjects(tileGroup.children);
    // knowing this will only contain one object
    if (intersects[0] && !scrolling && !clearMouse && !mobile) {
        // intersects[0].object._rotate(
        //     intersects[0].point.x,
        //     intersects[0].point.y
        // )
        document.body.style.cursor = 'pointer'

        let intersected = intersects[0].object
        // update back panel to color of tile
        let img = intersected.controller.heroDiv || intersected.hero 
        let obj = backPanel.hover(img)

        // save created 3d object
        if(!intersected.controller.heroDiv) intersected.controller.updateHeroDiv(obj)

        if (intersects[0].object.registerCanvas) intersects[0].object.registerCanvas()

        //reset the tiles if we hover on the back board
        if (intersects[0].object === backPanel.mesh && lastobj) {
            // set rotation to zero
        //     lastobj._rotate(0, 0)
            // lastobj = null
            if (!zooming && !zoomed) backPanel.resetColor()
        }

        lastobj = intersects[0].object

    } else {
        // if (lastobj && !mobile) {
            // if(lastobj.colorize)lastobj.colorize()
            document.body.style.cursor = 'default'
            vec.set(0, 0, 0)
            // set rotation to zero
        //     lastobj._rotate(0, 0)
            if (!zooming && !zoomed) backPanel.resetColor()
        //     lastobj = null
        // }
    }
}

export function onMouseDown(event,zooming,lastobj,mobile,backPanel,scrolling,zoomed,camera) {
    event.preventDefault()
    if (zooming && !lastobj && mobile) return
    try {
        if (event.type === 'mousedown' && lastobj && !scrolling) {
            if (lastobj === backPanel.mesh) return
            // this was used to draw the small squares
            if (lastobj.hover) lastobj.hover(1)
            zoomIn(zooming,zoomed,camera,lastobj)
        }
    } catch (e) {
        console.log(e)
    }
}

function zoomIn(zooming,zoomed,camera,lastobj) {
    if (!lastobj) return

    let to = {
        x: 1.5,
        y: 3.3,
        z: -15.1
    }

    zooming = true
    zoomed = false
    lastobj = null
    let start = from(camera)
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

let from = (camera) => {
    return {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    }
}

export function zoomOut(camera,scrolling,zoomed) {
    scrolling = true
    let start = from(camera)
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
//     modalMode = false

}