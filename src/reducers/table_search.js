const initialState = {
  loading: false,
  results: [],
  value: '',
  payload: {},
};

function table_search(state = initialState, action) {
  switch (action.type) {
    case 'TABLE_CLEAN_QUERY':
      return initialState;
    case 'TABLE_START_SEARCH':
      return { ...state, loading: true, value: action.query };
    case 'TABLE_FINISH_SEARCH':
      return {
        ...state,
        loading: false,
        results: [...action.results],
        payload: { ...(action.payload || {}) },
      };
    case 'TABLE_UPDATE_SELECTION':
      return { ...state, value: action.selection };

    default:
      return state;
  }
}

export default table_search;
