import React from 'react'

import BillBoard from '../components/billboard'
import SearchBar from '../components/searchbar'
import RecentVictoryList from '../components/recentvictory.js'
import TopPetitions from '../components/top-petitions'

const Home = () => (
  <div className='container background-moveon-white bump-top-1'>
    <BillBoard />
    <SearchBar size='long'/>
    <div className='row front-content'>
      <TopPetitions pac={0} megapartner='' source='homepage' />
      <RecentVictoryList />
    </div>
  </div>
)

export default Home
