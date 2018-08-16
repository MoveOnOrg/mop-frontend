import { actionTypes } from '../actions/createPetitionActions'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.CREATE_PETITION_PREVIEW_SUBMIT:
      // You have to submit all values in the action together
      return {
        submitted: false,
        title: action.title,
        summary: action.summary,
        description: action.description,
        target: action.target,
        source: action.source,
        cloned_from_id: action.clonedFromId,
        solicit_id: action.solicitId,
        trackingState: action.trackingState
      }
    case actionTypes.CREATE_PETITION_REQUEST:
      return {
        ...state,
        isSubmitting: true
      }
    case actionTypes.CREATE_PETITION_SUCCESS:
      // Removes the preview values and stores what is returned from the API
      return {
        isSubmitting: false,
        submitted: true,
        petition: action.petition
      }
    case actionTypes.CREATE_PETITION_FAILURE:
      return {
        ...state,
        isSubmitting: false
      }
    default:
      return state
  }
}

export default reducer
