/**
 * Data Providers reducer
 * @module reducers/data_providers
 */

import { settings } from '~/config';
import { GET_DATA_FROM_PROVIDER } from '../constants';
import { without } from 'lodash';

const initialState = {
  error: null,
  data: {},
  loaded: false,
  loading: false,
  requested: [],
};

export default function data_providers(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_DATA_FROM_PROVIDER}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
        requested: [...without(state.requested, action.path), action.path],
      };
    case `${GET_DATA_FROM_PROVIDER}_SUCCESS`:
      const isExpand =
        (action.result['@components'] &&
          action.result['@components']['connector-data'] &&
          action.result['@components']['connector-data']['@id'] &&
          true) ||
        false;
      const id = (isExpand
        ? action.result['@components']['connector-data']['@id']
        : action.result['@id']
      )
        .replace(settings.apiPath, '')
        .replace(settings.internalApiPath, '');
      return {
        ...state,
        error: null,
        data: {
          ...state.data,
          [id]: isExpand
            ? action.result['@components']['connector-data'].data
            : action.result.data,
        },
        loaded: true,
        loading: false,
        requested: [...without(state.requested, action.path)],
      };
    case `${GET_DATA_FROM_PROVIDER}_FAIL`:
      return {
        ...state,
        error: action.error,
        data: { ...state.data },
        loaded: false,
        loading: false,
        // TODO: retry get?
        requested: [...without(state.requested, action.path)],
      };
    default:
      return state;
  }
}
