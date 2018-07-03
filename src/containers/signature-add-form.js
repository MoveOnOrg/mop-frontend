import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SignatureAddFormComponent from 'Theme/signature-add-form'

import { signPetition, devLocalSignPetition } from '../actions/petitionActions'
import { actions as sessionActions } from '../actions/sessionActions'
import { isValidEmail, FormTracker, smsSignUp } from '../lib'
import Config from '../config'

class SignatureAddForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: false,
      email: false,
      country: 'United States',
      address1: false,
      address2: false,
      city: false,
      state: false,
      region: false,
      zip: false,
      postal: false,
      comment: false,
      volunteer: false,
      phone: false,
      validationTried: false,
      mobile_optin: false,
      thirdparty_optin: props.hiddenOptin || props.showOptinCheckbox,
      hidden_optin: props.hiddenOptin,
      required: {},
      hideUntilInteract: true
    }
    this.validationFunction = {
      email: isValidEmail,
      name: name => !isValidEmail(name), // See https://github.com/MoveOnOrg/mop-frontend/issues/560
      zip: zip => /(\d\D*){5}/.test(zip),
      phone: phone => /(\d\D*){10}/.test(phone) // 10-digits
    }

    this.volunteer = this.volunteer.bind(this)
    this.submit = this.submit.bind(this)
    this.validationError = this.validationError.bind(this)
    this.updateStateFromValue = this.updateStateFromValue.bind(this)
    this.formTracker = new FormTracker({
      experiment: (props.query.cohort ? 'signMobilePhones1' : 'current'),
      formvariant: props.id,
      variationname: (props.query.cohort === '1' ? 'smsSubScribeOption1' : 'current')
    })
  }

  componentDidMount() {
    const ref = this.form
    if (ref && this.formTracker.isVisible(ref)) this.formTracker.setForm(ref, ref.id)
  }

  componentDidUpdate(prevProps, prevState) {
    const ref = this.form

    if (ref && this.formTracker.isVisible(ref)) {
      if (!this.state.hideUntilInteract) this.formTracker.setForm(ref, ref.id)
      if ((!prevState.phone && this.state.phone) || (!prevState.name && this.state.name) || (!prevState.volunteer && this.state.volunteer)) {
        this.formTracker.formExpandTracker()
      }
    }
  }

  getOsdiSignature() {
    const { petition, query, showOptinCheckbox, user } = this.props
    const osdiSignature = {
      petition: {
        name: petition.name,
        petition_id: petition.petition_id,
        show_optin: showOptinCheckbox,
        _links: petition._links
      },
      person: {
        full_name: this.state.name,
        email_addresses: [],
        postal_addresses: []
      }
    }
    if (this.state.comment) {
      osdiSignature.comments = this.state.comment
    }
    if (this.state.name) {
      osdiSignature.person.full_name = this.state.name
    } else if (user.given_name) {
      osdiSignature.person.given_name = user.given_name
    }
    if (this.state.email) {
      osdiSignature.person.email_addresses.push({
        address: this.state.email
      })
    }
    if (user.token) {
      osdiSignature.person.identifiers = [user.token]
    }
    if (this.state.phone) {
      osdiSignature.person.phone_numbers = [this.state.phone]
    }
    if (this.state.city) {
      osdiSignature.person.postal_addresses.push({
        locality: this.state.city,
        region: ((this.state.country === 'United States') ? this.state.state : this.state.region),
        postal_code: ((this.state.country === 'United States') ? this.state.zip : this.state.postal),
        country_name: this.state.country
      })
    }
    if (this.state.address1) {
      const lines = [this.state.address1]
      if (this.state.address2) {
        lines.push(this.state.address2)
      }
      osdiSignature.person.postal_addresses[0].address_lines = lines
    }
    const referrerKeys = [
      'source', 'r_by', 'fb_test', 'abid', 'abver', 'test_group', 'no_mo', 'mailing_id', 'r_hash']
    const referrerData = referrerKeys.filter(k => query[k]).map(k => ({ [k]: query[k] }))
    if (referrerData.length) {
      osdiSignature.referrer_data = Object.assign({}, ...referrerData)
    }
    const customFields = ['thirdparty_optin', 'hidden_optin', 'volunteer', 'mobile_optin']
    const customData = customFields.filter(k => this.state[k]).map(k => ({ [k]: this.state[k] }))
    if (customData.length) {
      osdiSignature.person.custom_fields = Object.assign({}, ...customData)
    }
    // Console.log('signature!', osdiSignature)
    return osdiSignature
  }

  validationError(key) {
    if (this.state.validationTried) {
      if (Object.keys(this.state.required).indexOf(key) > -1) {
        const func = this.validationFunction[key]
        if (!this.state[key] || (func && !func(String(this.state[key])))) {
          return (
            <div className='alert alert-danger red' role='alert'>{this.state.required[key]}</div>
          )
        }
      }
    }
    return null
  }

  formIsValid() {
    this.setState({ validationTried: true })
    this.updateRequiredFields(true)
    return Object.keys(this.state.required).map(
      key => !!(this.state[key]
                && (!this.validationFunction[key]
                    || this.validationFunction[key](String(this.state[key]))))
    ).reduce((a, b) => a && b, true)
  }

  updateStateFromValue(field, isCheckbox = false) {
    return event => {
      const value = isCheckbox ? event.target.checked : event.target.value
      if (this.state[field] !== value) {
        this.formTracker.updateFormProgress({
          fieldchanged: field,
          fieldfocused: field,
          userInfo: this.props.user
        })
      }
      this.setState({
        [field]: value,
        hideUntilInteract: false // show some hidden fields if they are hidden
      })
    }
  }

  volunteer(event) {
    const vol = event.target.checked
    const req = this.updateRequiredFields(false)
    if (vol) {
      req.phone = 'We need a phone number to coordinate volunteers.'
    } else {
      delete req.phone
    }
    if (!this.state.volunteer) this.formTracker.formExpandTracker()
    this.setState({ volunteer: vol,
      required: req })
  }

  updateRequiredFields(doUpdate) {
    // This is a separate method because it can change when state or props are changed
    const { user, requireAddressFields } = this.props
    const required = this.state.required
    let changeRequiredFields = false
    if (!user.signonId) {
      Object.assign(required, {
        name: 'Name is required.',
        email: 'Email address is required.',
        state: 'State is required.',
        zip: 'Zip code is required.'
      })
      changeRequiredFields = true
    } else {
      delete required.name
      delete required.email
      delete required.state
      delete required.zip
    }
    if (requireAddressFields) {
      Object.assign(required, {
        address1: 'Full address is required.',
        city: 'City is required.',
        state: 'State is required.',
        zip: 'Zip code is required.'
      })
      changeRequiredFields = true
    } else {
      delete required.address1
      delete required.city
      delete required.state
    }
    if (this.state.country !== 'United States') {
      delete required.state
      delete required.zip
    }
    if (changeRequiredFields && doUpdate) {
      this.setState({ required })
    }
    return required
  }

  submit(event) {
    event.preventDefault()
    const { dispatch, petition } = this.props
    // In dev, by default, don't actually call the api
    const signAction = Config.API_WRITABLE ? signPetition : devLocalSignPetition

    if (this.formIsValid()) {
      this.formTracker.submitForm({
        loginstate: (this.props.user.anonymous ? 0 : 1)
      })
      if (this.state.mobile_optin && this.state.phone) {
        smsSignUp(this.state.phone)
      }
      const osdiSignature = this.getOsdiSignature()
      return dispatch(signAction(osdiSignature, petition, { redirectOnSuccess: true }))
    }
    this.setState({ hideUntilInteract: false }) // show fields so we can show validation error
    this.formTracker.validationErrorTracker()
    return false
  }

  render() {
    const {
      dispatch,
      petition,
      user,
      query,
      showAddressFields,
      requireAddressFields,
      showOptinCheckbox,
      showOptinWarning,
      showMobileSignup,
      setRef,
      innerRef,
      id
    } = this.props
    const creator = (petition._embedded && petition._embedded.creator) || {}
    const petitionBy = creator.name || petition.contact_name
    return (
      <SignatureAddFormComponent
        submit={this.submit}
        creator={creator}
        petitionBy={petitionBy}
        petition={petition}
        user={user}
        query={query}
        showAddressFields={showAddressFields}
        showMobileSignup={!!showMobileSignup}
        requireAddressFields={requireAddressFields}
        onUnrecognize={() => { dispatch(sessionActions.unRecognize()) }}
        volunteer={this.state.volunteer}
        onClickVolunteer={this.volunteer}
        thirdPartyOptin={this.state.thirdparty_optin}
        displayMobileOptIn={!!this.state.phone}
        country={this.state.country}
        onChangeCountry={event => this.setState({ country: event.target.value })}
        updateStateFromValue={this.updateStateFromValue}
        validationError={this.validationError}
        showOptinWarning={showOptinWarning}
        showOptinCheckbox={showOptinCheckbox}
        setRef={setRef}
        innerRef={ref => { this.form = ref; if (innerRef) { innerRef(ref) } }}
        id={id}
        // Don't hide at first if the user doesn't have an address and the petition needs one
        hideUntilInteract={
          user.signonId &&
          !(user.postal_addresses && user.postal_addresses.length) &&
          petition.needs_full_addresses
            ? false
            : this.state.hideUntilInteract
        }
      />
    )
  }
}

