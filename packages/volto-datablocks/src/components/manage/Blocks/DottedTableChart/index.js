import tableSVG from '@plone/volto/icons/table.svg';
import DottedTableChartEdit from './Edit';
import DottedTableChartView from './View';

const config = (config) => {
  config.blocks.blocksConfig.dottedTableChart = {
    id: 'dottedTableChart',
    title: 'Dotted Table Chart',
    icon: tableSVG,
    group: 'data_blocks',
    view: DottedTableChartView,
    edit: DottedTableChartEdit,
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
