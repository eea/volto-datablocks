import worldSVG from '@plone/volto/icons/world.svg';
import Edit from './Edit';
import View from './View';

const config = (config) => {
  /**
   * To add a custom connected block overwrite config.blocks.blocksConfig.custom_connected_block.blocks
   * config.blocks.blocksConfig.custom_connected_block.blocks = {
   *  ...config.blocks.blocksConfig.custom_connected_block.blocks,
   *  custom_block: {
   *    view: () => (<p>Your desired view</p>),
   *    getSchema: () => ({...schema})
   *    schema: {...schema}
   *  }
   * }
   * Use getSchema or schema, not both
   */
  config.blocks.blocksConfig.custom_connected_block = {
    id: 'custom_connected_block',
    title: 'Custom connected block',
    icon: worldSVG,
    group: 'data_blocks',
    edit: Edit,
    view: View,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    blocks: {},
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};

export default config;
