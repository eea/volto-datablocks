import { SET_ROUTE_PARAMETER, DELETE_ROUTE_PARAMETER } from '../constants';

const initialState = {};

export default function connected_data_parameters(
  state = initialState,
  action = {},
) {
  const newParams = { ...state };

  switch (action.type) {
    case SET_ROUTE_PARAMETER:
      newParams[action.parameter] = action.value;
      return {
        ...newParams,
      };
    case DELETE_ROUTE_PARAMETER:
      delete newParams[action.parameter];
      return {
        ...newParams,
      };

    default:
      return state;
  }
}
