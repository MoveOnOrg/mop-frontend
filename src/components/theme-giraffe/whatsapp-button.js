import React from 'react'
import PropTypes from 'prop-types'

import { withWhatsApp } from '../../containers/hoc-whatsapp'
import WhatsAppWhiteSvg from 'GiraffeUI/svgs/whatsappwhite.svg'

const WhatsAppButton = ({ onClick }) => (
  <a className='petition-thanks__cta d-lg-none' onClick={onClick}>
    <WhatsAppWhiteSvg />
    Share on WhatsApp
  </a>
)

WhatsAppButton.propTypes = {
  onClick: PropTypes.func
}

export default withWhatsApp(WhatsAppButton)
