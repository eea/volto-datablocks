import { GET_BLOCKDATA } from '../constants';

export default function blockdata(state = {}, action = {}) {
  let { result } = action;
  switch (action.type) {
    case `${GET_BLOCKDATA}_PENDING`:
      return {
        ...state,
        [action.blockid]: {
          ...state[action.blockid],
          data: null,
          error: null,
          loaded: false,
          loading: true,
        },
      };
    case `${GET_BLOCKDATA}_FAIL`:
      return {
        ...state,
        [action.blockid]: {
          ...state[action.blockid],
          data: null,
          error: action.error,
          loaded: false,
          loading: true,
        },
      };
    case `${GET_BLOCKDATA}_SUCCESS`:
      return {
        ...state,
        [action.blockid]: {
          ...state[action.blockid],
          data: result['data'],
          error: null,
          loaded: true,
          loading: false,
        },
      };
    default:
      return state;
  }
}
