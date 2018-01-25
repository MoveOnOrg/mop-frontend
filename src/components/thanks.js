import React from 'react'
import PropTypes from 'prop-types'
import { actions as petitionActions } from '../actions/petitionActions'
import { petitionShortCode, md5ToToken } from '../lib'
import ThanksNextPetition from './thanks-next-petition'

class Thanks extends React.Component {
  constructor(props) {
    super(props)
    const { fromSource, petition, signatureMessage, user } = props
    let trackingParams = ''
    if (user && user.signonId) {
      trackingParams = `r_by=${user.signonId}`
    } else if (signatureMessage && signatureMessage.messageMd5) {
      const hashToken = md5ToToken(signatureMessage.messageMd5)
      trackingParams = `r_hash=${hashToken}`
    }
    this.isCreator = false // Maybe test user.id==petition.creator_id or something, if we want to expose that
    let pre = (this.isCreator ? 'c' : 's')
    const { _embedded: { creator } = {} } = petition
    if (fromSource) {
      if (/^(c\.|s\.icn)/.test(fromSource)) {
        pre += '.icn'
      } else if (creator && creator.source // megapartner
                   && (fromSource === 'mo' || /\.imn/.test(fromSource))) {
        pre += '.imn'
      }
    }
    this.trackingParams = trackingParams
    this.state = {
      sharedSocially: false,
      pre
    }
    this.recordShare = this.recordShare.bind(this)
    this.shareLink = this.shareLink.bind(this)
    this.shareEmail = this.shareEmail.bind(this)
    this.openFacebookSharing = this.openFacebookSharing.bind(this)
    this.shareFacebook = this.shareFacebook.bind(this)
    this.shareTwitter = this.shareTwitter.bind(this)
  }

  recordShare(medium, source) {
    petitionActions.recordShareClick(this.props.petition, medium, source, this.props.user)
  }

  shareLink(evt) {
    evt.target.select()
    this.recordShare('email', `${this.state.pre}.ln.cp`)
  }

  shareEmail(evt) {
    evt.target.select()
    this.recordShare('email', `${this.state.pre}.em.cp`)
  }

  openFacebookSharing(urlToShare) {
    const { user } = this.props
    const preChar = ((/\?/.test(urlToShare)) ? '&' : '?')
    let fbUrl = `${urlToShare}${preChar}source=${this.state.pre}.fb`
    if (user.signonId) {
      fbUrl = `${fbUrl}&${this.trackingParams}`
    }
    window.open(`https://www.facebook.com/share.php?u=${encodeURIComponent(fbUrl)}`)
    this.setState({ sharedSocially: true })
  }

  shareFacebook() {
    const { petition } = this.props
    const shareOpts = (petition.share_options && petition.share_options[0]) || {}
    const self = this
    setTimeout(() => {
      self.recordShare('facebook', `${self.state.pre}.fb`)
    }, 100)
    let fbUrl = petition._links.url
    if (shareOpts.facebook_share && shareOpts.facebook_share.share_url) {
      if (shareOpts.facebook_share.sharebandit) { // Non-OSDI feature
        petitionActions.getSharebanditShareLink(
          shareOpts.facebook_share.share_url)
          .then(this.openFacebookSharing)
        // Prematurely exit, since we will block on the promise
        return false
      }
      fbUrl = shareOpts.facebook_share.share_url
    }
    this.openFacebookSharing(fbUrl)
    return false
  }

  shareTwitter() {
    const encodedValue = encodeURIComponent(this.tweetTextArea.value)
    const url = `https://twitter.com/intent/tweet?text=${encodedValue}`
    window.open(url)
    this.recordShare('twitter', `${this.state.pre}.tw`)
    this.setState({ sharedSocially: true })
  }

  generateMailMessage(about, statement, isCreator, shareOpts, fullTarget, petitionLink) {
    if (shareOpts.email_share) {
      return shareOpts.email_share
    }
    const actedOn = (isCreator ? 'created' : 'signed')
    const target = (fullTarget.slice(0, 3).map(t => t.name).join(' and ')
                    + ((fullTarget.length > 3) ? `, and ${fullTarget.length} others` : ''))
    const tooLong = 400 // 1024 for the whole message, so how about 450 for each
    const petitionAbout = (about.length < tooLong ? `\n${about}` : '')
    const petitionStatement = (statement.length < tooLong ? `"${statement}"\n` : '')
    return (`Hi,
${petitionAbout}
${petitionAbout ? '\nThat‘s why ' : ''}I ${actedOn} a petition to ${target}${petitionStatement ? ', which says:\n' : '.'}
${petitionStatement}
Will you sign this petition? Click here:

${petitionLink}

Thanks!
`)
  }

