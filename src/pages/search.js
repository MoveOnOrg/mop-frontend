import React from 'react'
import PropTypes from 'prop-types'
import SearchBar from '../components/searchbar'


// will need for api connection
import 'whatwg-fetch'
import { connect } from 'react-redux'

class SearchPage extends React.Component {


  // potentially will need?
  // componentWillMount() {
  //   const { dispatch, params } = this.props
  //   dispatch(petitionActions.loadPetition(params.query))
  // }

  render(){
    return (
      <div className="container background-moveon-white bump-top-1">
        <div className="row">
          <div className="span12">
            <h2 id="title" className="lite"> Top petitions </h2>
            <p>You can search for petitions by issue, title, author, target, city, state, or keyword &mdash; or check out <a href="/victories.html">recent victories</a>. </p>
            <SearchBar />
          </div>
        </div>
      </div>
    )
  }
}

// SearchPage.propTypes = {
//   petition: PropTypes.object,
//   params: PropTypes.object,
//   location: PropTypes.object,
//   dispatch: PropTypes.func
// }

function mapStateToProps(store, ownProps) {
  return {}
}

export default connect(mapStateToProps)(SearchPage)
