import { SET_ROUTER_PARAMETER, DELETE_ROUTER_PARAMETER } from '../constants';

const initialState = {
  data: {},
};

export default function router_parameters(state = initialState, action = {}) {
  const newData = { ...state.data };

  switch (action.type) {
    case SET_ROUTER_PARAMETER:
      newData[action.parameter] = action.value;
      return {
        ...state,
        data: { ...newData },
      };

    case DELETE_ROUTER_PARAMETER:
      delete newData[action.parameter];
      return {
        ...state,
        data: { ...newData },
      };

    default:
      return state;
  }
}
