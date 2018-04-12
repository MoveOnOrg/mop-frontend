import React from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'

const container = {
  marginTop: '-11px',
  padding: '2px',
  borderRadius: '4px',
  position: 'absolute',
  border: '1px solid #aaaaaa',
  background: '#fff',
  backgroundImage:
    'url(https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/base/images/ui-bg_flat_75_ffffff_40x100.png) 50% 50% repeat-x',
  color: '#222222',
  fontFamily: 'Verdana,Arial,sans-serif',
  fontSize: '1.1em',
  cursor: 'default'
}

const hover = {
  border: '1px solid #999999',
  background:
    '#dadada url(https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/base/images/ui-bg_glass_75_dadada_1x400.png) 50% 50% repeat-x',
  color: '#212121',
  margin: '-1px'
}

const itemStyle = {
  borderRadius: '4px',
  padding: '.2em .4em',
  lineHeight: 1.5
}

const itemHover = { ...itemStyle, ...hover }

const filter = (items, inputValue = '') =>
  items.filter(i => i.name.toLowerCase().includes(inputValue.toLowerCase()))

export const LegislatorAutocomplete = ({ onChange, group, state, items }) => (
  <Downshift
    onChange={(item, actions) => {
      actions.clearSelection()
      onChange({ ...item, checked: true })
    }}
    itemToString={item => (item ? item.name : '')}
    render={({
      getInputProps,
      getItemProps,
      isOpen,
      inputValue,
      highlightedIndex
    }) => (
      <div>
        <input
          type='text'
          {...getInputProps({
            placeholder: 'Or, enter a specific legislator’s name',
            onChange: () =>
              group === 'state' &&
              !state &&
              alert('Please select your state above.')
          })}
        />
        {isOpen ? (
          <div style={container}>
            {filter(items, inputValue).map((item, index) => (
              <div
                {...getItemProps({ item })}
                key={item.value}
                style={highlightedIndex === index ? itemHover : itemStyle}
              >
                {item.label}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    )}
  />
)

LegislatorAutocomplete.propTypes = {
  onChange: PropTypes.func,
  state: PropTypes.string,
  items: PropTypes.array,
  group: PropTypes.string.isRequired
}

export default LegislatorAutocomplete
