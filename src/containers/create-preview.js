import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Config from '../config'
import { FormTracker } from '../lib'
import { appLocation } from '../routes'

import { submit, devLocalSubmit } from '../actions/createPetitionActions'

import { CreatePreview as CreatePreviewComponent } from 'LegacyTheme/create-preview'

class CreatePreview extends React.Component {
  constructor(props) {
    super(props)
    this.state = { zip: '' }
    this.submitPetition = this.submitPetition.bind(this)
    this.formTracker = new FormTracker()
    this.formTracker.setStateOnce(props.trackingState)
  }

  componentDidMount() {
    if (!this.props.hasPetition) appLocation.push('/create_start.html')
  }

  componentWillReceiveProps(nextProps) {
    this.formTracker.setStateOnce(nextProps.trackingState)
  }

  submitPetition() {
    this.formTracker.submitForm()
    return this.props.dispatch(Config.API_WRITABLE ? submit(this.state.zip) : devLocalSubmit())
  }

  render() {
    if (!this.props.hasPetition) return null // We will also redirect in componentDidMount
    return (
      <CreatePreviewComponent
        petition={this.props.petition}
        user={this.props.user}
        onSubmit={this.submitPetition}
        zip={this.state.zip}
        onChangeZip={e => this.setState({ zip: e.target.value })}
        formTracker={this.formTracker}
      />
    )
  }
}

CreatePreview.propTypes = {
  hasPetition: PropTypes.bool,
  petition: PropTypes.object,
  user: PropTypes.object,
  dispatch: PropTypes.func,
  trackingState: PropTypes.object
}

function mapStateToProps({ petitionCreateStore, userStore }) {
  return {
    hasPetition: !!(
      petitionCreateStore &&
      petitionCreateStore.title &&
      !petitionCreateStore.submitted
    ),
    petition: petitionCreateStore,
    trackingState: petitionCreateStore.trackingState,
    user: userStore
  }
}

export default connect(mapStateToProps)(CreatePreview)