SignatureAddForm.propTypes = {
  petition: PropTypes.object.isRequired,
  user: PropTypes.object,
  dispatch: PropTypes.func,
  query: PropTypes.object,
  showAddressFields: PropTypes.bool,
  requireAddressFields: PropTypes.bool,
  showOptinWarning: PropTypes.bool,
  showOptinCheckbox: PropTypes.bool,
  hiddenOptin: PropTypes.bool,
  showMobileSignup: PropTypes.bool,
  setRef: PropTypes.func,
  innerRef: PropTypes.func,
  id: PropTypes.string
}

function shouldShowAddressFields(user, petition) {
  if (!user.signonId) return true

  const userHasAddress = user.postal_addresses && user.postal_addresses.length

  if (petition.needs_full_addresses && !userHasAddress) {
    return true
  }
  return false
}

function shouldShowMobileSignUp(queryString) {
  if (queryString.cohort === '1') {
    return true
  }
  return false
}

function mapStateToProps(store, ownProps) {
  const user = store.userStore
  const { petition, query } = ownProps
  const creator = ((petition._embedded && petition._embedded.creator) || {})
  const source = query.source || ''

  const newProps = {
    user,
    showAddressFields: shouldShowAddressFields(user, petition),
    requireAddressFields: petition.needs_full_addresses && shouldShowAddressFields(user, petition),
    fromCreator: (/^c\./.test(source) || /^s\.icn/.test(source)),
    fromMailing: /\.imn/.test(source),
    showMobileSignup: shouldShowMobileSignUp(query)
  }
  newProps.showOptinWarning = !!(!user.signonId && (creator.source
                                                    || (creator.custom_fields && creator.custom_fields.may_optin)))

  newProps.hiddenOptin = !!(!user.signonId && ((creator.source && ((newProps.fromCreator && !query.mailing_id)
                                                                   || !newProps.fromMailing))
                                               || (!creator.source
                                                   && creator.custom_fields && creator.custom_fields.may_optin
                                                   && newProps.fromCreator
                                                   && !query.mailing_id)))

  newProps.showOptinCheckbox = !!(!user.signonId && newProps.showOptinWarning && !newProps.hiddenOptin)

  return newProps
}

export default connect(mapStateToProps)(SignatureAddForm)
export const WrappedComponent = SignatureAddForm
