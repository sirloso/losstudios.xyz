import React from 'react'
import Header from '../Components/Header'
import { AboutProps } from '../Logic/types'

const About = (props: AboutProps) => {
    return(
        <div id="About">
            <Header showLogo showWork showAbout={false}></Header>
            About
        </div>
    )
}

export default About