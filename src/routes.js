import React from 'react'

import { Switch, Route } from 'react-router-dom'

import SignIn from './components/SignIn'

const Routes = () => ((
    <Switch>
       <Route path='/signin' component={SignIn}/>     
    </Switch>
))

export default Routes