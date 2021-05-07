import React from 'react'
import { FooterProps } from "../Logic/types"

const Footer = (props: FooterProps) => {
    return(
        <div className="Footer">
            <div className="hover" id="BackButton" onTouchEnd={props.back} onClick={props.back}>
                back
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