import React from 'react'
import "animate.css"
import { Router, Link } from "@reach/router"

import Home from './Pages/Home'
import Work from './Pages/Work'
import About from './Pages/About'
import Header from './Components/Header'

const App = (props:any) => {
    return(
        <div id="App">
            <Router >
                    <Home path="/"/>
                    <Work path="/work"/>
                    <About path="/about"/>
            </Router>
        </div>
    )
}

export default App