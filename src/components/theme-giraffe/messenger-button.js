import React from 'react'
import PropTypes from 'prop-types'

import { withMessenger } from '../../containers/hoc-messenger'
import MessengerSvg from 'GiraffeUI/svgs/messenger.svg'
import { addBrandedColorClass } from '../../lib'

const MessengerButton = ({ onClick, cohort }) => (
  <a className={`petition-thanks__cta d-lg-none ${addBrandedColorClass('messenger', cohort)}`} onClick={onClick}>
    <MessengerSvg />
    Share on Messenger
  </a>
)

MessengerButton.propTypes = {
  onClick: PropTypes.func,
  cohort: PropTypes.bool
}

export default withMessenger(MessengerButton)
