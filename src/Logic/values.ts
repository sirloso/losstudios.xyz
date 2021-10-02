// export const apiUrl = "http://localhost:1337"
export const apiUrl = "https://cms.losstudios.xyz"
export const MOBILE_BREAKPOINT = 800
export const isMobile = () => {
	return window.innerWidth <= MOBILE_BREAKPOINT
}
export const Breakpoints = {
    small : MOBILE_BREAKPOINT,
    medium: 1200,
    large: 1201
}
export const NUM_ROWS = 35
export const TILES_PER_ROW = 2
export const SQUARE_SIZE = 25

// todo: fix this
export const offsetX = 0//-.001
export const offsetY = 0//.10

export const desktopCamera = {
    x: 0,
    y: 0,
    z: 1000
    // x: 3000,
    // y: 0,
    // z: 1000
}

export const mobileCamera = {
    x: -1,
    y: 0,
    z: 6
}

export const cameraPosition = isMobile() ? mobileCamera : desktopCamera

export const workPanelFocusedPos = {
    x: 3000,
    y: 0,
    z: 600
}

// export const apiBaseEndpoint = process.env.PRODUCTION ? "":"http://localhost:1337" 
// export const apiBaseEndpoint = "http://localhost:1337"
export const apiBaseEndpoint = "https://cms.losstudios.xyz"
// export const apiBaseEndpoint = "http://197.168.0.10:1337"

export enum apiEndpointExtentions{
    works  = "/works",
}

export const homePos = {
    x: 0,
    y: 0,
    z: 1000
}

export const homePosMobile = {
    x: -12,
    y: 0,
    z: 1200
}

export const aboutPos = {
    x: 1500,
    y: 2000,
    z: 1000
}

export const workStartPos = {
    x: 3000,
    y: 0,
    z: 1000
}

export const workButtonPos = {
    x: 3500,
    y: 0,
    z: 1
}

export const workDescPanel = {
    x: 4010,
    y: 0,
    z: 600
}

export const workPanelPos = {
    x: 3000,
    y: 0,
    z: 1
}

export const tileGroupPosStart = {
    x: 3070,
    y: -17,
    z: 850
}

export const workStartPosMobile = {
    x: 3000,
    y: 0,
    z: 1000
}

export const workPanelPosMobile = {
    x: 3000,
    y: 0,
    z: 1
}

export const tileGroupPosStartMobile = {
    x: 3070,
    y: -17,
    z: 850
}

export const aboutPosMobile = {
    x: 1500,
    y: 2000,
    z: 1000
}

export const PANEL_404 = "404_panel"

export const mobile = {
    workPanel: {
        x: 2792,
        y: 0,
        z: 905
        // z: 890
        // z: 1
    },
    tileGroup:{
        x: 3005,
        y: 0,
        z: 908
    },
}

export const workDescPanelPos = {
    x: 4035,
    y: 0,
    z: 1
}