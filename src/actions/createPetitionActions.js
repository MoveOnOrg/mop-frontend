import 'whatwg-fetch'
import Config from '../config'
import { appLocation } from '../routes'
import { rejectNetworkErrorsAs500, parseAPIResponse } from '../lib'

export const actionTypes = {
  CREATE_PETITION_PREVIEW_SUBMIT: 'CREATE_PETITION_PREVIEW_SUBMIT',
  CREATE_PETITION_REQUEST: 'CREATE_PETITION_REQUEST',
  CREATE_PETITION_SUCCESS: 'CREATE_PETITION_SUCCESS',
  CREATE_PETITION_FAILURE: 'CREATE_PETITION_FAILURE',
  FETCH_TARGETS_REQUEST: 'FETCH_TARGETS_REQUEST',
  FETCH_TARGETS_SUCCESS: 'FETCH_TARGETS_SUCCESS',
  FETCH_TARGETS_FAILURE: 'FETCH_TARGETS_FAILURE'
}

export function previewSubmit({
  title,
  summary,
  description,
  target,
  source,
  clonedFromId,
  solicitId,
  trackingState
}) {
  return {
    type: actionTypes.CREATE_PETITION_PREVIEW_SUBMIT,
    title,
    summary,
    description,
    target,
    source,
    clonedFromId,
    solicitId,
    trackingState
  }
}

export function submit(newZip) {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.CREATE_PETITION_REQUEST
    })
    if (window.gtag && Config.GTAG_PETITION_CREATE) {
      // https://developers.google.com/adwords-remarketing-tag/
      window.gtag('event', 'conversion', { send_to: Config.GTAG_PETITION_CREATE })
    }

    const { petitionCreateStore: p } = getState()
    const petition = {
      title: p.title,
      summary: p.summary,
      description: p.description,
      targets: p.target
    }
    if (p.source) petition.source = p.source
    if (p.cloned_from_id) petition.cloned_from_id = p.cloned_from_id
    if (p.solicit_id) petition.solicit_id = p.solicit_id

    const body = { petition }

    if (newZip) {
      body.person = {
        postal_addresses: [{ postal_code: newZip }]
      }
    }
    return fetch(`${Config.API_URI}/user/petitions.json`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/hal+json',
        Accept: 'application/hal+json'
      },
      body: JSON.stringify(body)
    })
      .catch(rejectNetworkErrorsAs500)
      .then(parseAPIResponse)
      .then(res => {
        dispatch({
          type: actionTypes.CREATE_PETITION_SUCCESS,
          petition: res
        })
        appLocation.push('/create_finished.html')
      })
      .catch(err => {
        // For now, treat every error as a 500 to just show the error page
        dispatch({
          type: actionTypes.CREATE_PETITION_FAILURE,
          error: { ...err, response_code: 500 }
        })
      })
  }
}

// This thunk is for development when no backend server is running
// It is configured to be used in the component when API_WRITABLE is false
export function devLocalSubmit() {
  return (dispatch, getState) => {
    const { petitionCreateStore: p } = getState()

    const fakePetition = {
      title: p.title,
      summary: p.summary,
      description: p.description,
      target: p.target,
      _links: {}
    }
    dispatch({
      type: actionTypes.CREATE_PETITION_SUCCESS,
      petition: fakePetition
    })
    appLocation.push('/create_finished.html')
  }
}

export function loadTargets(group, geoState) {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.FETCH_TARGETS_REQUEST,
      group,
      geoState
    })
    const { petitionTargetStore } = getState()

    let url = `${Config.API_URI}/targets.json?group=${group}`
    let storeKey = group

    if (group === 'state') {
      url += `&state=${geoState}`
      storeKey += `--${geoState}`
    } else if (group === 'national') {
      url += '&fed=1'
    }
    if (petitionTargetStore && petitionTargetStore[storeKey]) {
      return dispatch({
        type: actionTypes.FETCH_TARGETS_SUCCESS,
        targets: petitionTargetStore[storeKey],
        group,
        geoState,
        storeKey
      })
    }

    return fetch(url).then(
      response =>
        response.json().then(json => {
          dispatch({
            type: actionTypes.FETCH_TARGETS_SUCCESS,
            targets: json,
            group,
            geoState,
            storeKey
          })
        }),
      err => {
        dispatch({
          type: actionTypes.FETCH_TARGETS_FAILURE,
          error: err,
          group,
          geoState
        })
      }
    )
  }
}
