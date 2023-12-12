/**
 * Data Providers reducer
 * @module reducers/data_providers
 */
import { flattenToAppURL } from '@plone/volto/helpers';
import {
  SET_CONNECTED_DATA_PARAMETERS,
  DELETE_CONNECTED_DATA_PARAMETERS,
  SET_UNSAVED_CONNECTED_DATA_PARAMETERS,
} from '../constants';

const initialState = {
  byProviderPath: {},
  byContextPath: {},
};

export default function connected_data_parameters(
  state = initialState,
  action = {},
) {
  let path, byProviderPath;
  const { providerPath, data_query, index } = action;
  switch (action.type) {
    case SET_CONNECTED_DATA_PARAMETERS:
      return {
        ...state,
        byProviderPath: {
          ...state.byProviderPath,
          [providerPath]: {
            ...(state.byProviderPath[providerPath] || {}),
            [index]: { ...(data_query || {}) },
          },
        },
      };
    case DELETE_CONNECTED_DATA_PARAMETERS:
      byProviderPath = {
        ...state.byProviderPath,
      };
      if (byProviderPath?.[providerPath]?.[index]) {
        delete byProviderPath[providerPath][index];
      }
      return {
        ...state,
        byProviderPath,
      };
    case 'GET_CONTENT_SUCCESS':
      const contentSuccess = action.result;

      if (!contentSuccess) return state;

      path = flattenToAppURL(contentSuccess['@id']);

      if (!contentSuccess.data_query) {
        const byContextPath = { ...(state.byContextPath || {}) };
        delete byContextPath[path];
        return {
          ...state,
          byContextPath,
        };
      }

      return {
        ...state,
        byContextPath: {
          ...state.byContextPath,
          [path]: contentSuccess.data_query,
        },
      };
    case SET_UNSAVED_CONNECTED_DATA_PARAMETERS:
      const contentUnsaved = action.payload;

      if (!contentUnsaved) return state;

      path = flattenToAppURL(contentUnsaved['@id']);

      if (!contentUnsaved.data_query) {
        const byContextPath = { ...(state.byContextPath || {}) };
        delete byContextPath[path];
        return {
          ...state,
          byContextPath,
        };
      }

      return {
        ...state,
        byContextPath: {
          ...state.byContextPath,
          [path]: contentUnsaved.data_query,
        },
      };

    default:
      return state;
  }
}
