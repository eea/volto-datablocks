import {
  GET_SPARQL_DATA,
  GET_DATA_FROM_PROVIDER,
  SET_CONNECTED_DATA_PARAMETERS,
} from './constants';

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
  return filters
    ? {
        type: GET_DATA_FROM_PROVIDER,
        request: {
          op: 'post',
          path: path + '/@connector-data',
          data: { query: filters },
        },
      }
    : {
        type: GET_DATA_FROM_PROVIDER,
        request: {
          op: 'get',
          path: path + '/@connector-data',
        },
      };
}

export function setConnectedDataParameters(
  path,
  parameters,
  manuallySet = false,
) {
  // path is actually url path of context page
  // manuallySet is a flag to forbid the ConnectedDataParameterWatcher viewlet
  // from overriding the data parameters on that path, if they already exist
  return {
    type: SET_CONNECTED_DATA_PARAMETERS,
    parameters,
    manuallySet,
  };
}
