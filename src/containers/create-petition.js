import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

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
    this.state = {
      selected: 'title',
      errors: [],
      data: {
        title: '',
        summary: '',
        target: [],
        description: ''
      }
    }
    this.setSelected = this.setSelected.bind(this)
    this.setRef = this.setRef.bind(this)
    this.onPreview = this.onPreview.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.getValue = this.getValue.bind(this)
  }

  onInputChange(event) {
    const { name, value } = event.target
    this.setState(state => ({
      data: { ...state.data, [name]: value }
    }))
  }

  onPreview(event) {
    event.preventDefault()
    if (this.formIsValid()) {
      this.props.dispatch(previewSubmit(this.state.data))
    }
  }

  getValue(name) {
    return this.state.data[name]
  }

  setSelected(name) {
    return () => this.setState({ selected: name })
  }

  setRef(name) {
    return input => input && (this[name] = input)
  }

  formIsValid() {
    const data = this.state.data
    const errors = []
    if (!data.title) errors.push(ERRORS.name)
    if (!data.summary) errors.push(ERRORS.text_statement)
    if (!data.target.length) errors.push(ERRORS.target)
    if (!data.description) errors.push(ERRORS.text_about)

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
          selected={this.state.selected}
          instructionStyle={instructionStyle}
          errors={this.state.errors}
          getValue={this.getValue}
          onChange={this.onInputChange}
          onPreview={this.onPreview}
        />
      </div>
    )
  }
}

CreatePetition.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(CreatePetition)
