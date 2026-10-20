/**
 * Reducer holding the runtime visibility of blocks keyed by content uid and
 * block id. Consumed by the table of contents block, through the
 * `blockTocVisibility` context.
 * @module reducers/block_toc_visibility
 */

import { SET_BLOCK_TOC_VISIBILITY } from '@eeacms/volto-datablocks/constants';

const initialState = {};

export default function block_toc_visibility(
  state = initialState,
  action = {},
) {
  if (action.type === SET_BLOCK_TOC_VISIBILITY) {
    return state[action.id] === action.visible
      ? state
      : { ...state, [action.id]: action.visible };
  }
  return state;
}
