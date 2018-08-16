import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { appLocation } from '../routes'
import { FormTracker } from '../lib'
import { previewSubmit } from '../actions/createPetitionActions'

import CreatePetitionForm from 'LegacyTheme/create-petition-form'

const ERRORS = {
  name: 'Please provide a title for your petition.',
  text_statement: 'Please fill in the statement for your petition.',
  target: 'You must select at least one target for your petition.',
  text_about: 'Please provide background info for your petition.'
}

export class CreatePetition extends React.Component {
  constructor(props) {
    super(props)
    const { initialPetition, location } = this.props
    const query = (location && location.query) || {}
    this.state = {
      selected: 'title',
      errors: [],
      customInputs: { name: '', email: '', title: '' },

      title: initialPetition.title || '',
      summary: initialPetition.summary || '',
      target: initialPetition.target || [],
      description: initialPetition.description || '',

      source: initialPetition.source || query.source,
      clonedFromId: initialPetition.cloned_from_id || query.cloned_from_id,
      solicitId: initialPetition.solicit_id || query.solicit_id
    }
    this.setSelected = this.setSelected.bind(this)
    this.setRef = this.setRef.bind(this)
    this.onPreview = this.onPreview.bind(this)
    this.onTargetAdd = this.onTargetAdd.bind(this)
    this.onTargetRemove = this.onTargetRemove.bind(this)
    this.validateAndContinue = this.validateAndContinue.bind(this)
    this.formTracker = new FormTracker()
  }

  onPreview(event) {
    event.preventDefault()
    // No custom target in the editable fields
    if (!this.state.customInputs.name) return this.validateAndContinue()

    // If there is a custom target, we have to add it first
    return this.onTargetAdd(
      {
        target_type: 'custom',
        ...this.state.customInputs
      },
      {
        isCustom: true,
        callback: this.validateAndContinue
      }
    )
  }

  onTargetAdd(
    target,
    { isCustom, callback } = { isCustom: false, callback: () => {} }
  ) {
    if (!isCustom && !target.label) return // target is invalid
    if (!isCustom && this.state.target.find(old => old.label === target.label)) return // already exists

    if (isCustom && !this.state.customInputs.name) return // Trying to add a blank custom target

    if (isCustom) {
      this.setState({ customInputs: { name: '', email: '', title: '' } })
    }

    this.setState(
      state => ({ target: [...state.target, target] }),
      () => callback && callback()
    )
  }

  onTargetRemove(target) {
    this.setState(state => ({
      target: state.target.filter(e => e.label !== target.label)
    }))
  }

  setSelected(name) {
    return () => this.setState({ selected: name })
  }

  // We need refs because we call getClientRect to get the position
  // on the page to display the instructions next to it.
  setRef(name) {
    // eslint-disable-next-line no-return-assign
    return input => input && (this[name] = input)
  }

  validateAndContinue() {
    if (this.formIsValid()) {
      this.formTracker.formAdvanceTracker()
      this.props.dispatch(
        previewSubmit({
          title: this.state.title,
          summary: this.state.summary,
          target: this.state.target,
          description: this.state.description,
          source: this.state.source,
          clonedFromId: this.state.clonedFromId,
          solicitId: this.state.solicitId,
          trackingState: this.formTracker.getState()
        })
      )
      appLocation.push('/create_preview.html')
    }
  }

  formIsValid() {
    const { title, summary, target, description } = this.state
    const errors = []
    if (!title) errors.push(ERRORS.name)
    if (!summary) errors.push(ERRORS.text_statement)
    if (!target.length) errors.push(ERRORS.target)
    if (!description) errors.push(ERRORS.text_about)
    if (errors.length) {
      this.setState({ errors })
      return false
    }

    return true
  }

  render() {
    const elementByField = {
      title: this.titleInput,
      statement: this.statementInput,
      'target-national': this.nationalInput,
      'target-state': this.stateInput,
      'target-custom': this.customInput,
      about: this.aboutInput
    }

    const instructionStyle = { position: 'relative', top: -45 }
    const selectedElement = elementByField[this.state.selected]
    const bodyTop = document.body.getBoundingClientRect().top + 175

    if (typeof selectedElement !== 'undefined') {
      instructionStyle.top =
        selectedElement.getBoundingClientRect().top - bodyTop
    }

    return (
      <div className='moveon-petitions'>
        <CreatePetitionForm
          setSelected={this.setSelected}
          setRef={this.setRef}
          setFormRef={ref => { this.form = ref }}
          selected={this.state.selected}
          instructionStyle={instructionStyle}
          errors={this.state.errors}
          onChange={({ target: { name, value } }) => {
            this.setState({ [name]: value })
            this.formTracker.updateFormProgress({ fieldchanged: name })
          }}
          onPreview={this.onPreview}
          title={this.state.title}
          summary={this.state.summary}
          description={this.state.description}
          targets={this.state.target}
          onTargetAdd={this.onTargetAdd}
          onTargetRemove={this.onTargetRemove}
          customInputs={this.state.customInputs}
          onChangeCustomInputs={({ target: { name, value } }) => {
            this.setState(state => ({
              customInputs: { ...state.customInputs, [name]: value }
            }))
          }}
        />
      </div>
    )
  }
}

CreatePetition.defaultProps = {
  initialPetition: {}
}

CreatePetition.propTypes = {
  dispatch: PropTypes.func,
  initialPetition: PropTypes.object,
  location: PropTypes.object
}

export default withRouter(connect()(CreatePetition))
