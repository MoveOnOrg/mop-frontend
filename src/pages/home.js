import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { navOrg } from '../selectors/nav'
import { Config } from '../config.js'
import BillBoard from '../components/billboard'
import SearchBar from '../components/searchbar'
import RecentVictoryList from '../components/recentvictory.js'
import TopPetitions from '../components/top-petitions'

const Home = ({ params, org }) => {
  const { organization } = params
  const isOrganization = Boolean(organization && organization !== 'pac')
  const isPac = (organization === 'pac' || (!isOrganization && Config.ENTITY === 'pac'))
  return (
    <div className='moveon-petitions container background-moveon-white bump-top-1'>
      {isOrganization ? null : <BillBoard />}
      <SearchBar />

      {isOrganization
       ? (
        <div className='organization-header'>
          <h2>{org.organization}</h2>
          {org.description || `${org.organization} is a MoveOn MegaPartner, an invite-only program that lets a partner organization&#39;s members and activists set up their own MoveOn petitions in partnership with the original organization.`}
          <p className='pull-right'><a href='create_start.html' className='button background-moveon-bright-red'>Create a petition</a></p>
        </div>
       ) : null
      }

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
  org: PropTypes.object,
  params: PropTypes.object
}

Home.defaultProps = {
  params: {}
}

function mapStateToProps(state, ownProps) {
  return {
    org: navOrg(state, ownProps.params.organization) || {}
  }
}

export default connect(mapStateToProps)(Home)
