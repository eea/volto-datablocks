import {
  GET_SPARQL_DATA,
  GET_DATA_FROM_PROVIDER,
  // SET_CONNECTED_DATA_PARAMETERS,
} from './constants';
// import { settings } from '~/config';

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
  console.warn('Refactor code for setConnectedDataParameters!!');

  // path is actually url path of context page
  // manuallySet is a flag to forbid the ConnectedDataParameterWatcher viewlet
  // from overriding the data parameters on that path, if they already exist
  // path = path
  //   .replace(settings.apiPath, '')
  //   .replace(settings.internalApiPath, '');
  // console.log('Set connected data parameters', path, parameters);
  // return {
  //   type: SET_CONNECTED_DATA_PARAMETERS,
  //   path,
  //   parameters,
  //   manuallySet,
  // };
}
