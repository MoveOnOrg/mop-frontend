import 'whatwg-fetch'
import { navOrg } from '../selectors/nav'

import Config from '../config.js'


export const actionTypes = {
  FETCH_ORG_REQUEST: 'FETCH_ORG_REQUEST',
  FETCH_ORG_SUCCESS: 'FETCH_ORG_SUCCESS',
  FETCH_ORG_FAILURE: 'FETCH_ORG_FAILURE'
}

export function loadOrganization(slug, forceReload) {
  const urlKey = `organizations/${slug}`
  if (global && global.preloadObjects && global.preloadObjects[urlKey]) {
    return (dispatch) => {
      dispatch({
        type: actionTypes.FETCH_ORG_SUCCESS,
        org: window.preloadObjects[urlKey],
        slug
      })
    }
  }
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.FETCH_ORG_REQUEST,
      slug
    })
    const state = getState()
    const org = navOrg(state, slug)

    if (!forceReload && org) {
      return dispatch({
        type: actionTypes.FETCH_ORG_SUCCESS,
        org,
        slug
      })
    }
    return fetch(`${Config.API_URI}/api/v1/${urlKey}.json`)
      .then(
        (response) => response.json().then((json) => {
          dispatch({
            type: actionTypes.FETCH_ORG_SUCCESS,
            org: json,
            slug: json.name || slug
          })
        }),
        (err) => {
          dispatch({
            type: actionTypes.FETCH_ORG_FAILURE,
            error: err,
            slug
          })
        }
      )
  }
}
