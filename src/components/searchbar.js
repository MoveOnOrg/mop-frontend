import React from "react"
import PropTypes from "prop-types"

import StateSelect from './form/state-select'

const smallStateSelectStyle = {
  width: '20%',
  marginRight: '5px'
}

const SearchBar = ({ size }) => {

  const longSearchBar = (
    <div className="container">
      <div className="row">
        <div className="span7 control-group bump-top-1">
          <form className="search" method="get" action="/find/">
            <div className="search">
              <input name="query" placeholder="Search Petitions" type="text" className="margin-right-1 " />
              <StateSelect selectText="All States" style={smallStateSelectStyle} />
              <button className="background-moveon-dark-blue margin-left-1" type="submit">Search</button>
            </div>
          </form>
        </div>
        <p className="lanky-header size-medium-small lh-24 bump-top-1">Search for petitions by any keyword.</p>
      </div>
    </div>
  )

  const shortSearchBar = (
    <div id="search-form-div">
      <form className="form-vertical">
        <div className="search">
          <input name="query" type="text" id="search-box2" className="margin-top-0 margin-right-2"/>
          <button type="submit" className="background-moveon-dark-blue">Search</button>
        </div>
        <div className="clear"></div>
      </form>
    </div>
  )

  return (
    <div>
      {size === "long" ? longSearchBar : shortSearchBar }
    </div>
  )
}

SearchBar.propTypes = {
  size: PropTypes.string,
}


export default SearchBar
