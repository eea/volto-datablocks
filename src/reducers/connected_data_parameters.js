/**
 * Data Providers reducer
 * @module reducers/data_providers
 */
import { flattenToAppURL } from '@plone/volto/helpers';
import {
  SET_CONNECTED_DATA_PARAMETERS,
  DELETE_CONNECTED_DATA_PARAMETERS,
  SET_ROUTE_PARAMETER,
  DELETE_ROUTE_PARAMETER,
} from '../constants';

const initialState = {
  byProviderPath: {},
  byContextPath: {},
  byPath: {},
  byRouteParameters: {},
};

export default function connected_data_parameters(
  state = initialState,
  action = {},
) {
  let path, byPath, byRouteParameters;

  switch (action.type) {
    case SET_CONNECTED_DATA_PARAMETERS:
      byPath = {
        ...state.byPath,
        [action.path]: {
          ...state.byPath[action.path],
        },
      };
      if (!byPath[action.path].override) byPath[action.path].override = {};
      byPath[action.path].override[action.index] = action.parameters;
      return {
        ...state,
        byPath,
      };
    case DELETE_CONNECTED_DATA_PARAMETERS:
      byPath = {
        ...state.byPath,
      };
      delete byPath?.[action.path]?.override?.[action.index];
      return {
        ...state,
        byPath,
      };
    case SET_ROUTE_PARAMETER:
      byRouteParameters = {
        ...state.byRouteParameters,
        [action.path]: [...(state.byRouteParameters[action.path] || [])],
      };
      byRouteParameters[action.path][action.index] = action.parameter;
      return {
        ...state,
        byRouteParameters,
      };
    case DELETE_ROUTE_PARAMETER:
      byRouteParameters = {
        ...state.byRouteParameters,
      };
      if (byRouteParameters?.[action.path]?.length > 1) {
        delete byRouteParameters?.[action.path]?.[action.index];
      } else {
        delete byRouteParameters?.[action.path];
      }
      return {
        ...state,
        byRouteParameters,
      };
    case 'GET_CONTENT_SUCCESS':
    case 'PREFETCH_ROUTER_LOCATION_CHANGE_SUCCESS':
      // TODO: ignore subrequests

      const content = action.result;

      if (!(content && content.data_query)) return state;

      path = flattenToAppURL(content['@id']);

      return {
        ...state,
        byContextPath: {
          ...state.byContextPath,
          [path]: {
            ...state.byContextPath?.[path],
            default: content.data_query,
          },
        },
      };

    default:
      return state;
  }
}
