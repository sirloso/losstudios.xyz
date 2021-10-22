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

export const workPanelFocusedPosMobile = {
    x: 3001.5,
    y: 0,
    z: 100
}

export const workPanelFocusedPos = isMobile() ? workPanelFocusedPosMobile : {
    x: 3000,
    y: 0,
    // z: 600
    z: 750
}


// export const apiBaseEndpoint = process.env.PRODUCTION ? "":"http://localhost:1337" 
// export const apiBaseEndpoint = "http://localhost:1337"
export const apiBaseEndpoint = "https://cms.losstudios.xyz"
// export const apiBaseEndpoint = "http://197.168.0.10:1337"

export enum apiEndpointExtentions{
    works  = "/works",
}

export const homePosMobile = {
    x: -12,
    y: 0,
    z: 1200
}

export const homePos = isMobile() ? homePosMobile : {
    x: 0,
    y: 0,
    z: 1000
}


export const aboutPos = {
    x: 1500,
    y: 2000,
    z: 1000
}

export const workStartPosMobile = {
    x: 3000,
    y: 0,
    z: 1000
}

export const workStartPos = isMobile() ? workStartPosMobile : {
    x: 3000,
    y: 0,
    z: 1000
}

export const workButtonPosMobile = {
    x: 3001.5,
    y: -170,
    z: -800
}


export const workButtonPosMobileBottom = {
    x: 3001.5,
    y: -1250,
    z: -800
}

export const workButtonPos = {
    x: 3510,
    y: -148,
    z: 0
}

export const workDescPanelMobile = {
    x: 3001.5,
    y: -1005,
    // z: -1800
    z: 1
}

export const workDescPanel = isMobile() ? workDescPanelMobile : {
    x: 4010,
    y: 0,
    // z: 600
    z: 1000
}

export const workPanelPos = {
    x: 2900,
    y: 0,
    z: 1
}

export const tileGroupPosStart = {
    x: 3070,
    y: -17,
    z: 850
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
        // x: 2792,
        // y: 0,
        // z: 905
        x: 3001.5,
        y: 250,
        // z: 785
        z: -1800
    },
    tileGroup:{
        x: 3000,
        y: 0,
        z: 908
    },
}

export const workDescPanelPosMobile = {
    x: 3001.5,
    y: -950,
    z: -1800
}

export const workDescPanelPos =  isMobile() ? workDescPanelPosMobile : {
    // x: 4035,
    x: 3950,
    y: 0,
    z: 1
}