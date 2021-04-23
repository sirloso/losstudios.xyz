import React, { useState } from 'react'

import Header from '../Components/Header'

const Home = () => {
    const [detail,updateDetail] = useState(false)
    setTimeout(()=>{
        if(!detail) updateDetail(true)
    },2000)
    return(
        <div className="Home">
            <Header showLogo={false} showWork showAbout/>
            <div id="HomeBody">
                <div id="HomeLogo" className="animate__animated animate__fadeIn">
                    Los Studios
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