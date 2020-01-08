/**
 * Data Providers reducer
 * @module reducers/data_providers
 */

import { SET_CONNECTED_DATA_PARAMETERS } from '../constants';

const initialState = {
  byPath: {},
};

export default function connected_data_parameters(
  state = initialState,
  action = {},
) {
  switch (action.type) {
    case SET_CONNECTED_DATA_PARAMETERS:
      return {
        ...state,
        byPath: {
          ...state.byPath,
          [action.path]: action.manuallySet
            ? action.parameters
            : state.byPath[action.path] || action.parameters,
        },
      };
    default:
      return state;
  }
}
