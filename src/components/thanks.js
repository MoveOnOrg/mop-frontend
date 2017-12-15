import React from 'react'
import PropTypes from 'prop-types'
import { actions as petitionActions } from '../actions/petitionActions'
import ThanksNextPetition from './thanks-next-petition'

class Thanks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pre: 's', // TODO
      sharedSocially: false
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
      fbUrl = `${fbUrl}&r_by=${user.signonId}`
    } // TODO: signatureMessages hash alternative
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
      if (shareOpts.facebook_share.sharebandit) { // non-OSDI feature
        petitionActions.getSharebanditShareLink(
          shareOpts.facebook_share.share_url)
          .then(this.openFacebookSharing)
        // prematurely exit, since we will block on the promise
        return false
      }
      fbUrl = shareOpts.facebook_share.share_url
    }
    this.openFacebookSharing(fbUrl)
    return false
  }

  shareTwitter() {
    const encodedValue = encodeURIComponent(this.tweetTextArea.value)
    const url = `http://twitter.com/intent/tweet?text=${encodedValue}`
    window.open(url)
    this.recordShare('twitter', `${this.state.pre}.tw`)
    this.setState({ sharedSocially: true })
  }

  render() {
    const { petition, user } = this.props
    const creator = false // maybe test user.id==petition.creator_id or something, if we want to expose that
    const pre = (creator ? 'c' : 's') // TODO: based on ?from_source= parameter .icn and .imn, megapartner
    const actedOn = (creator ? 'created' : 'signed')
    const userId = user.signonId || '123' // TODO
    const link = petition._links.url // TODO: ref_by_id, shortening, etc
    const target = (petition.target.slice(0, 3).map(t => t.name).join(' and ')
                    + ((petition.target.length > 3) ? ' and others' : ''))
    const shareOpts = (petition.share_options && petition.share_options[0]) || {}
    // convert description to text
    const textDescription = document.createElement('div')
    textDescription.innerHTML = petition.description
    let tweet
    if (shareOpts.twitter_share && shareOpts.twitter_share.message) {
      tweet = shareOpts.twitter_share.message.replace('[URL]', link)
    } else {
      const suffix = ` ${link} @moveon`
      tweet = `${petition.title.slice(0, 140 - suffix.length)} ${suffix}`
    }

    // TODO: previous code for mailToMessage tries a bunch of permutations if this is >1024 characters.
    // We could possibly implement this by making any of these versions server-side
    const mailToMessage = (shareOpts.email_share || `Hi,

${textDescription.textContent}

That's why I ${actedOn} a petition to ${target}, which says:

"${petition.summary}"

Will you sign this petition? Click here:

${link}?source=${pre}.em.__TYPE__&r_by=${userId}

Thanks!
`)
    const copyPasteMessage = `Subject: ${petition.summary}\n\n${mailToMessage}`

    return (<div className='row'>
      {(this.state.sharedSocially ? <ThanksNextPetition entity={petition.entity || ''} /> : null)}
      <div className='span4'>
        <h1 className='size-superxl lh-100 font-lighter'>Thanks!</h1>
      </div>
      <div className='span5 offset1 bump-top-3 font-lighter lh-24'>
        Now that you have {((creator) ? 'created' : 'signed')},
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
          ></textarea>
          <div className='lanky-header bump-top-3 align-center'>
            Send a link:
          </div>
          <textarea
            ref={(input) => { this.linkTextarea = input }}
            onClick={this.shareLink}
            id='link_text' defaultValue={link}
          ></textarea>
        </div>
        <div className='span7 padding-top-1'>
          <div className='share-email align-center'>
            <div className='lanky-header align-center'><span className='icon-join-default'></span>Email your friends, family and colleagues:</div>
            <a id='email-button' href='mailto:?subject={encodeURIComponent(petition.summary)}&body={encodeURIComponent(mailToMessage.replace("__TYPE__","mt")}' className='button xl300 background-moveon-bright-red'>Email your friends</a>
            <div className='disclaimer bump-top-3 hidden-phone'>Or copy and paste the text below into a message:</div>
            <textarea
              ref={(input) => { this.emailTextarea = input }}
              className='hidden-phone' id='email-textarea'
              onClick={this.shareEmail}
              value={copyPasteMessage.replace('__TYPE__', 'cp')}
            ></textarea>
          </div>
        </div>
      </div>
    </div>)
  }
}

Thanks.propTypes = {
  petition: PropTypes.object,
  user: PropTypes.object
}

export default Thanks
