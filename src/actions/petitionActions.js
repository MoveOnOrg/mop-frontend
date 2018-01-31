import 'whatwg-fetch'

import Config from '../config.js'
import { appLocation } from '../routes.js'

export const actionTypes = {
  FETCH_PETITION_REQUEST: 'FETCH_PETITION_REQUEST',
  FETCH_PETITION_SUCCESS: 'FETCH_PETITION_SUCCESS',
  FETCH_PETITION_FAILURE: 'FETCH_PETITION_FAILURE',

  FETCH_PETITION_SIGNATURES_REQUEST: 'FETCH_PETITION_SIGNATURES_REQUEST',
  FETCH_PETITION_SIGNATURES_SUCCESS: 'FETCH_PETITION_SIGNATURES_SUCCESS',
  FETCH_PETITION_SIGNATURES_FAILURE: 'FETCH_PETITION_SIGNATURES_FAILURE',

  FETCH_TOP_PETITIONS_REQUEST: 'FETCH_TOP_PETITIONS_REQUEST',
  FETCH_TOP_PETITIONS_SUCCESS: 'FETCH_TOP_PETITIONS_SUCCESS',
  FETCH_TOP_PETITIONS_FAILURE: 'FETCH_TOP_PETITIONS_FAILURE',

  SEARCH_PETITIONS_REQUEST: 'SEARCH_PETITIONS_REQUEST',
  SEARCH_PETITIONS_SUCCESS: 'SEARCH_PETITIONS_SUCCESS',
  SEARCH_PETITIONS_FAILURE: 'SEARCH_PETITIONS_FAILURE',

  PETITION_SIGNATURE_SUBMIT: 'PETITION_SIGNATURE_SUBMIT',
  PETITION_SIGNATURE_SUCCESS: 'PETITION_SIGNATURE_SUCCESS',
  PETITION_SIGNATURE_FAILURE: 'PETITION_SIGNATURE_FAILURE',

  FEEDBACK_SUCCESS: 'FEEDBACK_SUCCESS',
  FEEDBACK_FAILURE: 'FEEDBACK_FAILURE'
}

export function loadPetition(petitionSlug, forceReload) {
  const urlKey = `petitions/${petitionSlug}`
  if (global && global.preloadObjects && global.preloadObjects[urlKey]) {
    return (dispatch) => {
      dispatch({
        type: actionTypes.FETCH_PETITION_SUCCESS,
        petition: window.preloadObjects[urlKey],
        slug: petitionSlug
      })
    }
  }
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.FETCH_PETITION_REQUEST,
      slug: petitionSlug
    })
    const { petitionStore } = getState()
    if (!forceReload
        && petitionStore
        && petitionStore.petitions
        && petitionStore.petitions[petitionSlug]) {
      return dispatch({
        type: actionTypes.FETCH_PETITION_SUCCESS,
        petition: petitionStore.petitions[petitionSlug],
        slug: petitionSlug
      })
    }
    return fetch(`${Config.API_URI}/${urlKey}.json`)
      .then(
        (response) => response.json().then((json) => {
          dispatch({
            type: actionTypes.FETCH_PETITION_SUCCESS,
            petition: json,
            slug: json.name || petitionSlug
          })
        }),
        (err) => {
          dispatch({
            type: actionTypes.FETCH_PETITION_FAILURE,
            error: err,
            slug: petitionSlug
          })
        }
      )
  }
}

export function searchPetitions(query, pageNumber, selectState) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.SEARCH_PETITIONS_REQUEST,
      query, pageNumber, selectState
    })

    const page = pageNumber ? `&page=${pageNumber}` : ''

    const selState = selectState ? `&state=${selectState}` : ''

    return fetch(`${Config.API_URI}/search/petitions.json?q=${query}${selState}${page}`)
      .then(
        (response) => response.json().then((json) => {
          dispatch({
            type: actionTypes.SEARCH_PETITIONS_SUCCESS,
            searchResults: json,
            pageNumber: page,
            query,
            selectState: selState
          })
        }),
        (err) => {
          dispatch({
            type: actionTypes.SEARCH_PETITIONS_FAILURE,
            error: err
          })
        }
      )
  }
}


