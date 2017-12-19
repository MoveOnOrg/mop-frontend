import React from 'react'
import { IndexRoute, Route, Router, browserHistory, hashHistory } from 'react-router'

import { Config } from './config.js'
import { loadSession } from './actions/sessionActions.js'
import Home from './pages/home.js'
import SignPetition from './pages/sign-petition.js'
import ThanksPage from './pages/thanks.js'
import SearchPage from './pages/search.js'
import PetitionCreatorDashboard from './pages/petition-creator-dashboard.js'
import CreatePetitionPage from './pages/create-petition-page.js'
import Wrapper from './components/wrapper.js'

const baseAppPath = process.env.BASE_APP_PATH || '/'

export const appLocation = (Config.USE_HASH_BROWSING ? hashHistory : browserHistory)

export const routes = (store) => (
  <Router history={appLocation}>
    <Route path={baseAppPath} component={Wrapper} onEnter={(nextState) => { store.dispatch(loadSession(nextState)) }} >
      <IndexRoute component={Home} />
      <Route path='/sign/:petition_slug' component={SignPetition} />
      <Route path='/thanks.html' component={ThanksPage} />
      <Route path='/find/:query' component={SearchPage} />
      <Route path='/find' component={SearchPage} />
      <Route path='/dashboard.html' component={PetitionCreatorDashboard} />
      <Route path='/create_start.html' component={CreatePetitionPage} />
    </Route>
  </Router>
)
