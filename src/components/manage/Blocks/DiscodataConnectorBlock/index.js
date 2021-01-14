import worldSVG from '@plone/volto/icons/world.svg';
import DiscodataConnectorBlockEdit from './Edit';
import DiscodataConnectorBlockView from './View';

export default (config) => {
  config.blocks.blocksConfig.discodata_connector_block = {
    id: 'discodata_connector_block',
    title: 'Discodata connector block',
    icon: worldSVG,
    group: 'data_blocks',
    view: DiscodataConnectorBlockView,
    edit: DiscodataConnectorBlockEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};
