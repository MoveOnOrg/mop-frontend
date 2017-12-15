import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Config } from '../config.js'
import BillBoard from '../components/billboard'
import SearchBar from '../components/searchbar'
import RecentVictoryList from '../components/recentvictory.js'
import TopPetitions from '../components/top-petitions'

const Home = ({ params, nav }) => {
  const { organization } = params
  const isPac = (organization === 'pac' || Config.ENTITY === 'pac')
  const isOrganization = Boolean(organization && organization !== 'pac')
  return (
    <div className='container background-moveon-white bump-top-1'>
      {isOrganization ? null : <BillBoard />}
      <SearchBar />

      {isOrganization
       ? (
        <div>
          <h2>{organization}</h2>
          {organization} is a
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
  nav: PropTypes.object,
  params: PropTypes.object
}

function mapStateToProps(store) {
  return {
    nav: store.navStore
  }
}

export default connect(mapStateToProps)(Home)
