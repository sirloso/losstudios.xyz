import React from 'react'
import { FooterProps } from "../Logic/types"

const Footer = (props: FooterProps) => {
    return(
        <div className="Footer">
            <div id="BackButton" onClick={props.back}>
                back
            </div>
            <div id="CenterCameraButton" onClick={props.centerCamera}>
                center camera
            </div>
        </div>
    )
}

export default Footer 

/*

            <div id="ContactButton" onClick={props.contact}>
                contact
            </div>

*/