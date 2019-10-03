import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Dashboard from './Components/Dashboard/Dashboard'
import Redirect from './Components/Redirect/Redirect'

export default(
  <Switch>
    {/* <Route exact path='/' component={Dashboard}/> */}
    <Route path='/cards/page/:page' component={Dashboard}/>
    <Route path='*' component={Redirect}/>
  </Switch>
)