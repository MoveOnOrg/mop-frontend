import React from 'react'
import PropTypes from 'prop-types'

import { withWhatsApp } from '../../containers/hoc-whatsapp'
import WhatsAppSvg from 'GiraffeUI/svgs/whatsapp.svg'

const WhatsAppLink = ({ onClick }) => (
  <a className='mo-btn petition-thanks__link d-none d-lg-inline-flex' onClick={onClick}>
    <WhatsAppSvg />
    WhatsApp
  </a>
)

WhatsAppLink.propTypes = {
  onClick: PropTypes.func
}

export default withWhatsApp(WhatsAppLink)
