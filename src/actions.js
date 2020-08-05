import {
  GET_SPARQL_DATA,
  GET_DATA_FROM_PROVIDER,
  CHANGE_SIDEBAR_STATE,
  SET_CONNECTED_DATA_PARAMETERS,
  DELETE_CONNECTED_DATA_PARAMETERS,
  GET_DISCODATA_RESOURCE,
  SET_DISCODATA_QUERY,
  DELETE_QUERY_PARAM,
  SET_QUERY_PARAM,
} from './constants';

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

export function getDataFromProvider(path, filters) {
  // console.log('getDataFromProvider call, ', path, filters);
  return filters
    ? {
        type: GET_DATA_FROM_PROVIDER,
        path: path,
        request: {
          op: 'post',
          path: path + '/@connector-data/',
          data: { query: filters },
        },
      }
    : {
        type: GET_DATA_FROM_PROVIDER,
        path: path,
        request: {
          op: 'get',
          path: path + '/@connector-data/',
        },
      };
}

export function setConnectedDataParameters(
  path,
  parameters,
  index,
  manuallySet = false,
) {
  return {
    type: SET_CONNECTED_DATA_PARAMETERS,
    path,
    parameters,
    index,
    manuallySet,
  };
}

export function deleteConnectedDataParameters(path, index) {
  return {
    type: DELETE_CONNECTED_DATA_PARAMETERS,
    path,
    index,
  };
}

export function getDiscodataResource({
  url,
  resourceKey,
  key,
  search,
  groupBy,
}) {
  return {
    type: GET_DISCODATA_RESOURCE,
    resourceKey,
    key,
    search,
    groupBy,
    request: {
      op: 'get',
      path: url,
    },
  };
}

export function setDiscodataQuery(query) {
  return {
    type: SET_DISCODATA_QUERY,
    query,
  };
}

export function setQueryParam({ queryParam, value }) {
  console.log('SET QUERY PARAM', queryParam);
  return {
    type: SET_QUERY_PARAM,
    queryParam,
    value,
  };
}

export function deleteQueryParam({ queryParam }) {
  console.log('DELETE QUERY PARAM', queryParam);
  return {
    type: DELETE_QUERY_PARAM,
    queryParam,
  };
}
