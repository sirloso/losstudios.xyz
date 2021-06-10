import React, { useState, useRef, useEffect } from 'react'

import Header from '../Components/Header'
import { setup } from '../Logic/homeAnimator'

const Home = () => {
    const [detail,updateDetail] = useState(false)
    const [loaded,updateLoaded] = useState(false)
    const home = useRef()
    const css = useRef()
    const webgl = useRef()

    useEffect(() => {
       console.log(loaded)
       if(!loaded && (home && css && webgl)) {
        setup(home.current,css.current,webgl.current)
        updateLoaded(true)
       }
    }, [loaded]);

    setTimeout(()=>{
        if(!detail) updateDetail(true)
    },2000)
    return(
        <div className="Home">
            <Header showLogo={false} showWork showAbout/>
            <div id="HomeBody" ref={home}>
                <div id="HomeLogo" className="animate__animated animate__fadeIn">
                    Los Studios
                </div>
                <div id="renderers">
                    <div id="css" ref={css}/>
                    <div id="webgl" ref={webgl}/>
                </div>
            </div>
        </div>
    )
}

export default Home

/*

                {
                    detail && (
                        <div id="HomeDetail" className="animate__animated animate__fadeIn">
                            a creative technology studio
                        </div>
                    )
                }

*/