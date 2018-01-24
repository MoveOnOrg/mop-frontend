import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { orgCobrand } from '../selectors/nav'

import NavLink from './nav-link'

const Nav = ({ user, cobrand }) => {
  const userLinks = (
    <div className='pull-right bump-top-1 span-7 top-menu'>
      <ul className='nav collapse nav-collapse'>
        <NavLink to='/admin'>Admin</NavLink>
        <NavLink to='/campaign_tips.html'>Campaign Tips</NavLink>
        <NavLink to='/edit_account.html'>Edit account</NavLink>
        <NavLink to='/login/do_logout.html?redirect=/index.html'>Logout</NavLink>
        <NavLink to='https://civic.moveon.org/donatec4/creditcard.html?cpn_id=511'>Donate</NavLink>
      </ul>
    </div>
  )

  const guestLinks = (
    <div className='pull-right bump-top-1 span-7 top-menu'>
      <ul className='nav collapse nav-collapse'>
        <NavLink to='/campaign_tips.html'>Campaign Tips</NavLink>
        <NavLink to='/about.html'>About</NavLink>
        <NavLink to='https://civic.moveon.org/donatec4/creditcard.html?cpn_id=511'>Donate</NavLink>
      </ul>
    </div>
  )

  const userDashboardLink = (
    <a
      className='icon-link-narrow icon-managepetitions'
      href='https://petitions.moveon.org/dashboard.html?source=topnav'
    > {`${user.given_name}’s`} Dashboard</a>
  )

  const guestDashboardLink = (
    <a className='icon-link-narrow icon-managepetitions' href='https://petitions.moveon.org/dashboard.html?source=topnav'>Manage Petitions</a>
  )

  const partnerLogoLinks = cobrand && (
    <a href={cobrand.browser_url}>
      <img className='org_logo' src={cobrand.logo_image_url} alt={`${cobrand.organization} logo`} />
    </a>
  )

  return (
    <div>
      <div className='container' id='header'>
        <div className='row'>
          <div className='moveon-masthead pull-left hidden-phone'>
            <a href='/'>MoveOn.org</a>
          </div>

          <div className='mobile visible-phone'>
            <div className='moveon-masthead pull-left'>
              <a href='/'>MoveOn.org</a>
            </div>
          </div>

          <div className='pull-left top-icons hidden-phone'>
            <div className='pull-left span2 petitions-partner-logo bump-top-1 margin-right-2 hidden-phone'>
              {partnerLogoLinks}
            </div>
            <a className='icon-link-narrow icon-start' href='https://petitions.moveon.org/create_start.html?source=topnav'>Start a petition</a>
            {user.given_name ? userDashboardLink : guestDashboardLink}
          </div>

          <div className='pull-left top-icons visible-phone'>
            <a className='icon-link-narrow icon-start' href='https://petitions.moveon.org/create_start.html?source=topnav-mobile'></a>
            <a className='icon-link-narrow icon-managepetitions' href='https://petitions.moveon.org/dashboard.html'></a>
          </div>

          <a className='btn visible-phone pull-right bump-top-2' data-toggle='collapse' data-target='.nav-collapse'>
            <span className='icon-th-list'></span>
          </a>

          {user.signonId ? userLinks : guestLinks}

        </div>
      </div>
      <div className='container visible-phone'>
        <div className='row pull-left'>
          <div className='pull-left span2 petitions-partner-logo bump-top-1 margin-right-2'>
            {partnerLogoLinks}
          </div>
        </div>
      </div>
    </div>
  )
}

Nav.propTypes = {
  user: PropTypes.object,
  cobrand: PropTypes.object,
  organization: PropTypes.string
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.userStore,
    cobrand: orgCobrand(state, ownProps.organization)
  }
}

export default connect(mapStateToProps)(Nav)
