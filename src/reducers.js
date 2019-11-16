import { GET_SPARQL_DATA } from './constants';

const initialState = {
  error: null,
  attachments: [],
  loaded: false,
  loading: false,
};

export function sparql_data(state = initialState, action = {}) {
  console.log('sparql_data reducer');
  switch (action.type) {
    case `${GET_SPARQL_DATA}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };

    case `${GET_SPARQL_DATA}_SUCCESS`:
      console.log('Success getting attachments', action.result);
      return {
        ...state,
        error: null,
        sparql_data: action.result.items,
        // .map(item => ({
        //   ...item,
        //   // url: item['@id'].replace(settings.apiPath, ''),
        // })),
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
