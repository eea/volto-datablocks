import tableSVG from '@plone/volto/icons/table.svg';
import TreemapView from './View';
import TreemapEdit from './Edit';

export default (config) => {
  config.blocks.blocksConfig.treemapChart = {
    id: 'treemapChart',
    title: 'Treemap',
    icon: tableSVG,
    group: 'data_blocks',
    view: TreemapView,
    edit: TreemapEdit,
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
