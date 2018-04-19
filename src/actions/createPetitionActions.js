import 'whatwg-fetch'
import Config from '../config.js'

export const actionTypes = {
  CREATE_PETITION_PREVIEW_SUBMIT: 'CREATE_PETITION_PREVIEW_SUBMIT',
  FETCH_TARGETS_REQUEST: 'FETCH_TARGETS_REQUEST',
  FETCH_TARGETS_SUCCESS: 'FETCH_TARGETS_SUCCESS',
  FETCH_TARGETS_FAILURE: 'FETCH_TARGETS_FAILURE'
}

export function previewSubmit({ title, summary, description, target }) {
  return {
    type: actionTypes.CREATE_PETITION_PREVIEW_SUBMIT,
    title,
    summary,
    description,
    target
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


    return fetch(url)
      .then(
        (response) => response.json().then((json) => {
          dispatch({
            type: actionTypes.FETCH_TARGETS_SUCCESS,
            targets: json,
            group,
            geoState,
            storeKey
          })
        }),
        (err) => {
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
