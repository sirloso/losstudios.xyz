export const MOBILE_BREAKPOINT = 800
export const isMobile = () => {
	return window.innerWidth <= MOBILE_BREAKPOINT
}

export const NUM_ROWS = 35
export const TILES_PER_ROW = 2
export const SQUARE_SIZE = 25

// todo: fix this
export const offsetX = 0//-.001
export const offsetY = 0//.10

export const desktopCamera = {
    x: 1.5,
    y: 3.0,
    z: 5.5
}

export const mobileCamera = {
    x: -1,
    y: 0,
    z: 6
}

export const cameraPosition = isMobile() ? mobileCamera : desktopCamera

export const workPanelStartPos = {
    x: 1000,
    y: 0,
    z: 600
}