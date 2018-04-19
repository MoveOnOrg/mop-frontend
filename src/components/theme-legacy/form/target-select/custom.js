import React from 'react'
import PropTypes from 'prop-types'

const CustomTargetSelect = ({
  selected,
  onSelect,
  customInputs,
  onChangeInputs
}) => (
  <div>
    <div id='selected_targets_div' className='selected_targets' />
    <div id='more_custom_group'>
      {selected.map(target => (
        <div className='checkbox wrapper' key={target.name}>
          <label className='target_label'>
            <input
              type='checkbox'
              checked={target.checked}
              onChange={() =>
                onSelect({
                  ...target,
                  checked: !target.checked
                })
              }
            />{' '}
            {target.name +
              (target.title && `, ${target.title}`) +
              (target.email && ` (${target.email})`)}
          </label>
        </div>
      ))}
      <div className='text wrapper small' id='text_custom_group_name_wrapper'>
        <input
          name='name'
          id='custom_name'
          className='text'
          type='text'
          placeholder='Name'
          value={customInputs.name}
          onChange={onChangeInputs}
        />
      </div>
      <div className='text wrapper small' id='text_custom_group_email_wrapper'>
        <input
          name='email'
          id='custom_email'
          className='text'
          type='text'
          placeholder='Email Address (optional)'
          value={customInputs.email}
          onChange={onChangeInputs}
        />
      </div>
      <div className='text wrapper small' id='text_custom_group_title_wrapper'>
        <input
          name='title'
          id='custom_title'
          className='text'
          type='text'
          placeholder='Title or Position (optional)'
          value={customInputs.title}
          onChange={onChangeInputs}
        />
      </div>
      <div id='someone_else_add'>
        <a
          onClick={() => {
            onSelect({
              target_type: 'custom',
              checked: true,
              ...customInputs
            })
          }}
          className='btn'
          id='add_this_target'
        >
          Add another target
        </a>
      </div>
    </div>
  </div>
)

CustomTargetSelect.propTypes = {
  selected: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  customInputs: PropTypes.object,
  onChangeInputs: PropTypes.func
}

export default CustomTargetSelect
