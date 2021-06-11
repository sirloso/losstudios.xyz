import { RouteComponentProps } from '@reach/router'
export interface HeaderProps{
    showWork?: boolean
    showLogo?: boolean
    showAbout?: boolean
}

export interface FooterProps{
    centerCamera(): void
    back(): void
    contact(): void
}

export interface HomeProps extends RouteComponentProps{}
export interface WorkProps extends RouteComponentProps{}
export interface AboutProps extends RouteComponentProps{}