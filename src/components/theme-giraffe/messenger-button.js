import React from 'react'
import PropTypes from 'prop-types'

import { withMessenger } from '../../containers/hoc-messenger'
import MessengerSvg from 'GiraffeUI/svgs/messenger.svg'

const MessengerButton = ({ onClick }) => (
  <a className='petition-thanks__cta d-lg-none' onClick={onClick}>
    <MessengerSvg />
    Share on Messenger
  </a>
)

MessengerButton.propTypes = {
  onClick: PropTypes.func
}

export default withMessenger(MessengerButton)