export function loadTopPetitions(pac, megapartner, forceReload) {
  // topPetitionsKey must not just be truthily equal but exact
  // eslint-disable-next-line no-unneeded-ternary
  const topPetitionsKey = `${pac ? 1 : 0}--${megapartner ? megapartner : ''}`
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.FETCH_TOP_PETITIONS_REQUEST,
      topPetitionsKey
    })
    const { userStore, petitionStore } = getState()
    if (!forceReload
        && petitionStore
        && petitionStore.topPetitions
        && petitionStore.topPetitions[topPetitionsKey]) {
      return dispatch({
        type: actionTypes.FETCH_TOP_PETITIONS_SUCCESS,
        useCache: true,
        topPetitionsKey
      })
    }
    const query = []
    if (pac !== null) {
      query.push(`pac=${pac ? 1 : 0}`)
    }
    if (megapartner) {
      query.push(`megapartner=${megapartner}`)
    }
    if (userStore && userStore.signonId) {
      query.push(`user=${userStore.signonId}`)
    }
    const queryString = ((query.length) ? `?${query.join('&')}` : '')
    return fetch(`${Config.API_URI}/top-petitions.json${queryString}`)
      .then(
        (response) => response.json().then((json) => {
          dispatch({
            type: actionTypes.FETCH_TOP_PETITIONS_SUCCESS,
            petitions: json._embedded,
            topPetitionsKey
          })
        }),
        (err) => {
          dispatch({
            type: actionTypes.FETCH_TOP_PETITIONS_FAILURE,
            error: err,
            topPetitionsKey
          })
        }
      )
  }
}

export const registerSignatureAndThanks = (petition, signature) => () => {
  // 1. track petition success
  if (window.fbq) {
    window.fbq('track', 'Lead') // facebook lead
  }
  if (window.gtag && petition.gtag_keys) {
    // https://developers.google.com/adwords-remarketing-tag/
    window.gtag('event', 'conversion', { send_to: petition.gtag_keys })
  }
  // 2. show thanks page
  let thanksUrl = '/thanks.html'
  if (petition.thanks_url) {
    if (/^https?:\/\//.test(petition.thanks_url)) {
      document.location = petition.thanks_url // FUTURE: maybe add some query params
      return
    }
    thanksUrl = petition.thanks_url
  }
  const { referrer_data: { source } = {} } = signature
  const fromSource = (source ? `&from_source=${encodeURIComponent(source)}` : '')
  appLocation.push(`${thanksUrl}?petition_id=${
    petition.petition_id
  }&name=${petition.name}${fromSource}`)
}

export function signPetition(petitionSignature, petition, options) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.PETITION_SIGNATURE_SUBMIT,
      petition,
      signature: petitionSignature
    })

    const completion = (data) => {
      const finalDispatch = (json) => {
        const dispatchData = {
          type: actionTypes.PETITION_SIGNATURE_SUCCESS,
          petition,
          signature: petitionSignature
        }
        if (json && json.SendMessageResponse) {
          const sqsResponse = json.SendMessageResponse.SendMessageResult
          if (sqsResponse) {
            dispatchData.messageId = sqsResponse.MessageId
            dispatchData.messageMd5 = sqsResponse.MD5OfMessageBody
            // If Error, should we return FAILURE instead?
            dispatchData.messageError = (sqsResponse.Error
                                         && sqsResponse.Error.Message)
          }
        }
        const dispatchResult = dispatch(dispatchData)
        if (options && options.redirectOnSuccess) {
          registerSignatureAndThanks(dispatchResult.petition, dispatchResult.signature)(dispatch)
        }
      }
      if (data && typeof data.json === 'function') {
        data.json().then(finalDispatch, finalDispatch)
      } else {
        finalDispatch()
      }
    }
    if (Config.API_WRITABLE) {
      const signingEndpoint = ((Config.API_SIGN_PETITION)
                               ? Config.API_SIGN_PETITION
                               : `${Config.API_URI}/signatures.json`)
      const fetchArgs = {
        method: 'POST',
        body: JSON.stringify(petitionSignature),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
      if (Config.API_WRITABLE === 'fake') {
        fetchArgs.method = 'GET'
        delete fetchArgs.body
      }
      fetch(signingEndpoint, fetchArgs)
        .then(completion, (err) => {
          dispatch({
            type: actionTypes.PETITION_SIGNATURE_FAILURE,
            petition,
            signature: petitionSignature,
            error: err
          })
        })
    } else {
      completion()
    }
  }
}

