import React, { useState, useEffect } from 'react'

import { handlerObj } from '../Logic/homeAnimator'
import { moveToHome, moveToWork, moveToAbout } from '../Logic/homeInteractionHandlers'

import { HeaderProps } from '../Logic/types'

let backButtonId = "back_button"
const checkForInteractionButton = () => {
    let bb = document.getElementById(backButtonId)
    if(bb){
        bb.parentNode.removeChild(bb)
    }
    // @ts-ignore
    let h = window.h
    if(h){
        try{
            h.workDescPanel.tmpDiv.element.style.visibility = "hidden"
            h.workDescPanel.obj.visible = false
            h.transitionButton.mesh.visible = false
        }catch(e){}
    }
}

const Header = (props: HeaderProps) => {
    const navAbout = () =>{
        checkForInteractionButton()
        moveToAbout(handlerObj)
        hideAbout()
    } 

    const navWork = () =>{
        checkForInteractionButton()
        moveToWork(handlerObj)
        hideWork()
    } 

    const navHome = () =>{
        checkForInteractionButton()
        moveToHome(handlerObj)
        hideLogo()
    }

    const hideWork = () => {
        props.updateAbout(true)
        props.updateWork(false)
        props.updateLogo(true)
    }

    const hideAbout = () => {
        props.updateAbout(false)
        props.updateWork(true)
        props.updateLogo(true)
    }

    const hideLogo = () => {
        props.updateAbout(true)
        props.updateWork(true)
        props.updateLogo(false)
    }

    return(
        <div className="Header">
            <div id="HeaderLeft" onClick={()=>{ }}>
                {
                    props.showLogo && (
                        <div className="hover" onTouchEnd={navHome} onClick={navHome}>
                                Los Studios
                        </div>
                    )
                }
            </div>
            <div id="HeaderRight">
                {
                    props.showWork && (
                        <div className="Hover MenuItem" onTouchEnd={navWork} onClick={navWork}>
                                work
                        </div>
                    )
                }
                <div className="Hover MenuItem">
                    {
                        props.showAbout && (
                            <div  onClick={navAbout} onTouchEnd={navAbout}>
                                about
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Header