import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import "animate.css"

import Home from './Pages/Home'
import Work from './Pages/Work'
import About from './Pages/About'
import Header from './Components/Header'

const App = (props:any) => {
    return(
        <div id="App">
            <Router>
                <Route exact path="/">
                    <Home/>
                </Route>
                <Route path="/work">
                    <Work />
                </Route>
                <Route path="/about">
                    <About/>
                </Route>
            </Router>
        </div>
    )
}

export default App