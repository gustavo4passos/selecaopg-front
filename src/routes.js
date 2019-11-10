import React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { PublicRoute } from './components/PublicRoute'
import { PrivateRoute } from './components/PrivateRoute';

import SignIn from './components/SignIn'
import SignUp from './components/SignUp'

const Routes = () => ((
    <Router>
        <Switch>
            <PublicRoute path='/entrar' component={SignUp} restricted={true}/>     
            <PrivateRoute path='/' component={Selection}/>
        </Switch>
    </Router>
))

export default Routes