import React from 'react'
import PropTypes from 'prop-types'

import { withFacebook } from '../../containers/hoc-facebook'
import FacebookSvg from 'GiraffeUI/svgs/facebook.svg'
import { addBrandedColorClass } from '../../lib'

const FacebookButton = ({ onClick, cohort }) => (
  <a className={`petition-thanks__cta ${addBrandedColorClass('facebook', cohort)}`} onClick={onClick}>
    <FacebookSvg />
    Share on Facebook
  </a>
)

FacebookButton.propTypes = {
  onClick: PropTypes.func,
  cohort: PropTypes.bool
}

export default withFacebook(FacebookButton)
