import {
  GET_SPARQL_DATA,
  CHANGE_SIDEBAR_STATE,
  GET_DISCODATA_RESOURCE,
  SET_DISCODATA_RESOURCE,
  SET_DISCODATA_RESOURCE_PENDING,
  SET_DISCODATA_QUERY,
  DELETE_QUERY_PARAM,
  SET_QUERY_PARAM,
  RESET_QUERY_PARAM,
  TRIGGER_RENDER,
} from 'volto-datablocks/constants';

export * from './getBlockData';
export * from './getDataProvider';
export * from './getRouterParameters';

export function changeSidebarState(open) {
  return {
    type: CHANGE_SIDEBAR_STATE,
    open,
  };
}

export function getSparqlData(path) {
  const url = path + '/@sparql-data';
  return {
    type: GET_SPARQL_DATA,
    request: {
      op: 'get',
      path: url,
    },
  };
}

export function getDiscodataResource({
  url,
  search,
  isCollection,
  resourceKey,
  key,
  groupBy,
  requestsMetadata,
}) {
  return {
    type: GET_DISCODATA_RESOURCE,
    search,
    isCollection,
    resourceKey,
    key,
    groupBy,
    requestsMetadata,
    request: {
      op: 'get',
      path: url,
    },
  };
}

export function setDiscodataResource({ collection, resourceKey, key }) {
  return {
    type: SET_DISCODATA_RESOURCE,
    collection,
    resourceKey,
    key,
  };
}

export function setDiscodataResourcePending({ key }) {
  return {
    type: SET_DISCODATA_RESOURCE_PENDING,
    key,
  };
}

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
