import { GET_SPARQL_DATA, CHANGE_SIDEBAR_STATE } from '../constants';

export * from './blockData';
export * from './dataProvider';
export * from './connectedDataParameters';
export * from './unsavedDataQueries';

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
