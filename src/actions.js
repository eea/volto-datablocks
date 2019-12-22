import { GET_SPARQL_DATA, GET_DATA_QUERYSTRING } from './constants';

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

// export function getDataQuerystring(path) {
//   return {
//     type: GET_DATA_QUERYSTRING,
//     request: {
//       op: 'get',
//       path: '/@dataquerystring',
//     },
//   };
// }
