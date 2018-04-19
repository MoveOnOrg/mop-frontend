import { actionTypes } from '../actions/createPetitionActions'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TARGETS_SUCCESS:
      return { ...state, [action.storeKey]: action.targets }
    default:
      return state
  }
}

export default reducer
