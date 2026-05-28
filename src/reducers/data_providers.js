/**
 * Data Providers reducer
 * @module reducers/data_providers
 */

import hash from 'object-hash';
import without from 'lodash/without';
import { GET_CONTENT } from '@plone/volto/constants/ActionTypes';
import { GET_DATA_FROM_PROVIDER } from '@eeacms/volto-datablocks/constants';
import { getProviderUrl } from '@eeacms/volto-datablocks/helpers';

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
  let providerPath, hashValue, path, results, metadata;
  const pendingConnectors = { ...state.pendingConnectors };
  const failedConnectors = { ...state.failedConnectors };
  const tree = { ...state.tree };

  if (action.type === `${GET_CONTENT}_SUCCESS`) {
    const connector = action.result?.['@components']?.['connector-data'] || {};
    const payload = connector.payload || {};

    if (!connector.data) {
      return state;
    }

    hashValue = hash(hash(payload.form) + hash(payload.data_query));
    providerPath = getProviderUrl(connector.path);
    path = `${providerPath}${hashValue ? `#${hashValue}` : ''}`;
    results = connector.data.results;
    metadata = connector.data.metadata;
  } else {
    providerPath = action.path;
    hashValue = action.hashValue;

    path = `${providerPath}${hashValue ? `#${hashValue}` : ''}`;

    results = action.result?.data?.results;
    metadata = action.result?.data?.metadata;
  }

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

    case `${GET_CONTENT}_SUCCESS`:
    case `${GET_DATA_FROM_PROVIDER}_SUCCESS`:
      delete pendingConnectors[path];
      if (!tree[providerPath]) {
        tree[providerPath] = [];
      }
      if (!tree[providerPath].includes(hashValue)) {
        tree[providerPath].push(hashValue);
      }
      const providerData = state.data[providerPath] || {};
      // if (tree[providerPath].length > MAX_DATA_PER_PROVIDER) {
      //   delete providerData[tree[providerPath].shift()];
      // }
      return {
        ...state,
        error: null,
        data: {
          ...state.data,
          [providerPath]: {
            ...providerData,
            [hashValue]: results,
          },
        },
        metadata: {
          ...state.metadata,
          [providerPath]: {
            ...providerData,
            [hashValue]: metadata,
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
