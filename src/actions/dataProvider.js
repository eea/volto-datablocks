import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import {
  GET_PROVIDER_METADATA,
  GET_DATA_FROM_PROVIDER,
  SET_PROVIDER_CONTENT,
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

export function getDataFromProvider(
  path,
  query = {},
  data_query = [],
  hashValue = '_default',
) {
  path = path && flattenToAppURL(path).replace(/\/$/, '');

  const db_version =
    window.env.RAZZLE_DB_VERSION || config.settings.db_version || 'latest';

  const form = {
    db_version,
    ...query,
  };

  return {
    type: GET_DATA_FROM_PROVIDER,
    path: path,
    hashValue,
    request: {
      op: 'post',
      path: `${path}/@connector-data`,
      data: {
        form,
        data_query,
      },
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
