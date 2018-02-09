import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Config } from '../config.js'
import BillBoard from 'Giraffe/billboard'
import SearchBar from './searchbar'
import RecentVictoryList from 'Legacy/recentvictory.js'
import TopPetitions from './top-petitions'
import OrganizationHeader from 'Legacy/organization-header'

const Home = ({ params, nav }) => {
  const { organization } = params
  const isOrganization = Boolean(organization && organization !== 'pac')
  const isPac = (organization === 'pac' || (!isOrganization && Config.ENTITY === 'pac'))
  const orgData = (nav && nav.orgs && nav.orgs[organization]) || {}
  return (
    <div className='moveon-petitions container background-moveon-white bump-top-1'>
      {isOrganization ? null : <BillBoard />}
      <div>
        <SearchBar isLong />
      </div>

      {isOrganization ? <OrganizationHeader orgData={orgData} /> : null}

      <div className='row front-content'>
        <TopPetitions
          pac={isPac ? 1 : 0}
          megapartner={organization || ''}
          fullWidth={isOrganization}
          source='homepage'
        />
        {isOrganization ? null : <RecentVictoryList />}
      </div>
    </div>
  )
}

Home.propTypes = {
  nav: PropTypes.object,
  params: PropTypes.object
}

function mapStateToProps(store) {
  return {
    nav: store.navStore
  }
}

export default connect(mapStateToProps)(Home)
