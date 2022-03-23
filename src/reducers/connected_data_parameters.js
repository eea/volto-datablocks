/**
 * Data Providers reducer
 * @module reducers/data_providers
 */
import { flattenToAppURL } from '@plone/volto/helpers';
import {
  SET_CONNECTED_DATA_PARAMETERS,
  DELETE_CONNECTED_DATA_PARAMETERS,
  // SET_ROUTE_PARAMETER,
  // DELETE_ROUTE_PARAMETER,
} from '../constants';

const initialState = {
  byProviderPath: {},
  byContextPath: {},
  byRouteParameters: {},
};

export default function connected_data_parameters(
  state = initialState,
  action = {},
) {
  // let byRouteParameters;
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
    // case SET_ROUTE_PARAMETER:
    //   byRouteParameters = {
    //     ...state.byRouteParameters,
    //     [action.path]: [...(state.byRouteParameters[action.path] || [])],
    //   };
    //   byRouteParameters[action.path][action.index] = action.parameter;
    //   return {
    //     ...state,
    //     byRouteParameters,
    //   };
    // case DELETE_ROUTE_PARAMETER:
    //   byRouteParameters = {
    //     ...state.byRouteParameters,
    //   };
    //   if (byRouteParameters?.[action.path]?.length > 1) {
    //     delete byRouteParameters?.[action.path]?.[action.index];
    //   } else {
    //     delete byRouteParameters?.[action.path];
    //   }
    //   return {
    //     ...state,
    //     byRouteParameters,
    //   };
    case 'GET_CONTENT_SUCCESS':
      const content = action.result;

      if (!content) return state;

      path = flattenToAppURL(content['@id']);

      if (!content.data_query) {
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
          [path]: content.data_query,
        },
      };

    default:
      return state;
  }
}
