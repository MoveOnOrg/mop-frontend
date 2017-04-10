import { bindActionCreators } from 'redux';
import Config from '../config.js';

export const actionTypes = {
  'FETCH_PETITION_REQUEST': 'FETCH_PETITION_REQUEST',
  'FETCH_PETITION_SUCCESS': 'FETCH_PETITION_SUCCESS',
  'FETCH_PETITION_FAILURE': 'FETCH_PETITION_FAILURE',

  'PETITION_SIGNATURE_SUBMIT': 'PETITION_SIGNATURE_SUBMIT',
  'PETITION_SIGNATURE_SUCCESS': 'PETITION_SIGNATURE_SUCCESS',
  'PETITION_SIGNATURE_FAILURE': 'PETITION_SIGNATURE_FAILURE'
};

let API_URI = Config.API_URI;

export function loadPetition (petitionSlug) {
  return (dispatch) => {
    console.log('from actions/loadPetition');
    dispatch({
      'type': actionTypes.FETCH_PETITION_REQUEST,
      'slug': petitionSlug
    });
    let urlKey = 'petitions/' + petitionSlug;
    if (window.preloadObjects && window.preloadObjects[urlKey]) {
      console.log('using preloadedData');
      dispatch({
        'type': actionTypes.FETCH_PETITION_SUCCESS,
        'petition': window.preloadObjects[urlKey]
      });
    } else {
      fetch(API_URI + '/api/v1/' + urlKey + '.json')
        .then(
          (response) => {
            return response.json();
          },
          (err) => {
            dispatch({
              'type': actionTypes.FETCH_PETITION_FAILURE,
              'error': err,
              'slug': petitionSlug
            });
          }
        ).then((json) => {
          dispatch({
            'type': actionTypes.FETCH_PETITION_SUCCESS,
            'petition': json,
            'slug': petitionSlug
          });
        });
    }
  };
};

export function signPetition (dispatch) {
  return (petitionSignature, petition) => {
    console.log('from actions/signPetition', petition, petitionSignature);
    dispatch({
      'type': actionTypes.PETITION_SIGNATURE_SUBMIT,
      'petition': petition,
      'signature': petitionSignature
    });
    //TODO: actually submit signature
    dispatch({
      'type': actionTypes.PETITION_SIGNATURE_SUCCESS,
      'petition': petition,
      'signature': petitionSignature
    });
  }
}


export const actions = {
  loadPetition,
  signPetition
};
