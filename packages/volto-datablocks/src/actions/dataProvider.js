import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { GET_DATA_FROM_PROVIDER } from '@eeacms/volto-datablocks/constants';
import {
  getDataProviderHash,
  getDataProviderPayload,
} from '@eeacms/volto-datablocks/helpers';

export function getDataFromProvider(
  path,
  query = {},
  data_query = [],
  hashValue,
) {
  path = path && flattenToAppURL(path).replace(/\/$/, '');

  const payload = getDataProviderPayload(query, data_query);
  const effectiveHashValue =
    hashValue || getDataProviderHash(payload.form, payload.data_query);

  // // Could be nice but it meses up the inputs. Also, using multiple queries does not stack but return the original viz without querys.
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
    hashValue: effectiveHashValue,
    request: {
      op: 'post',
      path: `${path}/@connector-data`,
      data: payload,
    },
  };
}
