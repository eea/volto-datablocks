/**
 * Data Providers reducer
 * @module reducers/data_providers
 */

import { GET_DATA_FROM_PROVIDER } from '../constants';

const initialState = {
  error: null,
  item: {},
  loaded: false,
  loading: false,
};

export default function data_providers(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_DATA_FROM_PROVIDER}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${GET_DATA_FROM_PROVIDER}_SUCCESS`:
      return {
        ...state,
        error: null,
        item: action.result['@components']?.['connector-data']?.data || [],
        loaded: true,
        loading: false,
      };
    case `${GET_DATA_FROM_PROVIDER}_FAIL`:
      return {
        ...state,
        error: action.error,
        item: {},
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
}
