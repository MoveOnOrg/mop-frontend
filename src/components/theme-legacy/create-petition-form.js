import React from 'react'
import PropTypes from 'prop-types'

import About from './form/instructions/about'
import Statement from './form/instructions/statement'
import TargetCustom from './form/instructions/target-custom'
import TargetNational from './form/instructions/target-national'
import TargetState from './form/instructions/target-state'
import Title from './form/instructions/title'

import CreatePetitionTarget from '../../containers/create-petition-target'

const instructionsByField = {
  title: <Title />,
  statement: <Statement />,
  'target-national': <TargetNational />,
  'target-state': <TargetState />,
  'target-custom': <TargetCustom />,
  about: <About />
}

const CreatePetitionForm = ({
  selected,
  setSelected,
  instructionStyle,
  setFormRef,
  setRef,
  errors,
  onChange,
  onPreview,
  title,
  summary,
  description,
  targets,
  onTargetAdd,
  onTargetRemove,
  customInputs,
  onChangeCustomInputs
}) => {
  const instructions = instructionsByField[selected]

  return (
    <div className='container'>
      <div className='row'>
        <div className='background-moveon-light-gray span6 start-form'>
          <form id='petition_form' ref={setFormRef} onSubmit={onPreview}>
            <ul className='errors'>
              {errors.map(err => <li key={err}>{err}</li>)}
            </ul>
            <fieldset id='start'>
              <span className='circle-number'>1</span>
              <span className='lanky-header moveon-dark-blue'>
                {' '}
                Start your petition!
              </span>
              <div className='text wrapper big' id='text_name_wrapper'>
                <input
                  name='title'
                  id='name_field'
                  className='span6'
                  type='text'
                  title='Your Petition Title'
                  placeholder='Petition title'
                  value={title}
                  onChange={onChange}
                  onClick={setSelected('title')}
                  ref={setRef('titleInput')}
                />
              </div>
              <div className='text wrapper' id='text_statement_wrapper'>
                <textarea
                  className='span6 '
                  name='summary'
                  placeholder='What&rsquo;s the text of your petition? (Try to keep it to 1-2 sentences.)'
                  id='text_statement_field'
                  title='Text of your Petition'
                  value={summary}
                  onChange={onChange}
                  onClick={setSelected('statement')}
                  ref={setRef('statementInput')}
                />
              </div>
            </fieldset>
            <CreatePetitionTarget
              setSelected={setSelected}
              setRef={setRef}
              targets={targets}
              onTargetAdd={onTargetAdd}
              onTargetRemove={onTargetRemove}
              customInputs={customInputs}
              onChangeCustomInputs={onChangeCustomInputs}
            />
            <fieldset id='statement'>
              <span className='circle-number'>3</span>
              <span className='lanky-header moveon-dark-blue'>
                Why are you starting this petition?
              </span>
              <div className='text wrapper' id='text_about_wrapper'>
                <textarea
                  className='span6'
                  name='description'
                  id='text_about_field'
                  placeholder='What&rsquo;s your petition about? Have you been personally affected by the issue?'
                  title='Petition Background'
                  value={description}
                  onChange={onChange}
                  onClick={setSelected('about')}
                  ref={setRef('aboutInput')}
                />
              </div>
            </fieldset>
            <button
              type='submit'
              className='xl300 center display-block background-moveon-bright-red'
              value='Preview The Petition'
              name='submit_button'
              id='submit_button'
            >
              Preview Petition <span className='triangle'>&#9654;</span>
            </button>
          </form>
        </div>
        <div className='span5 hidden-phone' style={instructionStyle}>
          <span
            className='icon-arrow-red-left hidden-phone'
            style={{ position: 'relative', top: 88 }}
          />
          <div className='hint'>{instructions}</div>
        </div>
      </div>
    </div>
  )
}

CreatePetitionForm.propTypes = {
  selected: PropTypes.string,
  setSelected: PropTypes.func,
  instructionStyle: PropTypes.object,
  setFormRef: PropTypes.func,
  setRef: PropTypes.func,
  errors: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  onPreview: PropTypes.func,
  title: PropTypes.string,
  summary: PropTypes.string,
  description: PropTypes.string,
  targets: PropTypes.array,
  onTargetAdd: PropTypes.func,
  onTargetRemove: PropTypes.func,
  customInputs: PropTypes.object,
  onChangeCustomInputs: PropTypes.func
}

export default CreatePetitionForm
