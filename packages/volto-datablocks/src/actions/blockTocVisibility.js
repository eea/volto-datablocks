/**
 * Actions for reporting the runtime visibility of blocks to the table of
 * contents.
 * @module actions/blockTocVisibility
 */

import { SET_BLOCK_TOC_VISIBILITY } from '@eeacms/volto-datablocks/constants';

/**
 * Report whether a block currently renders, so the table of contents block
 * can include or drop its entries.
 *
 * @function setBlockTocVisibility
 * @param {string} id Unique key for the block (content uid + block id).
 * @param {boolean} visible Whether the block is currently rendered.
 * @returns {Object} SET_BLOCK_TOC_VISIBILITY action.
 */
export function setBlockTocVisibility(id, visible) {
  return {
    type: SET_BLOCK_TOC_VISIBILITY,
    id,
    visible,
  };
}
