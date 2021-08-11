import { RouteComponentProps } from '@reach/router'
export interface HeaderProps{
    showWork?: boolean
    showLogo?: boolean
    showAbout?: boolean
    updateLogo?: (arg0: boolean) => void 
    updateWork?: (arg0: boolean) => void
    updateAbout?: (arg0: boolean) => void
}

export interface FooterProps{
    centerCamera(): void
    back(): void
    contact(): void
}

export interface SlideShowProps{
    images: Array<string>
    id: string
    autoPlay?: boolean 
}

export interface HomeProps extends RouteComponentProps{}
export interface WorkProps extends RouteComponentProps{}
export interface AboutProps extends RouteComponentProps{}

export enum Pages{
    HOME = "home",
    WORK = "work",
    ABOUT = "about",
    FOUROFOUR = "404"
}