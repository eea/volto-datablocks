import { flattenToAppURL } from '@plone/volto/helpers';
import {
  GET_SPARQL_DATA,
  GET_DATA_FROM_PROVIDER,
  CHANGE_SIDEBAR_STATE,
  SET_CONNECTED_DATA_PARAMETERS,
  DELETE_CONNECTED_DATA_PARAMETERS,
  GET_DISCODATA_RESOURCE,
  SET_DISCODATA_RESOURCE,
  SET_DISCODATA_RESOURCE_PENDING,
  SET_DISCODATA_QUERY,
  DELETE_QUERY_PARAM,
  SET_QUERY_PARAM,
  RESET_QUERY_PARAM,
  TRIGGER_RENDER,
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
  path =
    typeof path === 'object'
      ? Array.isArray(path) && path.length
        ? path[0]['@id']
        : path['@id']
      : path;
  path = path && flattenToAppURL(path);
  if (!path)
    return {
      type: GET_DATA_FROM_PROVIDER,
    };
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
