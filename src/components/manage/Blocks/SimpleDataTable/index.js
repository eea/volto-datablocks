import tableSVG from '@plone/volto/icons/table.svg';
import SimpleDataTableEdit from './Edit';
import SimpleDataTableView from './View';

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
  };
  return config;
};
