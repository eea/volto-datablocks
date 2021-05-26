import worldSVG from '@plone/volto/icons/world.svg';
import View from './View';
import Edit from './Edit';

export default (config) => {
  config.blocks.blocksConfig.routeParameter = {
    id: 'routeParameter',
    title: 'Route parameter',
    icon: worldSVG,
    group: 'data_blocks',
    view: View,
    edit: Edit,
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
