import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LegislatorAutocomplete from './legislator-autocomplete'
import StateSelect from '../state-select'

const isDefault = target =>
  ['governor', 'statehouse', 'statesenate'].indexOf(target.target_type) !== -1

const contains = (item, list) =>
  list.filter(
    t => t.target_type === item.target_type && t.target_id === item.target_id
  ).length > 0

const StateTargetSelect = ({
  selected,
  remove,
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
      {autocompleteItems.filter(isDefault).map(defaultItem => {
        // isChecked means if the autocomplete item is in the selected items
        const isChecked = contains(defaultItem, selected)
        return (
          <div key={defaultItem.label} className='checkbox wrapper'>
            <label>
              <input
                type='checkbox'
                onChange={() =>
                  (isChecked ? remove(defaultItem) : onSelect(defaultItem))
                }
                checked={isChecked}
              />{' '}
              {defaultItem.label}
            </label>
          </div>
        )
      })}
      {/* Also show if not a default, or it's from another geoState (not preloaded into autocompleteItems) */}
      {selected
        .filter(t => !isDefault(t) || !contains(t, autocompleteItems))
        .map(selectedItem => (
          <div key={selectedItem.label} className='checkbox wrapper'>
            <label>
              <input
                type='checkbox'
                onChange={() => remove(selectedItem)}
                checked
              />{' '}
              {selectedItem.label}
            </label>
          </div>
        ))}
    </div>
    <div className='autocomplete_wrapper text wrapper small'>
      {geoState && (
        <LegislatorAutocomplete
          group='national'
          onChange={onSelect}
          items={autocompleteItems.filter(t => !isDefault(t))}
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
  remove: PropTypes.func,
  onSelect: PropTypes.func,
  autocompleteItems: PropTypes.array,
  geoState: PropTypes.string,
  onChangeGeoState: PropTypes.func
}

export default connect(mapStateToProps)(StateTargetSelect)
