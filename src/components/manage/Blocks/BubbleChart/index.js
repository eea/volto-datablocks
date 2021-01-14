import paintSVG from '@plone/volto/icons/table.svg';
import BubbleChartEdit from './Edit';
import BubbleChartView from './View';

export default (config) => {
  config.blocks.blocksConfig.bubbleChart = {
    id: 'bubbleChart',
    title: 'Bubble Chart',
    icon: paintSVG,
    group: 'data_blocks',
    view: BubbleChartView,
    edit: BubbleChartEdit,
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
