import {
  SET_CONNECTED_DATA_PARAMETERS,
  DELETE_CONNECTED_DATA_PARAMETERS,
  SET_UNSAVED_QUERIES,
} from '../constants';

export function setConnectedDataParameters(providerPath, data_query, index) {
  return {
    type: SET_CONNECTED_DATA_PARAMETERS,
    providerPath,
    data_query,
    index,
  };
}

export function deleteConnectedDataParameters(providerPath, index) {
  return {
    type: DELETE_CONNECTED_DATA_PARAMETERS,
    providerPath,
    index,
  };
}

export const setUnsavedDataQueries = (unsavedQueries) => {
  return {
    type: SET_UNSAVED_QUERIES,
    payload: unsavedQueries,
  };
};
