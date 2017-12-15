import { combineReducers } from 'redux'
import { actionTypes as petitionActionTypes } from '../actions/petitionActions.js'
import { actionTypes as sessionActionTypes } from '../actions/sessionActions.js'

// function fetchPetitionRequest(petitionSlug) {
//     return {
//         type: FETCH_PETTION_REQUEST,
//         petitionSlug
//     }
// }

const navState = {
  partnerCobrand: null // or {logo, link, name}
}

const initialPetitionState = {
  petitions: {}, // keyed by slug AND petition_id for petition route
  petitionSignatures: {}, // keyed by petition slug, then page
  signatureStatus: {}, // keyed by petition_id (because form doesn't have slug)
  signatureMessages: {}, // keyed by petition_id, MessageId value from SQS post
  topPetitions: {}, // lists of petition IDs keyed by pac then megapartner
  nextPetitions: [], // list of petition IDs that can be suggested to sign next
  nextPetitionsLoaded: false // is nextPetitions empty because there are none to suggest or it hasn't been loaded yet?
}

const initialUserState = {
  // Possible keys. none of these are guaranteed to be present/available
  // anonymous: <boolean>
  // given_name: (first name)
  // full_name:
  // emailHash: <the hash of the email address>
  // email:
  // zip:
  // state:
  // country:
  // postal_addresses: [{status: "Potential"}] (here when we have an address for this user)
  // signonId: (unique id from signon)
  // token: (either an id:<signon token> or akid:<akid token>) that can be used for a single action
  // identifiers: <probably a combination of signonId, token, and any other identifiers available>
}

function navReducer(state = navState, action) {
  // the goal here is to ignore most actions
  // and then turn the partner logo on/off depending on the state
  // however for top petitions, and petition loading
  // we need to see if we should show a logo or not
  // If there are other 'megapartner' pages where we show a logo
  // then we should add loading of their data here, as well
  // This is a little icky, because it should relate to the view
  // more than what data we load, but we are taking the perspective
  // that the actions are about changing the 'presentation' state
  // rather than the actions being pure 'model' interfaces
  let petition = null
  switch (action.type) {
    case petitionActionTypes.FETCH_PETITION_SUCCESS:
      petition = action.petition
      break
    case petitionActionTypes.FETCH_TOP_PETITIONS_SUCCESS:
      petition = action.petitions[0]
      break
    default:
      break
  }
  if (petition) {
    const creator = ((petition._embedded && petition._embedded.creator) || {})
    if (creator.organization_logo_image_url) {
      return Object.assign({}, state, { partnerCobrand: {
        logo: creator.organization_logo_image_url,
        name: creator.organization,
        url: creator.organization_url
      } })
    } // else
    return Object.assign({}, state, { partnerCobrand: null })
  }
  return state
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
      return Object.assign({}, state, {
        petitions: Object.assign(
          {}, state.petitions, {
            // key it both by id and by slug, for different lookup needs
            [slug]: petition,
            [petition.petition_id]: petition
          }
        )
      })
    case petitionActionTypes.PETITION_SIGNATURE_SUCCESS:
      updateData = {
        signatureStatus: Object.assign(
          {}, state.signatureStatus, { [petition.petition_id]: 'success' })
      }
      if (action.messageId) {
        updateData.signatureMessages = Object.assign(
          {}, state.signatureMessages, { [petition.petition_id]: action.messageId })
      }
      if (state.nextPetitionsLoaded) {
        updateData.nextPetitions = state.nextPetitions.filter(petId => petId !== petition.petition_id)
      }
      return Object.assign({}, state, updateData)
    case petitionActionTypes.FETCH_PETITION_SIGNATURES_SUCCESS:
      petition.total_signatures = signatures.count
      return Object.assign({}, state, {
        petitionSignatures: Object.assign(
          {}, state.petitionSignatures, {
            [slug]: Object.assign(
              {}, state.petitionSignatures[slug],
              {
                // eslint-disable-next-line no-underscore-dangle
                [page]: signatures._embedded.map((signature) =>
                  // eslint-disable-next-line no-underscore-dangle
                  Object.assign(signature, { user: signature._embedded.user })
                )
              }
            )
          }
        ),
        petitions: Object.assign(
          {}, state.petitions, {
            [slug]: petition,
            [petition.petition_id]: petition
          }
        )
      })
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
        topPetitions: Object.assign({}, state.topPetitions, {
          [topPetitionsKey]: petitions.map(topPetition => topPetition.petition_id)
        }),
        nextPetitionsLoaded: true
      }
      updateData.nextPetitions = state.nextPetitions.concat(
        petitions.map(topPetition => topPetition.petition_id)
      ).filter((petId, i, list) => (
        i === list.indexOf(petId) // make each item unique on the list
          && !(petId in state.signatureStatus || updateData.petitions[petId].signed) // exclude signed
      ))
      return Object.assign({}, state, updateData)
    default:
      return state
  }
}

function userReducer(state = initialUserState, action) {
  // fold in tokens at the top, since it's possible it's for everyone
  const newData = Object.assign({}, action.tokens || {})
  switch (action.type) {
    case sessionActionTypes.UNRECOGNIZE_USER_SESSION:
      return { anonymous: true } // Purposefully destroying current state
    case sessionActionTypes.ANONYMOUS_SESSION_START:
      newData.anonymous = true
      return Object.assign({}, state, newData)
    // NOTE: the next 4 cases depend on switch-case fall-through
    // there are no breaks purposefully
    case sessionActionTypes.USER_SESSION_START:
    case sessionActionTypes.TOKEN_SESSION_START:
      if (action.session) {
        // this should cover any of: given_name, last_name, full_name, etc
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
    // no break here: fall through to the failures
    case sessionActionTypes.USER_SESSION_FAILURE:
    case sessionActionTypes.TOKEN_SESSION_FAILURE:
      return Object.assign({}, state, newData)
    case petitionActionTypes.PETITION_SIGNATURE_SUBMIT:
      // if it's an anonymous user or we get useful session information
      // then copy it into userData
      if (!state.full_name
          && action.signature && action.signature.person) {
        if (action.signature.person.full_name) {
          newData.full_name = action.signature.person.full_name
        }
        if (action.signature.person.email_addresses
            && action.signature.person.email_addresses.length) {
          newData.email = action.signature.person.email_addresses[0]
          // TODO: possibly generate an md5hash here
        }
        if (action.signature.person.postal_addresses
            && action.signature.person.postal_addresses.length) {
          const address = action.signature.person.postal_addresses[0]
          newData.zip = address.postal_code
          newData.state = address.region
          newData.country = address.country_name
        }
        return Object.assign({}, state, newData)
      }
      return state
    default:
      return state
  }
}

const rootReducer = combineReducers({
  navStore: navReducer,
  petitionStore: petitionReducer,
  userStore: userReducer
})

export default rootReducer
