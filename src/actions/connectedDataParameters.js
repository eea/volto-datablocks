import {
  SET_CONNECTED_DATA_PARAMETERS,
  DELETE_CONNECTED_DATA_PARAMETERS,
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
