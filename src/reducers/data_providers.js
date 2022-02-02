/**
 * Data Providers reducer
 * @module reducers/data_providers
 */

import { GET_DATA_FROM_PROVIDER } from '../constants';
import { without } from 'lodash';

const MAX_DATA_PER_PROVIDER = 10;

const initialState = {
  error: null,
  data: {},
  metadata: {},
  loaded: false,
  loading: false,
  pendingConnectors: {},
  failedConnectors: {},
  requested: [],
  tree: {},
};

export default function data_providers(state = initialState, action = {}) {
  const pendingConnectors = { ...state.pendingConnectors };
  const failedConnectors = { ...state.failedConnectors };
  const tree = { ...state.tree };
  const providerPath = action.path;
  const hashValue = action.hashValue;

  const path = `${providerPath}${hashValue ? `#${hashValue}` : ''}`;

  switch (action.type) {
    case `${GET_DATA_FROM_PROVIDER}_PENDING`:
      pendingConnectors[path] = true;
      delete failedConnectors[path];

      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
        requested: [...without(state.requested, action.path), action.path],
        pendingConnectors,
        failedConnectors,
      };

    case `${GET_DATA_FROM_PROVIDER}_SUCCESS`:
      delete pendingConnectors[path];
      if (!tree[providerPath]) {
        tree[providerPath] = [];
      }
      tree[providerPath].push(hashValue);
      const providerData = state.data[providerPath] || {};
      if (tree[providerPath].length > MAX_DATA_PER_PROVIDER) {
        delete providerData[tree[providerPath].shift()];
      }
      return {
        ...state,
        error: null,
        data: {
          ...state.data,
          [providerPath]: {
            ...providerData,
            [hashValue]: action.result.data.results,
          },
        },
        metadata: {
          ...state.metadata,
          [providerPath]: {
            ...providerData,
            [hashValue]: action.result.data.metadata,
          },
        },
        loaded: true,
        loading: false,
        requested: [...without(state.requested, path)],
        pendingConnectors,
        failedConnectors,
        tree,
      };

    case `${GET_DATA_FROM_PROVIDER}_FAIL`:
      delete pendingConnectors[path];
      failedConnectors[path] = true;

      return {
        ...state,
        error: action.error,
        loaded: false,
        loading: false,
        // TODO: retry get?
        requested: [...without(state.requested, path)],
        pendingConnectors,
        failedConnectors,
      };

    default:
      return state;
  }
}
