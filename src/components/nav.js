import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import NavLink from './nav-link'

const Nav = ({ user, nav, organization, minimal }) => {
  const cobrand = ((organization) ? nav.orgs[organization] : nav.partnerCobrand)

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
    <Link className='icon-link-narrow icon-managepetitions' to='/dashboard.html?source=topnav'> {`${user.given_name}’s`} Dashboard</Link>
  )

  const guestDashboardLink = (
    <Link className='icon-link-narrow icon-managepetitions' to='/dashboard.html?source=topnav'>Manage Petitions</Link>
  )

  const partnerLogoLinks = (
    (cobrand)
      ? (<Link to={cobrand.browser_url}><img className='org_logo' src={cobrand.logo_image_url} alt={`${cobrand.organization} logo`} /></Link>
        ) : null)

  return (
    <div>
      <div className='container' id='header'>
        <div className='row'>
          <div className='moveon-masthead pull-left hidden-phone'>
            <Link to='/'>MoveOn.org</Link>
          </div>

          <div className='mobile visible-phone'>
            <div className='moveon-masthead pull-left'>
              <Link to='/'>MoveOn.org</Link>
            </div>
          </div>
          {!minimal
            ? ( // when not minimal, we have a bunch of links for you!
            <div>
              <div className='pull-left top-icons hidden-phone'>
                <div className='pull-left span2 petitions-partner-logo bump-top-1 margin-right-2 hidden-phone'>
                 {partnerLogoLinks}
                </div>
                <Link className='icon-link-narrow icon-start' to='/create_start.html?source=topnav'>Start a petition</Link>
                {user.given_name ? userDashboardLink : guestDashboardLink}
              </div>

              <div className='pull-left top-icons visible-phone'>
                <Link className='icon-link-narrow icon-start' to='/create_start.html?source=topnav-mobile' />
                <Link className='icon-link-narrow icon-managepetitions' to='/dashboard.html' />
              </div>

              <a className='btn visible-phone pull-right bump-top-2' data-toggle='collapse' data-target='.nav-collapse'>
                <span className='icon-th-list'></span>
              </a>

              {user.signonId ? userLinks : guestLinks}
            </div>
            ) : null}
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
  nav: PropTypes.object,
  organization: PropTypes.string,
  minimal: PropTypes.bool
}

function mapStateToProps(store) {
  return {
    user: store.userStore,
    nav: store.navStore
  }
}

export default connect(mapStateToProps)(Nav)
