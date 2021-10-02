import React, { useState, useRef, useEffect } from 'react'

import Header from '../Components/Header'
import { SlideShow } from '../Components/Gallery'
import { setupHome, setupWork, setupAbout } from '../Logic/homeAnimator'
import {
    handleLogoMouseEnter,
    handleLogoMouseLeave,
    moveToWork
} from '../Logic/homeInteractionHandlers'
import { HomeProps } from '../Logic/types'
import { useAppDispatch } from '../Logic/redux/workSlice'
import { Work } from '../Logic/redux/workSlice'
import { useGetWorksQuery,Gallery, Formats } from '../Logic/redux/api'
import { Breakpoints, apiUrl } from '../Logic/values'
import ReactMarkdown from 'react-markdown'

const data2Map = ( data: Work[] ) => {
    let m = new Map<string,Work>()

    data.forEach((d:Work)=>{
        m[d.id] = d
    })

    return m
}

const Home = (props: HomeProps) => {
    const [detail, updateDetail] = useState(false)
    const [loaded, updateLoaded] = useState(false)
    const [animate, updateAnimate] = useState(false)

    const [showLogo, updateShowLogo] = useState(false)
    const [showWork, updateShowWork] = useState(true)
    const [showAbout, updateShowAbout] = useState(true)

    const [currentArticle,updateCurrentArticle] = useState({})
    const [tagMap,updateTagMap] = useState({} as Map<string,Work>)

    const about = useRef()
    const home = useRef()
    const css = useRef()
    const webgl = useRef()

    const [GalleryArray, updateGallery] = useState([])

    let gallery = [
        "https://nsc.nyc3.digitaloceanspaces.com/028b1fcfd219e13b4ccb9730fce149e2.jpg",
        "https://nsc.nyc3.digitaloceanspaces.com/0916a7105953013e63163bdd14e400e5.jpg",
        "https://nsc.nyc3.digitaloceanspaces.com/1b216267fbb791c07454464904b926dc.jpg"
    ]

    const getFormatSize = (formats: Formats) => {
        if(formats.small && window.innerWidth <= Breakpoints.small) return "small"
        if(formats.medium && window.innerWidth <= Breakpoints.medium) return "medium"
        if(formats.large && window.innerWidth >= Breakpoints.large) return "large"

        if(!formats.small) return "thumbnail"
        if(!formats.medium) return "small"
        if(!formats.large) return "medium" 
    }

    const createGallery = (tag: string,gallery: Array<Gallery> = []) => {
        let sizedGallery = gallery.map( g =>{
            let size = getFormatSize(g.formats) 
            return apiUrl + g.formats[size].url
        })
        let ss = SlideShow(sizedGallery, tag)
        GalleryArray.push(ss)
        updateGallery(GalleryArray)
    }


    useEffect(()=>{
    },[
        currentArticle
    ])

    const { data, error, isLoading } = useGetWorksQuery("no")

    useEffect(() => {
        if (!loaded && home && css && webgl) {
            // @ts-ignore
            setupHome(home.current, css.current, webgl.current, updateCurrentArticle)
            updateLoaded(true)
        }

        //@ts-ignore
        if (loaded && !animate) {
            setTimeout(() => {
                handleLogoMouseEnter()
                updateAnimate(true)
            }, 2000)
        }
    }, [loaded]);

    useEffect(() => {
    }, [GalleryArray])

    useEffect(()=>{
        if(data){
            setupWork(createGallery,data)
            setupAbout(about.current)
        }
    },[data])

    setTimeout(() => {
        if (!detail) updateDetail(true)
    }, 2000)

    const transformImage = (href,children,title): string=>{
        return apiUrl + href
    }

    const m2w = () => {
        updateShowWork(false)
        moveToWork(window.h)
    }

    return (
        <div className="Home">
            <Header
                showLogo={showLogo}
                showAbout={showAbout}
                showWork={showWork}
                updateLogo={updateShowLogo}
                updateWork={updateShowWork}
                updateAbout={updateShowAbout}
                />
            <div id="HomeBody" ref={home}>
            <div id="writeups">
                {
                    data && data.map((d)=>{
                        return(
                            <div className="writeup animate__animated animate__fadeIn" id={`${d.Title}_desc`}>
                                <ReactMarkdown transformImageUri={transformImage} linkTarget="_blank">
                                    {
                                        d.Body
                                    }
                                </ReactMarkdown>
                            </div>
                        )
                    })
                    
                }
            </div>
                <div id="HomeLogo"
                    onTouchStartCapture={handleLogoMouseEnter}
                    onTouchEndCapture={handleLogoMouseLeave}
                    onMouseEnter={handleLogoMouseEnter}
                    onMouseLeave={handleLogoMouseLeave}
                    className="hover animate__animated animate__fadeIn">
                    Los Studios
                </div>
                <div id="HomeAbout" onClick={m2w} className="hover animate__animated animate__fadeIn ">
                    <div id="leftAlign">
                        a creative technology studio <br />
                        specializing in
                    </div>
                    <div id="rightAlign">
                        prototyping hardware
                        <br />
                        &
                        <br />
                        unconventional web design
                    </div>

                </div>
                <div id="galleries">
                    {
                        GalleryArray.map((el) => {
                            return el

                        })
                    }
                </div>
                <div id="workwork"></div>
                <div id="about" ref={about}>
                    <div id="aboutContent">
                        Hello this is a test of about
                        <br/>
                        hi!
                        wooooo
                        <br/>
                        asldkjfalsdjf
                        <br/>
                    </div>
                </div>
            </div>
            <div id="renderers">
                <div id="css" ref={css} />
                <div id="webgl" ref={webgl} />
            </div>
        </div>
    )
}

export default Home