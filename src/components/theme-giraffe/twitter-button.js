import React from 'react'
import PropTypes from 'prop-types'

import { withTwitter } from '../../containers/hoc-twitter'
import TwitterSvg from 'GiraffeUI/svgs/twitter.svg'
import { addBrandedColorClass } from '../../lib'

const TwitterButton = ({ onClick, cohort }) => (
  <a className={`mo-btn petition-thanks__link ${addBrandedColorClass('twitter', cohort)}`} onClick={onClick}>
    <TwitterSvg />
    Twitter
  </a>
)

TwitterButton.propTypes = {
  onClick: PropTypes.func,
  cohort: PropTypes.bool
}

export default withTwitter(TwitterButton)
