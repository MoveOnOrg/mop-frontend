import React from 'react'
import PropTypes from 'prop-types'
import { petitionShortCode } from '../lib'
import Config from '../config'


function getMobileMessengerLink(encodedValue) {
  // testing messenger link on mobile only first
 return `fb-messenger://share?link=${encodedValue}&app_id=${encodeURIComponent(Config.MESSENGER_APP_ID)}`
}

export function withMessenger(WrappedComponent) {
  class Messenger extends React.Component {
    constructor(props) {
      super(props)
      this.getShareLink = this.getShareLink.bind(this)
      this.shareMessenger = this.shareMessenger.bind(this)
    }

    getShareLink() {
      const { shortLinkMode, shortLinkArgs } = this.props
      const messengerShareLink = petitionShortCode(
        shortLinkMode,
        ...shortLinkArgs
      )
      return messengerShareLink
    }

    shareMessenger() {
      /* open this window in case user does not have messenger installed */
      // takes them to moveon page but doesnt include info on petition
      const encodedValue = encodeURIComponent(this.getShareLink())
      const shareLink = getMobileMessengerLink(encodedValue)
      window.open(shareLink)
      setTimeout(() => { window.open('https://m.me/moveon') }, 3000)
      const { recordShare, afterShare } = this.props
      if (recordShare) recordShare()
      if (afterShare) afterShare()
    }

    render() {
      /* eslint-disable no-unused-vars */
      // remove props we don't want to pass through
      const {
        petition,
        shortLinkMode,
        shortLinkArgs,
        recordShare,
        // (just to remove from otherProps)
        ...otherProps
      } = this.props
      /* eslint-enable */
      return <WrappedComponent {...otherProps} onClick={this.shareMessenger} />
    }
  }
  Messenger.propTypes = {
    petition: PropTypes.object,
    shortLinkArgs: PropTypes.array,
    shortLinkMode: PropTypes.string,
    recordShare: PropTypes.func,
    afterShare: PropTypes.func
  }
  return Messenger
}
