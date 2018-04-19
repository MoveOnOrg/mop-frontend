import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import LegislatorAutocomplete from './legislator-autocomplete'

const NationalTargetSelect = ({ selected, onSelect, items }) => (
  <div>
    <div id='national_group_checkboxes'>
      {selected.map(selectedItem => (
        <div key={selectedItem.label} className='checkbox wrapper'>
          <label>
            <input
              type='checkbox'
              onChange={() =>
                onSelect({ ...selectedItem, checked: !selectedItem.checked })
              }
              checked={selectedItem.checked}
            />{' '}
            {selectedItem.label}
          </label>
        </div>
      ))}
    </div>
    <div className='autocomplete_wrapper text wrapper small'>
      <LegislatorAutocomplete
        group='national'
        onChange={onSelect}
        items={items}
      />
    </div>
  </div>
)

function mapStateToProps(store) {
  return {
    items:
      (store.petitionTargetsStore && store.petitionTargetsStore.national) || []
  }
}

NationalTargetSelect.propTypes = {
  selected: PropTypes.array,
  onSelect: PropTypes.func,
  items: PropTypes.array
}

export default connect(mapStateToProps)(NationalTargetSelect)
