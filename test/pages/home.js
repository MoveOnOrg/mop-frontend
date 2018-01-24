import React from 'react'
import { Provider } from 'react-redux'
import { expect } from 'chai'

import { mount } from 'enzyme'
import { createMockStore } from 'redux-test-utils'

import Home from '../../src/pages/home'
import BillBoard from '../../src/components/billboard'
import SearchBar from '../../src/components/searchbar'
import RecentVictoryList from '../../src/components/recentvictory'
import TopPetitions from '../../src/components/top-petitions'


describe('<Home />', () => {
  const baseStore = createMockStore({ nav: {}, petitionStore: {} })
  const orgStore = createMockStore({ nav: { orgs: {
    mop: {
      organization: 'M.O.P.',
      description: 'MOP stands for Mash Out Posse or MoveOn Petitions or ....',
      logo_image_url: 'https://example.com/mopimage.jpg'
    }
  } }, petitionStore: {} })
  it('renders a billboard', () => {
    const myComponent = <Home params={{}} />
    const context = mount(<Provider store={baseStore} children={myComponent} />)
    expect(context.find(BillBoard)).to.have.length(1)
  })

  it('renders a searchbar', () => {
    const myComponent = <Home params={{}} />
    const context = mount(<Provider store={baseStore} children={myComponent} />)
    expect(context.find(SearchBar)).to.have.length(1)
  })

  it('renders a recent victory list inside .front-content', () => {
    const myComponent = <Home params={{}} />
    const context = mount(<Provider store={baseStore} children={myComponent} />)
    expect(context.find('.front-content').find(RecentVictoryList)).to.have.length(1)
  })

  it('renders org content', () => {
    const myComponent = <Home params={{ organization: 'mop' }} />
    const context = mount(<Provider store={orgStore} children={myComponent} />)
    const orgHeader = context.find('.organization-header')
    expect(orgHeader).to.have.length(1)
    expect(orgHeader.find('h2').text()).to.be.equal('M.O.P.')
    expect(context.find(TopPetitions).props().pac).to.be.equal(0)
    expect(context.find(TopPetitions).props().megapartner).to.be.equal('mop')
  })
})
