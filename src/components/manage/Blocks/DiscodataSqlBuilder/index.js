import worldSVG from '@plone/volto/icons/world.svg';
import DiscodataSqlBuilderEdit from './Edit';
import DiscodataSqlBuilderView from './View';

import * as addonReducers from 'volto-datablocks/reducers';

export default (config) => {
  config.blocks.blocksConfig.discodata_sql_builder = {
    id: 'discodata_sql_builder',
    title: 'Discodata sql builder',
    icon: worldSVG,
    group: 'data_blocks',
    view: DiscodataSqlBuilderView,
    edit: DiscodataSqlBuilderEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  config.addonReducers.discodata_query = addonReducers.discodata_query;
  config.addonReducers.discodata_resources = addonReducers.discodata_resources;

  return config;
};
