import { actionTypes } from '../actions/createPetitionActions'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.CREATE_PETITION_PREVIEW_SUBMIT:
      // You have to submit all values in the action together
      return {
        ...state,
        title: action.title,
        summary: action.summary,
        description: action.description,
        target: action.target
      }
    default:
      return state
  }
}

export default reducer
