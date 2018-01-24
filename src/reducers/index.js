import { combineReducers } from 'redux'
import { actionTypes as petitionActionTypes } from '../actions/petitionActions.js'
import { actionTypes as sessionActionTypes } from '../actions/sessionActions.js'
import nav from './nav'
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

const initialUserState = {
  // Possible keys. none of these are guaranteed to be present/available
  // # OSDI fields:
  // postal_addresses: [{status: "Potential"}] (here when we have an address for this user)
  // identifiers: <probably a combination of signonId, token, and any other identifiers available>
  // given_name: (first name)
  //
  // # LOGIN STATUS fields:
  // anonymous: <boolean>
  // signonId: (unique id from signon)
  // authenticated: If the person is actually logged in
  // token: (either an id:<signon token> or akid:<akid token>) that can be used for a single action
  //
  // # FIELDS SAVED FROM petition signing, e.g.
  // full_name:
  // email:
  // zip:
  // state:
  // country:
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
    petition = Object.assign(petitionWithoutSlug, { slug })
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
      petition.total_signatures = signatures.count
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

function userReducer(state = initialUserState, action) {
  // Fold in tokens at the top, since it's possible it's for everyone
  // tokens can be hashedId and akid
  const newData = { ...(action.tokens || {}) }
  if (!newData.token) {
    // from query parameters
    if (newData.hashedId) {
      newData.token = `id:${newData.hashedId}`
    } else if (newData.akid) {
      newData.token = `akid:${newData.akid}`
    }
  }
  switch (action.type) {
    case sessionActionTypes.UNRECOGNIZE_USER_SESSION:
      return { anonymous: true } // Purposefully destroying current state
    case sessionActionTypes.ANONYMOUS_SESSION_START:
      newData.anonymous = true
      return { ...state, ...newData }
    case sessionActionTypes.USER_SESSION_START:
      if (action.session) {
        // session might have: given_name, authenticated, postal_addresses
        Object.assign(newData, action.session)
        const { identifiers } = action.session
        if (identifiers && identifiers.length) {
          newData.signonId = identifiers[0]
          identifiers.forEach((id) => {
            if (/^(ak|token)?id:/.test(id)) {
              newData.token = id
            }
          })
        }
      }
      return { ...state, ...newData }
    case sessionActionTypes.USER_SESSION_FAILURE:
      return { ...state, ...newData }
    case petitionActionTypes.PETITION_SIGNATURE_SUBMIT:
      // If it's an anonymous user or we get useful session information
      // Then copy it into userData
      if (!state.full_name
          && action.signature && action.signature.person) {
        if (action.signature.person.full_name) {
          newData.full_name = action.signature.person.full_name
        }
        if (action.signature.person.email_addresses
            && action.signature.person.email_addresses.length) {
          newData.email = action.signature.person.email_addresses[0]
        }
        if (action.signature.person.postal_addresses
            && action.signature.person.postal_addresses.length) {
          const address = action.signature.person.postal_addresses[0]
          newData.zip = address.postal_code
          newData.state = address.region
          newData.country = address.country_name
        }
        return { ...state, ...newData }
      }
      return state
    default:
      return state
  }
}

const rootReducer = combineReducers({
  nav,
  petitionStore: petitionReducer,
  petitionSearchStore: petitionSearchReducer,
  userStore: userReducer
})

export default rootReducer
