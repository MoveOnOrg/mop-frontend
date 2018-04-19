import React from 'react'
import { expect } from 'chai'
import sinon from 'sinon'
import { shallow } from 'enzyme'

import {
  CreatePetitionTarget as CreatePetitionTargetUnwrapped
} from '../../src/containers/create-petition-target'

describe('<CreatePetitionTarget />', () => {
  it('adds petition targets to the state when selected, and fires onChange', () => {
    const onChange = sinon.spy()
    const component = shallow(
      <CreatePetitionTargetUnwrapped onChange={onChange} />
    )
    const selectNational = component.instance().onSelect('national')
    const senator = {
      label: 'Senator Someone',
      value: 'senator:blah',
      checked: true
    }
    selectNational(senator)
    expect(component.state('national')).to.include(senator)
    expect(
      onChange.calledWith({
        target: { name: 'target', value: [senator] }
      })
    ).to.be.true
  })

  it('modifies existing petition targets to the state when selected, and fires onChange', () => {
    const onChange = sinon.spy()
    const component = shallow(
      <CreatePetitionTargetUnwrapped onChange={onChange} />
    )
    const selectNational = component.instance().onSelect('national')
    const target = {
      label: 'The entire U.S. House',
      checked: true
    }
    selectNational(target)
    expect(component.state('national').length).to.equal(3)
    expect(component.state('national')).to.include(target)
    expect(
      onChange.calledWith({
        target: { name: 'target', value: [target] }
      })
    ).to.be.true
  })
})
