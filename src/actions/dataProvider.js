import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { GET_DATA_FROM_PROVIDER } from '../constants';

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

  //Could be nice but it meses up the inputs. Also, using multiple queries does not stack but return the original viz without querys.
  // // Remove duplicates and combine values.
  // const reducedQuery = data_query.reduce((acc, curr) => {
  //   const found = acc.find((item) => item.i === curr.i);
  //   if (found) {
  //     found.v = [...new Set([...found.v, ...curr.v])];
  //   } else {
  //     acc.push(curr);
  //   }
  //   return acc;
  // }, []);

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
