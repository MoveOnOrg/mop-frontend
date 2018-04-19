import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LegislatorAutocomplete from './legislator-autocomplete'
import StateSelect from '../state-select'

const StateTargetSelect = ({
  selected,
  onSelect,
  geoState,
  onChangeGeoState,
  autocompleteItems
}) => (
  <div>
    <div className='select wrapper' id='select_target_state_wrapper'>
      <label htmlFor='select_target_state' id='select_target_state_label'>
        Pick your state
      </label>
      <StateSelect
        onChange={onChangeGeoState}
        selectText=''
        className=''
        onlyStates
      />
    </div>
    <div id='state_group_checkboxes'>
      {selected.map(selectedItem => (
        <div key={selectedItem.label} className='checkbox wrapper'>
          <label>
            <input
              type='checkbox'
              onChange={() =>
                onSelect({
                  ...selectedItem,
                  checked: !selectedItem.checked
                })
              }
              checked={selectedItem.checked}
            />{' '}
            {selectedItem.label}
          </label>
        </div>
      ))}
    </div>
    <div
      id='state_group_autocomplete_wrapper'
      className='autocomplete_wrapper text wrapper small'
    >
      {geoState && (
        <LegislatorAutocomplete
          group='national'
          onChange={onSelect}
          items={autocompleteItems}
        />
      )}
    </div>
  </div>
)

function mapStateToProps(store, ownProps) {
  const key = `state--${ownProps.geoState}`
  return {
    autocompleteItems:
      (store.petitionTargetsStore && store.petitionTargetsStore[key]) || []
  }
}

StateTargetSelect.propTypes = {
  selected: PropTypes.array,
  onSelect: PropTypes.func,
  autocompleteItems: PropTypes.array,
  geoState: PropTypes.string,
  onChangeGeoState: PropTypes.func
}

export default connect(mapStateToProps)(StateTargetSelect)
