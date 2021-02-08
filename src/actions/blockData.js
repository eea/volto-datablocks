import { GET_BLOCKDATA } from 'volto-datablocks/constants';

export function getBlockData(path, blockid) {
  path = `${path}/@blocks/${blockid}`;

  return {
    type: GET_BLOCKDATA,
    path,
    blockid,
    request: {
      op: 'get',
      path,
    },
  };
}
