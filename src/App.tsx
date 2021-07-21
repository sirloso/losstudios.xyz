import React from 'react'
import "animate.css"
import 'react-slideshow-image/dist/styles.css'
import { Router, Link } from "@reach/router"

import Home from './Pages/Home'


const App = (props:any) => {
    return(
        <div id="App" >
            <Router >
                    <Home path="*"/>
            </Router>
        </div>
    )
}

export default App