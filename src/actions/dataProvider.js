import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import {GET_DATA_FROM_PROVIDER } from '../constants';

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
