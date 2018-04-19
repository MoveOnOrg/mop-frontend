import { combineReducers } from 'redux'
import { actionTypes as petitionActionTypes } from '../actions/petitionActions.js'
import { actionTypes as accountActionTypes } from '../actions/accountActions.js'
import navStore from './nav'
import staticPageReducer from './static-pages'
import userReducer from './user'
import petitionTargetsReducer from './petition-targets'
import petitionCreateReducer from './petition-create'

// Function fetchPetitionRequest(petitionSlug) {
//     Return {
//         Type: FETCH_PETTION_REQUEST,
//         PetitionSlug
//     }
// }

const initialPetitionState = {
  petitions: {}, // Keyed by slug AND petition_id for petition route
  petitionSignatures: {}, // Keyed by petition slug, then page
  signatureStatus: {}, // Keyed by petition_id (because form doesn't have slug)
  signatureMessages: {}, // Keyed by petition_id, MessageId value from SQS post
  topPetitions: {}, // Lists of petition IDs keyed by pac then megapartner
  nextPetitions: [], // List of petition IDs that can be suggested to sign next
  nextPetitionsLoaded: false // Is nextPetitions empty because there are none to suggest or it hasn't been loaded yet?
}

const initialSearchState = {
  searchResults: {
    count: '0',
    page_size: 0,
    _embed: [],
    _links: {}
  }
}

function petitionReducer(state = initialPetitionState, action) {
  const {
    type,
    petition: petitionWithoutSlug,
    slug,
    page,
    signatures,
    petitions,
    topPetitionsKey,
    useCache
  } = action
  let petition = {}
  let updateData = {}
  if (typeof petitionWithoutSlug === 'object') {
    Object.assign(petition, petitionWithoutSlug, { slug })
  } else if (slug && typeof state.petitions[slug] !== 'undefined') {
    petition = state.petitions[slug]
  }
  switch (type) {
    case petitionActionTypes.FETCH_PETITION_SUCCESS:
      return {
        ...state,
        petitions: {
          ...state.petitions,
          // Key it both by id and by slug, for different lookup needs
          [slug]: petition,
          [petition.petition_id]: petition
        }
      }
    case petitionActionTypes.PETITION_SIGNATURE_SUCCESS:
      updateData = {
        signatureStatus: {
          ...state.signatureStatus,
          [petition.petition_id]: 'success'
        }
      }
      if (action.messageId) {
        updateData.signatureMessages = {
          ...state.signatureMessages,
          [petition.petition_id]: {
            messageId: action.messageId,
            messageMd5: action.messageMd5
          }
        }
      }
      if (state.nextPetitionsLoaded) {
        updateData.nextPetitions = state.nextPetitions.filter(petId => petId !== petition.petition_id)
      }
      return {
        ...state,
        ...updateData
      }
    case petitionActionTypes.FETCH_PETITION_SIGNATURES_SUCCESS:
      petition = { ...petition, total_signatures: signatures.count }
      return {
        ...state,
        petitionSignatures: {
          ...state.petitionSignatures,
          [slug]: {
            ...state.petitionSignatures[slug],
            // eslint-disable-next-line no-underscore-dangle
            [page]: signatures._embedded.map((signature) =>
              // eslint-disable-next-line no-underscore-dangle
              Object.assign(signature, { user: signature._embedded.user })
            )
          }
        },
        petitions: {
          ...state.petitions,
          [slug]: petition,
          [petition.petition_id]: petition
        }
      }
    case petitionActionTypes.FETCH_TOP_PETITIONS_SUCCESS:
      if (useCache) {
        return state
      }
      updateData = {
        petitions: Object.assign({}, state.petitions,
                                 ...petitions.map((topPetition) => ({
                                   [topPetition.name]: topPetition,
                                   [topPetition.petition_id]: topPetition
                                 }))),
        topPetitions: {
          ...state.topPetitions,
          [topPetitionsKey]: petitions.map(topPetition => topPetition.petition_id)
        },
        nextPetitionsLoaded: true
      }
      updateData.nextPetitions = state.nextPetitions.concat(
        petitions.map(topPetition => topPetition.petition_id)
      ).filter((petId, i, list) => (
        i === list.indexOf(petId) // Make each item unique on the list
          && !(petId in state.signatureStatus || updateData.petitions[petId].signed) // Exclude signed
      ))
      return {
        ...state,
        ...updateData
      }
    case accountActionTypes.FETCH_USER_PETITIONS_SUCCESS:
      updateData = {
        petitions: {
          ...state.petitions,
          ...petitions.reduce((acc, p) => ({ ...acc, [p.name]: p, [p.petition_id]: p }), {})
        }
      }
      return {
        ...state,
        ...updateData
      }
    default:
      return state
  }
}

function petitionSearchReducer(state = initialSearchState, action) {
  const {
    type,
    searchResults
  } = action
  switch (type) {
    case petitionActionTypes.SEARCH_PETITIONS_SUCCESS:
      return {
        ...state,
        searchResults: { ...searchResults }
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  navStore,
  petitionStore: petitionReducer,
  petitionSearchStore: petitionSearchReducer,
  userStore: userReducer,
  staticPageStore: staticPageReducer,
  petitionTargetsStore: petitionTargetsReducer,
  petitionCreateStore: petitionCreateReducer
})

export default rootReducer
