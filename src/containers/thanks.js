import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { actions as petitionActions } from '../actions/petitionActions'
import { md5ToToken, stringifyParams, CohortTracker } from '../lib'
import Config from '../config'

import ThanksComponent from 'Theme/thanks'
import TwitterButton from 'Theme/twitter-button'
import FacebookButton from 'Theme/facebook-button'
import WhatsAppButton from 'GiraffeTheme/whatsapp-button'
import WhatsAppLink from 'GiraffeTheme/whatsapp-link'
import MailButton from 'Theme/mail-button'
import CopyPaste from 'Theme/copy-paste'
import RawLink from 'Theme/raw-link'
import Finished from 'GiraffeTheme/create-petition/finished'

function getPre(fromSource, petition, isCreator) {
  let pre = (isCreator ? 'c' : 's')
  const { _embedded: { creator } = {} } = petition
  if (fromSource) {
    if (/^(c\.|s\.icn)/.test(fromSource)) {
      pre += '.icn'
    } else if (creator && creator.source // megapartner
                 && (fromSource === 'mo' || /\.imn/.test(fromSource))) {
      pre += '.imn'
    }
  }
  return pre
}

function getTrackingParams(signatureMessage, user) {
  const trackingParams = {}
  if (user && user.signonId) {
    trackingParams.r_by = user.signonId
  } else if (signatureMessage && signatureMessage.messageMd5) {
    trackingParams.r_hash = md5ToToken(signatureMessage.messageMd5)
  }
  return trackingParams
}

class Thanks extends React.Component {
  constructor(props) {
    super(props)
    const { petition, fromSource, signatureMessage, user } = props
    this.trackingParams = getTrackingParams(signatureMessage, user)
    this.trackingParamsString = stringifyParams(this.trackingParams)

    this.shortLinkArgs = [
      petition.petition_id,
      user && user.signonId,
      signatureMessage && signatureMessage.messageMd5]

    this.state = {
      sharedSocially: false,
      pre: getPre(fromSource, petition, this.props.isCreator)
    }

    this.recordShare = this.recordShare.bind(this)
    this.renderTwitter = this.renderTwitter.bind(this)
    this.renderFacebook = this.renderFacebook.bind(this)
    this.renderMail = this.renderMail.bind(this)
    this.renderCopyPaste = this.renderCopyPaste.bind(this)
    this.renderRawLink = this.renderRawLink.bind(this)
    this.renderWhatsAppLink = this.renderWhatsAppLink.bind(this)
    this.renderWhatsAppButton = this.renderWhatsAppButton.bind(this)
    this.cohortTracker = new CohortTracker({
      experiment: 'none',
      variationname: 'current',
      userinfo: this.trackingParams // sending the user signon id or sig hash to identify them
    })
  }

  componentDidMount() {
    if (!this.props.nextPetitionsLoaded && !this.props.isCreator) {
      this.props.dispatch(petitionActions.loadTopPetitions(this.props.petition.entity === 'pac' ? 1 : 0, '', false))
    }
  }

  recordShare(medium, source) {
    return () =>
      petitionActions.recordShareClick(
        this.props.petition,
        this.trackingParams,
        medium,
        source,
        this.props.user
      )
  }
  /*
  Explanation for values passed in shortLinkMode:
  If it is the creator, we send in an arbitrary letter to denote if the user is a creator AND share medium
  for example sending in a `v` will be read in the back end as `whatsapp_creator`
  `w` will be read as `whatsapp_signer` - This will append 'wa' as the source to the share link
  short code modes are determined here: `/mop/petitions/petition_shortcode.py`
  */
  renderWhatsAppButton() {
    return (
      <WhatsAppButton
        petition={this.props.petition}
        shortLinkMode={this.props.isCreator ? 'v' : 'w'}
        shortLinkArgs={this.shortLinkArgs}
        recordShare={this.recordShare('whatsapp', `${this.state.pre}.wa`)}
        afterShare={() => this.setState({ sharedSocially: true })}
      />
    )
  }

