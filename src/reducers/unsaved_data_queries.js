import { RESET_UNSAVED_QUERIES, SET_UNSAVED_QUERIES } from '../constants';

const initialState = [];

export default function unsaved_data_queries(
  state = initialState,
  action = {},
) {
  switch (action.type) {
    case SET_UNSAVED_QUERIES:
      return [...action.payload];

    case RESET_UNSAVED_QUERIES:
      return [];

    default:
      return state;
  }
}
