/**
 * Providers reducer
 * @module reducers/metadata_providers
 */

import { GET_PROVIDER_METADATA } from '../constants';
import { getBasePath } from '../helpers';
import { without } from 'lodash';

const initialState = {
  error: null,
  data: {},
  content: {},
  loaded: false,
  loading: false,
  pendingConnectors: {},
  failedConnectors: {},
  requested: [],
};

export default function metadata_providers(state = initialState, action = {}) {
  const pendingConnectors = { ...state.pendingConnectors };
  const failedConnectors = { ...state.failedConnectors };

  switch (action.type) {
    case `${GET_PROVIDER_METADATA}_PENDING`:
      pendingConnectors[action.path] = true;
      delete failedConnectors[action.path];

      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
        requested: [...without(state.requested, action.path), action.path],
        pendingConnectors,
        failedConnectors,
      };

    case `${GET_PROVIDER_METADATA}_SUCCESS`:
      const id = getBasePath(action.result['@id']);
      delete pendingConnectors[action.path];
      return {
        ...state,
        error: null,
        data: {
          ...state.data,
          [id]: {
            Readme: action.result.Readme,
          },
        },
        loaded: true,
        loading: false,
        requested: [...without(state.requested, action.path)],
        pendingConnectors,
        failedConnectors,
      };

    case `${GET_PROVIDER_METADATA}_FAIL`:
      delete pendingConnectors[action.path];
      failedConnectors[action.path] = true;

      return {
        ...state,
        error: action.error,
        data: { ...state.data },
        loaded: false,
        loading: false,
        // TODO: retry get?
        requested: [...without(state.requested, action.path)],
        pendingConnectors,
        failedConnectors,
      };

    default:
      return state;
  }
}
