import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import qs from 'querystring';
import {
  GET_PROVIDER_METADATA,
  GET_DATA_FROM_PROVIDER,
  SET_PROVIDER_CONTENT,
  SET_CONNECTED_DATA_PARAMETERS,
  DELETE_CONNECTED_DATA_PARAMETERS,
} from '../constants';

export function getProviderMetadata(path) {
  return {
    type: GET_PROVIDER_METADATA,
    path: path,
    request: {
      op: 'get',
      path: path,
    },
  };
}

export function getDataFromProvider(path, filters = null, queryString = '') {
  path =
    typeof path === 'object'
      ? Array.isArray(path) && path.length
        ? path[0]['@id']
        : path['@id']
      : path;
  path = path && flattenToAppURL(path).replace(/\/$/, '');
  const db_version =
    window.env.RAZZLE_DB_VERSION || config.settings.db_version || 'latest';
  const query = {
    ...qs.parse(queryString.replace('?', '')),
    db_version,
  };

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
          path: `${path}/@connector-data/`,
          data: { query: filters },
        },
      }
    : {
        type: GET_DATA_FROM_PROVIDER,
        path: path,
        queryString: queryString,
        request: {
          op: 'get',
          path: `${path}/@connector-data/?${qs.stringify(query)}`,
        },
      };
}

export function setProviderContent(path, content) {
  return {
    type: SET_PROVIDER_CONTENT,
    path,
    content,
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
