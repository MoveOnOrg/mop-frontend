import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { loadTopPetitions } from '../actions/petitionActions'
import { appLocation } from '../routes.js'

/* A nice description of how/when this works from the Platform Team:
   You have to click on a share link and have that open in another tab.
   A countdown begins only once you click back into the thanks page tab.
   It tells you it's going to redirect in x seconds and gives you a link to cancel.
   If you click the link to cancel, then you stay on the page.
   If not, you go to the new petition, with the source code share_chain.
   If you click on another share link, the process will repeat.
*/

class ThanksNextPetition extends React.Component {
  constructor(props) {
    super(props)
    this.startSeconds = 10
    this.state = {
      cancelled: false,
      secondsLeft: this.startSeconds + 1,
      intervalListener: null
    }
    this.startCountdown = this.startCountdown.bind(this)
    this.tickCounter = this.tickCounter.bind(this)
  }

  componentWillMount() {
    if (!this.props.nextPetitionsLoaded) {
      this.props.dispatch(loadTopPetitions(this.props.entity === 'pac'))
    }
    // start countdown on refocusing to this window
    window.addEventListener('focus', this.startCountdown)
  }

  startCountdown() {
    window.removeEventListener('focus', this.startCountdown)
    // guard against running twice -- countdown should be a singleton
    if (this.props.nextPetition && this.state.secondsLeft > this.startSeconds) {
      if (this.state.intervalListener) {
        clearInterval(this.state.intervalListener)
      }
      this.setState({ intervalListener: setInterval(this.tickCounter, 1000) })
    }
  }

  tickCounter() {
    if (this.state.cancelled) {
      if (this.state.intervalListener) {
        clearInterval(this.state.intervalListener)
        this.setState({
          intervalListener: null,
          secondsLeft: this.startSeconds + 1 })
      }
      return
    }
    const newSecondsLeft = this.state.secondsLeft - 1
    this.setState({ secondsLeft: newSecondsLeft })
    if (newSecondsLeft <= 0) {
      this.redirectToNext()
    }
    return
  }

  nextUrl() {
    const { nextPetition } = this.props
    return ((nextPetition)
            ? `/sign/${nextPetition.name}?source=share_chain`
            : '')
  }

  redirectToNext() {
    if (this.state.intervalListener) {
      clearInterval(this.state.intervalListener)
      this.setState({ intervalListener: null })
    }
    const nextUrl = this.nextUrl()
    if (nextUrl) {
      appLocation.push(nextUrl)
    }
  }

  render() {
    if (!this.props.nextPetition || this.state.cancelled) {
      return null
    }
    return (
      <div className='message-header advancing_message'>
        We&#39;ve found another petition which may interest you. We&#39;ll forward you there in <span className='countdown_clock'>
        {this.state.secondsLeft}
        </span> seconds. [ <a onClick={() => this.setState({ cancelled: true })} className='control_advance_cancel'>cancel</a> ]
      </div>
    )
  }
}

ThanksNextPetition.propTypes = {
  dispatch: PropTypes.func,
  nextPetition: PropTypes.object,
  nextPetitionsLoaded: PropTypes.bool,
  entity: PropTypes.string
}

function mapStateToProps(store) {
  const { nextPetitionsLoaded, nextPetitions, petitions } = store.petitionStore
  let nextPetition = null
  if (nextPetitions && nextPetitions.length && nextPetitions[0]) {
    nextPetition = petitions[nextPetitions[0]]
  }
  return { nextPetition, nextPetitionsLoaded }
}

export default connect(mapStateToProps)(ThanksNextPetition)
