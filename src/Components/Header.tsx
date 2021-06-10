import React from 'react'
import { Link } from 'react-router-dom'

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
    return(
        <div className="Header">
            <div id="HeaderLeft" onClick={()=>{ }}>
                {
                    props.showLogo && (
                        <div>
                            <Link to="/" onClick={stopWork}>
                                Los Studios
                            </Link>
                        </div>
                    )
                }
            </div>
            <div id="HeaderRight">
                {
                    props.showWork && (
                        <div className="MenuItem">
                            <Link to="/work" onClick={stopHome}>
                                work
                            </Link>
                        </div>
                    )
                }
                <div className="MenuItem">
                    {
                        props.showAbout && (
                            <Link to="/about" onClick={stopBoth}>
                                about
                            </Link>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Header