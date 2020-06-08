/**
 * Data Providers reducer
 * @module reducers/data_providers
 */

import { SET_CONNECTED_DATA_PARAMETERS } from '../constants';
import { getBasePath } from 'volto-datablocks/helpers';

const initialState = {
  byProviderPath: {},
  byContextPath: {},
  byPath: {}
};

export default function connected_data_parameters(
  state = initialState,
  action = {},
) {
  let path;

  switch (action.type) {
    case SET_CONNECTED_DATA_PARAMETERS:
      return {
        ...state,
        byPath: {
          ...state.byPath,
          [action.path]: {
            ...state.byPath[action.path],
            override: action.parameters,
          },
        },
      };

    case 'GET_CONTENT_SUCCESS':
    case 'PREFETCH_ROUTER_LOCATION_CHANGE_SUCCESS':
      // TODO: ignore subrequests

      const content = action.result;

      if (!(content && content.data_query)) return state;

      path = getBasePath(content['@id']);

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
