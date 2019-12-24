import { GET_SPARQL_DATA, GET_DATA_FROM_PROVIDER } from './constants';

export function getSparqlData(path) {
  const url = path + '/@sparql-data';
  console.log('will do something with path', url);
  return {
    type: GET_SPARQL_DATA,
    request: {
      op: 'get',
      path: url,
    },
  };
}

// TODO: this needs to be refactored to use the @connector-data endpoint
export function getDataFromProvider(path) {
  return {
    type: GET_DATA_FROM_PROVIDER,
    request: {
      op: 'get',
      path: path + '@connector-data',
    },
  };
}

// export function getDataQuerystring(path) {
//   return {
//     type: GET_DATA_QUERYSTRING,
//     request: {
//       op: 'get',
//       path: '/@dataquerystring',
//     },
//   };
// }
