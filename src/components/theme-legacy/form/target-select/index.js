import React from 'react'
import PropTypes from 'prop-types'

export const TargetForm = ({
  setSelected,
  toggleOpen,
  setRef,
  renderNational,
  renderGeoState,
  renderCustom
}) => (
  <div id='target_wrapper' className='' title='Choosing a Target'>
    <fieldset id='target' className=''>
      <span className='circle-number'>2</span>
      <span className='lanky-header moveon-dark-blue'>
        Who&#39;s the target of your petition?
      </span>
      <div
        className='checkbox wrapper'
        id='national_group_wrapper'
        title='Targeting the White House or Congress'
        onClick={setSelected('target-national')}
      >
        <label htmlFor='national_group' id='national_group_label'>
          <input
            name='checkbox_national_group'
            id='national_group'
            type='checkbox'
            className='reveal_more_options'
            onClick={toggleOpen('nationalOpen')}
            ref={setRef('nationalInput')}
          />{' '}
          The White House or Congress
        </label>
        {renderNational()}
      </div>
      <div
        className='checkbox wrapper'
        id='state_group_wrapper'
        title='Targeting Your Governor or State Legislature'
        onClick={setSelected('target-state')}
      >
        <label htmlFor='state_group' id='state_group_label'>
          <input
            name='checkbox_state_group'
            id='state_group'
            type='checkbox'
            className='reveal_more_options'
            onClick={toggleOpen('stateOpen')}
            ref={setRef('stateInput')}
          />{' '}
          Your governor or state legislature
        </label>
        {renderGeoState()}
      </div>
      <div
        className='checkbox wrapper'
        id='checkbox_custom_group_wrapper'
        onClick={setSelected('target-custom')}
      >
        <label htmlFor='custom_group' id='checkbox_custom_group_label'>
          <input
            name='checkbox_custom_group'
            id='custom_group'
            type='checkbox'
            className='reveal_more_options'
            onClick={toggleOpen('customOpen')}
            ref={setRef('customInput')}
          />{' '}
          Someone else (like a local official or corporate CEO)
        </label>
        {renderCustom()}
      </div>
    </fieldset>
  </div>
)

TargetForm.propTypes = {
  setSelected: PropTypes.func,
  toggleOpen: PropTypes.func,
  setRef: PropTypes.func,
  renderNational: PropTypes.func,
  renderGeoState: PropTypes.func,
  renderCustom: PropTypes.func
}
