import * as THREE from 'three'
import { isMobile } from './values'
import { Tile } from './tile'
import { Panel, WorkPanel } from './panel'
import {
	NUM_ROWS,
	TILES_PER_ROW,
} from './values'
import { Gallery } from './redux/api'

export const createWorkPanel = () => {
	let backPanel = new WorkPanel()

	for (const c of backPanel.obj.children) {
	}

	return backPanel
}

export const createPanel = (div: HTMLElement, sceneBoundingBox: DOMRect, color: string = "red", createRenderer: boolean = true) => {
	let geometry = new THREE.BoxGeometry(
		parseInt(div.style.width.split("px")[0]),
		parseInt(div.style.height.split("px")[0]),
		10
	)
	let box = new Panel(geometry, div, sceneBoundingBox, color, createRenderer)

	return box
}

export const createTiles = (
	titles: Array<string>,
	geometry: THREE.BoxGeometry,
	galleries: Array<Array<Gallery>>,
	galleryArray: (title: string,gallery: Array<Gallery>) => void 
) => {
	const tiles = []
	const tileGroup = new THREE.Group()

	for (let i = 0; i < titles.length; i++) {
		const tile = new Tile(
			geometry,
			titles[i],
			galleries[i],
			galleryArray
		)
		tiles.push(tile)
		tileGroup.add(tile.tc.obj)
		if (isMobile()) {
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