import React from 'react'
import { Link } from 'react-router-dom'

import { HeaderProps } from '../Logic/types'

const Header = (props: HeaderProps) => {
    return(
        <div className="Header">
            <div id="HeaderLeft" onClick={()=>{
            }}>
                {
                    props.showLogo && (
                        <div>
                            <Link to="/">
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
                            <Link to="/work">
                                work
                            </Link>
                        </div>
                    )
                }
                <div className="MenuItem">
                    {
                        props.showAbout && (
                            <Link to="/about">
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