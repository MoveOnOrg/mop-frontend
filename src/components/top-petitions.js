import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import PetitionPreview from './petition-preview.js'
import { loadTopPetitions } from '../actions/petitionActions.js'


class TopPetitions extends React.Component {
  componentDidMount() {
    const { pac, megapartner, topPetitions, loadPetitions } = this.props
    if (!topPetitions) {
      loadPetitions(pac, megapartner)
    }
  }

  render() {
    const { topPetitions, source, fullWidth } = this.props
    const petitionList = (topPetitions) ? topPetitions.map(petition => (
      <PetitionPreview key={petition.petition_id} petition={petition} source={source} />
    )) : ''

    return (
      <div id='campaign-widget' className={fullWidth ? 'span12 widget clearfix' : 'span6 widget clearfix pull-right'}>
        <div className='widget-top'>
          <h3>Hot Petitions</h3>
        </div>
        {petitionList}
      </div>
    )
  }
}

TopPetitions.propTypes = {
  pac: PropTypes.number,
  megapartner: PropTypes.string,
  source: PropTypes.string,
  topPetitions: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  loadPetitions: PropTypes.func,
  fullWidth: PropTypes.bool
}

const mapStateToProps = (store, ownProps) => {
  const { pac, megapartner } = ownProps
  const topPetitionsState = store.petitionStore.topPetitions
  // topPetitionsKey must not just be truthily equal but exact
  // eslint-disable-next-line no-unneeded-ternary
  const topPetitionsKey = `${pac ? 1 : 0}--${megapartner ? megapartner : ''}`
  const topPetitionsProp = (
    typeof topPetitionsState[topPetitionsKey] === 'undefined'
  ) ? false : topPetitionsState[topPetitionsKey].map(petitionId => store.petitionStore.petitions[petitionId])
  return {
    topPetitions: topPetitionsProp
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadPetitions: (pac, megapartner) =>
    dispatch(loadTopPetitions(pac, megapartner))
})

export default connect(mapStateToProps, mapDispatchToProps)(TopPetitions)