  renderWhatsAppLink() {
    return (
      <WhatsAppLink
        petition={this.props.petition}
        shortLinkMode={this.props.isCreator ? 'v' : 'w'}
        shortLinkArgs={this.shortLinkArgs}
        recordShare={this.recordShare('whatsapp', `${this.state.pre}.wa`)}
        afterShare={() => this.setState({ sharedSocially: true })}
      />
    )
  }

  renderTwitter() {
    return (
      <TwitterButton
        petition={this.props.petition}
        shortLinkMode={this.props.isCreator ? 'c' : 't'}
        shortLinkArgs={this.shortLinkArgs}
        recordShare={this.recordShare('twitter', `${this.state.pre}.tw`)}
        afterShare={() => this.setState({ sharedSocially: true })}
      />
    )
  }

  renderFacebook() {
    return (
      <FacebookButton
        petition={this.props.petition}
        prefix={this.state.pre}
        trackingParams={this.trackingParamsString}
        recordShare={this.recordShare('facebook', `${this.state.pre}.fb`)}
        afterShare={() => this.setState({ sharedSocially: true })}
      />
    )
  }

  renderMail() {
    return (
      <MailButton
        isCreator={this.props.isCreator}
        petition={this.props.petition}
        prefix={this.state.pre}
        trackingParams={this.trackingParamsString}
        recordShare={this.recordShare('email', `${this.state.pre}.em.mt`)}
      />
    )
  }

  renderCopyPaste() {
    return (
      <CopyPaste
        isCreator={this.props.isCreator}
        petition={this.props.petition}
        prefix={this.state.pre}
        trackingParams={this.trackingParamsString}
        recordShare={this.recordShare('email', `${this.state.pre}.em.cp`)}
      />
    )
  }

  renderRawLink() {
    // Only used for theme-giraffe
    return (
      <RawLink
        shortLinkMode={this.props.isCreator ? 'k' : 'l'}
        shortLinkArgs={this.shortLinkArgs}
        recordShare={this.recordShare('rawlink', `${this.state.pre}.lnk`)}
      />
    )
  }

  render() {
    if (this.props.isCreator && Config.THEME === 'giraffe') {
      return (
        <Finished
          renderTwitter={this.renderTwitter}
          renderFacebook={this.renderFacebook}
          renderMail={this.renderMail}
          renderCopyPaste={this.renderCopyPaste}
          renderRawLink={this.renderRawLink}
        />
      )
    }
    return (
      <ThanksComponent
        sharedSocially={this.state.sharedSocially}
        isCreator={this.props.isCreator}
        renderTwitter={this.renderTwitter}
        renderWhatsAppLink={this.renderWhatsAppLink}
        renderWhatsAppButton={this.renderWhatsAppButton}
        renderFacebook={this.renderFacebook}
        renderMail={this.renderMail}
        renderCopyPaste={this.renderCopyPaste}
        renderRawLink={this.renderRawLink}
        nextPetition={this.props.nextPetition}
      />
    )
  }
}

Thanks.propTypes = {
  petition: PropTypes.object,
  isCreator: PropTypes.bool,
  user: PropTypes.object,
  signatureMessage: PropTypes.object,
  fromSource: PropTypes.string,
  nextPetitionsLoaded: PropTypes.bool,
  nextPetition: PropTypes.object,
  dispatch: PropTypes.func
}

Thanks.defaultProps = {
  isCreator: false
}

function mapStateToProps(store) {
  const { nextPetitionsLoaded, nextPetitions, petitions } = store.petitionStore
  let nextPetition = null
  if (nextPetitions && nextPetitions.length && nextPetitions[0]) {
    nextPetition = petitions[nextPetitions[0]]
  }
  return { nextPetition, nextPetitionsLoaded, user: store.userStore }
}

export default connect(mapStateToProps)(Thanks)