  render() {
    const { petition, signatureMessage, user } = this.props
    const shortLinkArgs = [
      petition.petition_id,
      user && user.signonId,
      signatureMessage && signatureMessage.messageMd5]
    const twitterShareLink = petitionShortCode((this.isCreator ? 'c' : 't'), ...shortLinkArgs)
    const rawShareLink = petitionShortCode((this.isCreator ? 'k' : 'l'), ...shortLinkArgs)
    const shareOpts = (petition.share_options && petition.share_options[0]) || {}
    // Convert description to text
    const textDescription = document.createElement('div')
    textDescription.innerHTML = petition.description
    let tweet
    if (shareOpts.twitter_share && shareOpts.twitter_share.message) {
      tweet = shareOpts.twitter_share.message.replace('[URL]', twitterShareLink)
    } else {
      const suffix = ` ${twitterShareLink} @moveon`
      tweet = `${petition.title.slice(0, 140 - suffix.length)} ${suffix}`
    }

    const mailToMessage = this.generateMailMessage(textDescription.textContent,
                                                   petition.summary,
                                                   this.isCreator,
                                                   shareOpts,
                                                   petition.target,
                                                   `${petition._links.url}?source=${this.state.pre}.em.__TYPE__&${this.trackingParams}`
                                                   )
    const copyPasteMessage = `Subject: ${petition.title}\n\n${mailToMessage.replace('__TYPE__', 'cp')}`
    const mailtoMessage = `mailto:?subject=${encodeURIComponent(petition.title)}&body=${encodeURIComponent(mailToMessage.replace('__TYPE__', 'mt'))}`

    return (<div className='row'>
      {(this.state.sharedSocially ? <ThanksNextPetition entity={petition.entity || ''} /> : null)}
      <div className='span4'>
        <h1 className='size-superxl lh-100 font-lighter'>Thanks!</h1>
      </div>
      <div className='span5 offset1 bump-top-3 font-lighter lh-24'>
        Now that you have {((this.isCreator) ? 'created' : 'signed')},
        <span className='font-heavy moveon-bright-red'> help it grow</span> by asking your friends, family, colleagues to sign.
      </div>
      <div className='clear hidden-phone border-bottom'></div>
      <div className='share-area'>
        <div className='span4 share-social-media padding-top-1 align-center pull-right'>
          <div className='lanky-header'>
            <span className='icon-fb-default'></span>
            Tell your friends on Facebook:
          </div>
          <button
            id='facebook-button'
            className='xl300 background-facebook-blue'
            onClick={this.shareFacebook}
          >Share on Facebook</button>
          <div className='lanky-header bump-top-3 align-center'>
            <span className='icon-twitter-default'></span>
            Tweet your followers:
          </div>
          <button
            id='twitter-button'
            className='xl300 background-moveon-bright-red'
            onClick={this.shareTwitter}
          >Tweet This</button>
          <textarea
            className='hidden' id='tweet_text'
            defaultValue={tweet}
            ref={(input) => { this.tweetTextArea = input }}
            readOnly
          ></textarea>
          <div id='hidden_share_link' className='lanky-header bump-top-3 align-center hidden'>
            Send a link:
            <textarea
              ref={(input) => { this.linkTextarea = input }}
              onClick={this.shareLink}
              id='link_text'
              defaultValue={rawShareLink}
              readOnly
            ></textarea>
          </div>
        </div>
        <div id='hidden_share_link' className='lanky-header bump-top-3 align-center hidden'>
          Send a link:
          <textarea
            ref={(input) => { this.linkTextarea = input }}
            onClick={this.shareLink}
            id='link_text'
            defaultValue={rawShareLink}
            readOnly
          ></textarea>
        </div>
        <div className='span7 padding-top-1'>
          <div className='share-email align-center'>
            <div className='lanky-header align-center'><span className='icon-join-default'></span>Email your friends, family and colleagues:</div>
            <a id='email-button' href={mailtoMessage} className='button xl300 background-moveon-bright-red'>Email your friends</a>
            <div className='disclaimer bump-top-3 hidden-phone'>Or copy and paste the text below into a message:</div>
            <textarea
              ref={(input) => { this.emailTextarea = input }}
              className='hidden-phone' id='email-textarea'
              onClick={this.shareEmail}
              value={copyPasteMessage.replace('__TYPE__', 'cp')}
              readOnly
            ></textarea>
          </div>
        </div>
      </div>
    </div>)
  }
}

Thanks.propTypes = {
  petition: PropTypes.object,
  user: PropTypes.object,
  signatureMessage: PropTypes.object,
  fromSource: PropTypes.string
}

export default Thanks
