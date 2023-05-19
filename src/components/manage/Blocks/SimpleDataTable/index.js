import tableSVG from '@plone/volto/icons/table.svg';
import SimpleDataTableEdit from './Edit';
import SimpleDataTableView from './View';

import { DefaultView, defaultSchema } from './templates/default';

export default (config) => {
  config.blocks.blocksConfig.simpleDataConnectedTable = {
    id: 'simpleDataConnectedTable',
    title: 'Data Table',
    icon: tableSVG,
    group: 'data_blocks',
    view: SimpleDataTableView,
    edit: SimpleDataTableEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    templates: {
      default: {
        title: 'Default',
        view: DefaultView,
        schema: defaultSchema,
      },
      ...(config.blocks.blocksConfig.simpleDataConnectedTable?.templates || {}),
    },
    available_colors: [
      '#FCE0E0',
      '#E2F1E4',
      '#EB2631',
      '#F06630',
      '#FBDC35',
      '#41B34F',
      '#8EC54A',
      '#D5DF3F',
      '#EFEFEF',
      '#EB9694',
      '#FEF3BD',
      '#C1E1C5',
      '#BEDADC',
      '#C4DEF6',
      '#BED3F3',
      '#D4C4FB',
    ],
  };
  return config;
};
