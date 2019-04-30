import React from 'react'
import PropTypes from 'prop-types'

import ThanksNextPetition from '../../containers/thanks-next-petition'

const Thanks = ({
  sharedSocially,
  isCreator,
  renderRawLink,
  renderTwitter,
  renderWhatsAppLink,
  renderWhatsAppButton,
  renderFacebook,
  renderMessenger,
  renderMail,
  renderCopyPaste,
  nextPetition
}) => (
  <div className='row my-4 my-lg-5 mx-1 justify-content-center'>
    {sharedSocially && !isCreator && <ThanksNextPetition nextPetition={nextPetition} />}
    <div className='col-10 col-md-7 petition-thanks__container'>
      <div className='petition-thanks__heading mt-lg-4'>ONE MORE STEP…</div>
      <div className='petition-thanks__content'>
        <p>
          Thank you for {isCreator ? 'creating your petition' : 'signing'}! Now help this petition grow by asking your
          friends, family, and colleagues to sign.
        </p>
        <p>
          <strong>Share</strong>
        </p>

        <div className='petition-thanks__cta-group'>
          {renderMail()}
          {renderFacebook()}
          {renderMessenger()}
          {renderWhatsAppButton()}
        </div>

        <p>Or copy and paste the text below into a message:</p>

        {renderCopyPaste()}

        <div className='petition-thanks__links'>
          {renderTwitter()}
          {renderWhatsAppLink()}
          {renderRawLink()}
        </div>
      </div>
    </div>
  </div>
)

Thanks.propTypes = {
  sharedSocially: PropTypes.bool,
  isCreator: PropTypes.bool,
  renderTwitter: PropTypes.func,
  renderFacebook: PropTypes.func,
  renderWhatsAppButton: PropTypes.func,
  renderWhatsAppLink: PropTypes.func,
  renderMail: PropTypes.func,
  renderCopyPaste: PropTypes.func,
  renderRawLink: PropTypes.func,
  renderMessenger: PropTypes.func,
  nextPetition: PropTypes.object
}

export default Thanks
