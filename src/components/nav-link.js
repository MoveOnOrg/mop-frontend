import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'

const NavLink = ({ to, children }) => (
  <li><Link className='lh-14 navlink' to={to}>{children}</Link></li>
)

NavLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
}

export default NavLink
