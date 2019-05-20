import React from 'react'
import PropTypes from 'prop-types'

import { withWhatsApp } from '../../containers/hoc-whatsapp'
import WhatsAppWhiteSvg from 'GiraffeUI/svgs/whatsappwhite.svg'
import { addBrandedColorClass } from '../../lib'

const WhatsAppButton = ({ onClick, cohort }) => (
  <a className={`petition-thanks__cta d-lg-none ${addBrandedColorClass('whatsapp', cohort)}`} onClick={onClick}>
    <WhatsAppWhiteSvg />
    Share on WhatsApp
  </a>
)

WhatsAppButton.propTypes = {
  onClick: PropTypes.func,
  cohort: PropTypes.bool
}

export default withWhatsApp(WhatsAppButton)
