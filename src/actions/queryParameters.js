import {
  SET_DISCODATA_QUERY,
  DELETE_QUERY_PARAM,
  SET_QUERY_PARAM,
  RESET_QUERY_PARAM,
  TRIGGER_RENDER,
} from '@eeacms/volto-datablocks/constants';

export function setDiscodataQuery(query) {
  return {
    type: SET_DISCODATA_QUERY,
    query,
  };
}

export function setQueryParam({ queryParam }) {
  return {
    type: SET_QUERY_PARAM,
    queryParam,
  };
}

export function deleteQueryParam({ queryParam }) {
  return {
    type: DELETE_QUERY_PARAM,
    queryParam,
  };
}

export function resetQueryParam() {
  return {
    type: RESET_QUERY_PARAM,
  };
}

export function triggerQueryRender() {
  return {
    type: TRIGGER_RENDER,
  };
}
