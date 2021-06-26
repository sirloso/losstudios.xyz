import React, { useEffect, useRef, useState } from 'react'
import { Line } from 'rc-progress'

import { zoomOut, setup } from '../Logic/index'

import Header from '../Components/Header'
import Footer from '../Components/WorkFooter'
import { WorkProps } from '../Logic/types'


const Work = (props: WorkProps) => {
    const [loading, udpateLoading] = useState(true)
    const [percentage, updatePercentage] = useState(20)
    let back = zoomOut

    useEffect(() => {
        if (loading)
            if (percentage === 100) udpateLoading(false)
    }, [percentage])

    if (percentage < 100) setTimeout(() => { updatePercentage(20 + percentage) }, 500)
    if (percentage < 100) setTimeout(() => { updatePercentage(20 + percentage) }, 1000)
    if (percentage < 100) setTimeout(() => { updatePercentage(20 + percentage) }, 1500)
    if (percentage < 100) setTimeout(() => { updatePercentage(20 + percentage) }, 2000)
    if (percentage < 100) setTimeout(() => { updatePercentage(20 + percentage) }, 2500)

    const canvas = useRef(null)
    const [GalleryArray,updateGallery] = useState([])

    // attatch three
    useEffect(() => {
        if (!loading)
            if (canvas) {
                console.log("requiring")
                // setup(GalleryArray)
                console.log('done');
            }
    }, [loading])

    return (
        <div id="Work">
            <Header showWork={false} showAbout showLogo />
            <div className="Work">
                {
                    loading && (
                        <div className="Loading">
                            <div>loading</div>
                            <Line className={"ProgressBar"} percent={percentage} strokeLinecap="square" strokeColor={"black"} trailColor={"white"} />
                        </div>
                    )
                }
                {
                    !loading && (
                        <div id="scenes">
                            <div ref={canvas} id="webglScene" >
                            </div>
                            <div ref={canvas} id="cssScene" >
                            </div>
                        </div>
                    )
                }
                            <div id="GalleryArray">
                                {
                                    GalleryArray.map((el,idx)=>{
                                        return <div className="gallery" key={idx}>
                                            {el.gallery}
                                        </div>
                                    })
                                }
                            </div>
                            <div id="workwork">
                                work helllosdjfalksjdflajsdflkajsdlfjk
                            </div>
            </div>
            <div id="FooterContainer">
                <Footer
                    centerCamera={back}
                    back={back}
                    contact={back}
                />
            </div>
        </div>
    )
}

export default Work