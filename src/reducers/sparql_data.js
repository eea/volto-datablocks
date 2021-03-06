import { GET_SPARQL_DATA } from '../constants';

const initialState = {
  error: null,
  attachments: [],
  loaded: false,
  loading: false,
};

export default function sparql_data(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_SPARQL_DATA}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };

    case `${GET_SPARQL_DATA}_SUCCESS`:
      return {
        ...state,
        error: null,
        sparql_data: action.result.items,
        loaded: true,
        loading: false,
      };

    case `${GET_SPARQL_DATA}_FAIL`:
      return {
        ...state,
        error: action.error,
        sparq_data: [],
        loaded: false,
        loading: false,
      };

    default:
      return state;
  }
}
