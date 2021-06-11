import { navigate } from '@reach/router'
import React from 'react'

import { HeaderProps } from '../Logic/types'

const Header = (props: HeaderProps) => {
    const stopWork = ()=>{ 
        //@ts-ignore
        window.stopWork = true
        //@ts-ignore
        window.stopHome = false
    }
    const stopHome = ()=>{ 
        //@ts-ignore
        window.stopWork = false
        //@ts-ignore
        window.stopHome = true
    }

    const stopBoth = () =>{
        //@ts-ignore
        window.stopWork = true
        //@ts-ignore
        window.stopHome = true
    }
    
    const navAbout = () =>{
        stopBoth()
        navigate("/about")
    } 
    const navWork = () =>{
        stopHome()
        navigate("/work")
    } 

    const navHome = () =>{
        stopWork()
        navigate("/")

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