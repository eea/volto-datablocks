import worldSVG from '@plone/volto/icons/world.svg';
import DataQueryFilterEdit from './Edit';
import DataQueryFilterView from './View';

const config = (config) => {
  config.blocks.blocksConfig.dataqueryfilter = {
    id: 'dataqueryfilter',
    title: 'DataQuery Filter',
    icon: worldSVG,
    group: 'data_blocks',
    view: DataQueryFilterView,
    edit: DataQueryFilterEdit,
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

export default config;