export const recordShareClick = (petition, medium, source, user) => {
  if (window._gaq) {
    window._gaq.push(['_trackEvent', 'share', medium, petition.petition_id, 1])
  }
  if (Config.TRACK_SHARE_URL) {
    const params = {
      page: window.location.pathname,
      petition_id: petition.petition_id,
      user_id: user && user.signonId,
      medium,
      source
    }
    const form = new FormData()
    Object.keys(params).forEach(p => {
      form.append(p, params[p])
    })
    fetch(Config.TRACK_SHARE_URL, { // "/record_share_click.html"
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      body: form
    })
  }
}

export const loadPetitionSignatures = (petitionSlug, page = 1) => {
  const urlKey = `petitions/${petitionSlug}/signatures`
  return (dispatch) => {
    dispatch({
      type: actionTypes.FETCH_PETITION_SIGNATURES_REQUEST,
      slug: petitionSlug,
      page
    })
    const dispatchError = (err) => {
      dispatch({
        type: actionTypes.FETCH_PETITION_SIGNATURES_FAILURE,
        error: err,
        slug: petitionSlug,
        page
      })
    }
    return fetch(`${Config.API_URI}/${urlKey}.json?per_page=10&page=${page}`)
      .then(
        (response) => response.json().then((json) => {
          dispatch({
            type: actionTypes.FETCH_PETITION_SIGNATURES_SUCCESS,
            signatures: json,
            slug: petitionSlug,
            page
          })
        }, dispatchError),
        dispatchError
      )
  }
}

export const flagPetition = (petitionId, reason) => (dispatch) => {
  const form = new FormData()
  form.append('reason', reason)
  return fetch(`${Config.API_URI}/petitions/${petitionId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Accept: 'application/json'
    },
    body: form
  }).then(
      (response) => {
        dispatch({
          type: actionTypes.FEEDBACK_SUCCESS,
          petitionId,
          reason,
          response })
      },
      (error) => {
        dispatch({
          type: actionTypes.FEEDBACK_FAILURE,
          petitionId,
          reason,
          error })
      }
    )
}

export const flagComment = (commentId) => (dispatch) => {
  const form = new FormData()
  form.append('comment_id', commentId)
  return fetch(`${Config.API_URI}/petitions/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Accept: 'application/json'
    },
    body: form
  }).then(
      (response) => {
        dispatch({
          type: actionTypes.FEEDBACK_SUCCESS,
          commentId,
          response })
      },
      (error) => {
        dispatch({
          type: actionTypes.FEEDBACK_FAILURE,
          commentId,
          error })
      }
    )
}

export const getSharebanditShareLink = (petitionSharebanditUrl) => {
  const jsonSampleUrl = petitionSharebanditUrl.replace('/r/0/', '/jsonaction/')
  const fallbackResponse = () => petitionSharebanditUrl
  return fetch(`${jsonSampleUrl}`).then(
    (success) => success.json().then(
      (jsonData) => jsonData.shareurl,
      fallbackResponse
    ),
    fallbackResponse)
}

export const actions = {
  loadPetition,
  signPetition,
  searchPetitions,
  registerSignatureAndThanks,
  recordShareClick,
  loadPetitionSignatures,
  getSharebanditShareLink
}
