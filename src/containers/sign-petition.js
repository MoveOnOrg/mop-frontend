import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Petition from 'Theme/petition'
import { LoadableThanks } from '../loaders/'
import { actions as petitionActions } from '../actions/petitionActions.js'
import { appLocation } from '../routes.js'

class SignPetition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deviceSize: null,
      floatingSignVisible: false,
      signFormWasVisible: false
    }
    this.setRef = this.setRef.bind(this)
    this.focusSign = this.focusSign.bind(this)
    this.getAdminLink = this.getAdminLink.bind(this)
    this.getScrollToSignFormProps = this.getScrollToSignFormProps.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentWillMount() {
    const { dispatch, params, petition } = this.props
    dispatch(petitionActions.loadPetition(params.petition_slug.split('.')[0]))
    if (petition) {
      this.checkOrgPathMatches(petition, params.organization)
    }
  }

  componentDidMount() {
    // Lazy-load thanks page component
    LoadableThanks.preload()
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)

    setTimeout(() => {
      // React-waypoint will set signFormWasVisible if the sign-form is above the fold
      if (!this.state.signFormWasVisible) {
        this.setState({ floatingSignVisible: true })
      }
    }, 200)
  }

  componentWillReceiveProps(nextProps) {
    const { params, petition } = nextProps
    if (petition) {
      this.checkOrgPathMatches(petition, params.organization)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  getScrollToSignFormProps() {
    const f = this.state.deviceSize
    const offset = f === 'mobile' ? -65 : -150
    return {
      to: `${f}-sign`,
      animate: { offset },
      afterAnimate: this.focusSign
    }
  }

  getAdminLink() {
    const { user, petition } = this.props
    if (!user || !user.custom_fields || !user.custom_fields.admin) return false

    return `${user.custom_fields.admin_petition_baseurl}?petition_id=${
      petition.petition_id
    }`
  }

  setRef({ isMobile }) {
    const formName = isMobile ? 'mobile' : 'desktop'
    return input => input && (this[`${formName}-${input.name}Input`] = input)
  }

  focusSign() {
    const f = this.state.deviceSize
    // Forms are hidden per petition settings or user state, so we find the first rendered
    const name = this[`${f}-nameInput`]
    const address = this[`${f}-address1Input`]
    const comment = this[`${f}-commentInput`]

    const firstInput =
      (document.body.contains(name) && name) ||
      (document.body.contains(address) && address) ||
      (document.body.contains(comment) && comment) ||
      null

    if (firstInput) firstInput.focus()
  }

  updateWindowDimensions() {
    this.setState({
      deviceSize: window.innerWidth < 768 ? 'mobile' : 'desktop'
    })
  }

  checkOrgPathMatches(petition, orgPath) {
    const { creator } = petition._embedded
    // Petition has org that doesn't match URL
    if (creator.source && creator.source !== orgPath) {
      appLocation.push(`/${creator.source}/sign/${petition.name}`)
      return false
    }
    // URL has org that doesn't match petition
    if (orgPath && orgPath !== creator.source) {
      appLocation.push(`/sign/${petition.name}`)
      return false
    }
    return true
  }

  render() {
    const p = this.props.petition
    if (!p) {
      return <div />
    }
    const creator = (p._embedded && p._embedded.creator) || {
      name: p.contact_name
    }
    const petitionBy = creator.name || p.contact_name
    const outOfDate =
      p.tags && p.tags.filter(t => t.name === 'possibly_out_of_date').length

    return (
      <div className='moveon-petitions sign container'>
        <Petition
          petition={this.props.petition}
          user={this.props.user}
          adminLink={this.getAdminLink()}
          query={this.props.location.query}
          petitionBy={petitionBy}
          outOfDate={outOfDate}
          isFloatingSignVisible={this.state.floatingSignVisible}
          scrollToSignFormProps={this.getScrollToSignFormProps}
          hideFloatingSign={() =>
            this.setState({
              signFormWasVisible: true,
              floatingSignVisible: false
            })
          }
          showFloatingSign={() => this.setState({ floatingSignVisible: true })}
          setRef={this.setRef}
        />
      </div>
    )
  }
}

SignPetition.propTypes = {
  petition: PropTypes.object,
  user: PropTypes.object,
  params: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps(store, ownProps) {
  const petition =
    store.petitionStore.petitions[ownProps.params.petition_slug.split('.')[0]]
  return {
    petition,
    sign_success:
      petition && store.petitionStore.signatureStatus[petition.petition_id],
    user: store.userStore
  }
}

export default connect(mapStateToProps)(SignPetition)
