import {
  GET_SPARQL_DATA,
  CHANGE_SIDEBAR_STATE,
} from 'volto-datablocks/constants';

export * from './blockData';
export * from './connectedDataParameters';
export * from './dataProvider';
export * from './discodataResource';
export * from './queryParameters';

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
