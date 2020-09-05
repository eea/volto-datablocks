import {
  SET_QUERY_PARAM,
  DELETE_QUERY_PARAM,
  TRIGGER_RENDER,
  RESET_QUERY_PARAM,
} from '../constants';

const initialState = {
  search: {
    siteInspireId: 'IT.CAED/640462001.SITE',
  },
  deletedQueryParams: {},
  counter: 0,
  lastAction: '',
};

export default function pages(state = initialState, action = {}) {
  let search = { ...state.search };
  let deletedQueryParams = { ...state.deletedQueryParams };
  switch (action.type) {
    case SET_QUERY_PARAM:
      if (typeof action.queryParam === 'string') {
        search[action.queryParam] = action.value;
        delete deletedQueryParams[action.queryParam];
      } else if (
        typeof action.queryParam === 'object' &&
        Object.keys(action.queryParam).length > 0
      ) {
        action.queryParam &&
          Object.entries(action.queryParam).forEach(([key, value]) => {
            search[key] = value;
            delete deletedQueryParams[key];
          });
      }
      return {
        ...state,
        search,
        deletedQueryParams,
        counter: state.counter + 1,
        lastAction: 'SET_QUERY_PARAM',
      };
    case DELETE_QUERY_PARAM:
      if (Array.isArray(action.queryParam)) {
        action.queryParam.forEach((param) => {
          delete search?.[param];
          deletedQueryParams[param] = true;
        });
      } else {
        delete search?.[action.queryParam];
        deletedQueryParams[action.queryParam] = true;
      }
      return {
        ...state,
        search,
        deletedQueryParams,
        counter: state.counter + 1,
        lastAction: 'DELETE_QUERY_PARAM',
      };
    case RESET_QUERY_PARAM:
      if (Array.isArray(action.queryParam)) {
        action.queryParam.forEach((param) => {
          delete search?.[param];
          deletedQueryParams[param] = true;
        });
      } else {
        delete search?.[action.queryParam];
        deletedQueryParams[action.queryParam] = true;
      }
      return {
        ...state,
        search: {},
        deletedQueryParams: {},
        counter: 0,
        lastAction: 'RSET',
      };
    case `${TRIGGER_RENDER}`:
      return {
        ...state,
        counter: state.counter + 1,
        lastAction: 'TRIGGER_RENDER',
      };
    default:
      return state;
  }
}
