import React from 'react'
import { expect } from 'chai'

import { shallow } from 'enzyme'

import { WrappedComponent as Home } from '../../src/pages/home'
import BillBoard from '../../src/components/billboard'
import SearchBar from '../../src/components/searchbar'
import RecentVictoryList from '../../src/components/recentvictory'
import TopPetitions from '../../src/components/top-petitions'


describe('<Home />', () => {
  const mockOrg = {
    organization: 'M.O.P.',
    description: 'MOP stands for Mash Out Posse or MoveOn Petitions or ....',
    logo_image_url: 'https://example.com/mopimage.jpg'
  }

  it('renders a billboard', () => {
    const context = shallow(<Home />)
    expect(context.find(BillBoard)).to.have.length(1)
  })

  it('does not render billboard when organization', () => {
    const context = shallow(<Home params={{ organization: 'mop' }} />)
    expect(context.find(BillBoard)).to.have.length(0)
  })

  it('renders billboard for "pac" organization', () => {
    const context = shallow(<Home params={{ organization: 'pac' }} />)
    expect(context.find(BillBoard)).to.have.length(1)
  })

  it('renders a searchbar', () => {
    const context = shallow(<Home />)
    expect(context.find(SearchBar)).to.have.length(1)
  })

  it('renders a recent victory list inside .front-content', () => {
    const context = shallow(<Home />)
    expect(context.find('.front-content').find(RecentVictoryList)).to.have.length(1)
  })

  it('does not render org header if no organization, or organization pac', () => {
    const context = shallow(<Home />)
    const pacContext = shallow(<Home params={{ organization: 'pac' }} />)
    expect(context.find('.organization-header')).to.have.length(0)
    expect(pacContext.find('.organization-header'), 'pac').to.have.length(0)
  })

  it('renders org content', () => {
    const context = shallow(<Home org={mockOrg} params={{ organization: 'mop' }} />)
    const orgHeader = context.find('.organization-header')
    expect(orgHeader).to.have.length(1)
    expect(orgHeader.find('h2').text()).to.be.equal('M.O.P.')
    expect(context.find(TopPetitions).props().pac).to.be.equal(0)
    expect(context.find(TopPetitions).props().megapartner).to.be.equal('mop')
  })
})
