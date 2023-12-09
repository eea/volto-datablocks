import { RESET_UNSAVED_QUERIES, SET_UNSAVED_QUERIES } from '../constants';

export const setUnsavedDataQueries = (unsavedQueries) => ({
  type: SET_UNSAVED_QUERIES,
  payload: unsavedQueries,
});

export const resetUnsavedDataQueries = () => ({
  type: RESET_UNSAVED_QUERIES,
});
