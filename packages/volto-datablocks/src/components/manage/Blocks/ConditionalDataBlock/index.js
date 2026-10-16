import imagewideSVG from '@plone/volto/icons/image-wide.svg';
import { getBlocks } from '@plone/volto/helpers/Blocks/Blocks';
import { makeTocVisibilityKey } from './tocVisibility';
import View from './View';
import Edit from './Edit';

/**
 * Collect the Table of Contents entries contributed by the blocks nested
 * inside a conditional data block.
 *
 * The nested blocks live in `block.data`, a content-like object with its own
 * `blocks` / `blocks_layout` (see Edit.jsx / View.jsx). volto-block-toc only
 * walks the top-level page layout, so without this hook the inner blocks are
 * invisible to the ToC.
 *
 * Each inner block is delegated to the `tocEntry` / `tocEntries` hook
 * registered by its own block type, so nested containers (e.g. a columns
 * block inside a conditional data block) keep working too.
 *
 * @param {Object} block The conditional data block.
 * @param {Object} tocData The ToC block data (levels, etc).
 * @param {Object} blocksConfig Volto's `config.blocks.blocksConfig`.
 * @return {Array} A list of `[level, title]` ToC entries.
 */
export const getNestedTocEntries = (block, tocData, blocksConfig) =>
  getBlocks(block?.data || {}).reduce((entries, [, innerBlock]) => {
    const innerConfig = blocksConfig?.[innerBlock?.['@type']];
    if (!innerConfig) return entries;

    const tocEntry = innerConfig.tocEntry?.(innerBlock, tocData);
    const innerEntries =
      innerConfig.tocEntries?.(innerBlock, tocData) ||
      (tocEntry ? [tocEntry] : []);

    return entries.concat(innerEntries);
  }, []);

const config = (config) => {
  config.blocks.blocksConfig.conditionalDataBlock = {
    id: 'conditionalDataBlock',
    title: 'Conditional data block',
    icon: imagewideSVG,
    group: 'data_blocks',
    view: View,
    edit: Edit,
    restricted: false,
    blockHasOwnFocusManagement: true,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    // Integration with volto-block-toc: expose nested blocks to the ToC.
    tocEntry: undefined,
    tocEntries: (block, tocData, context = {}) => {
      // When the condition is currently false, the block is not rendered, so
      // its nested entries must not appear in the ToC. `blockTocVisibility`
      // is published by the block itself (see View.jsx) once provider data is
      // resolved; while unknown we keep the optimistic default and include it.
      const key = makeTocVisibilityKey(context.contentUid, context.id);
      if (
        key &&
        context.blockTocVisibility &&
        context.blockTocVisibility[key] === false
      ) {
        return [];
      }
      return getNestedTocEntries(block, tocData, config.blocks.blocksConfig);
    },
  };
  return config;
};

export default config;
