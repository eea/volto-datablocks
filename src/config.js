import { EditDiscodataSqlBuilder } from './components';
import { ViewDiscodataSqlBuilder } from './components';

import * as addonReducers from './reducers';

import chartIcon from '@plone/volto/icons/world.svg';

export function installDiscodataBlocks(config) {
  config.blocks.blocksConfig.discodata_sql_builder = {
    id: 'discodata_sql_builder',
    title: 'Discodata sql builder',
    view: EditDiscodataSqlBuilder,
    edit: ViewDiscodataSqlBuilder,
    icon: chartIcon,
    group: 'data_blocks',
  };

  config.addonReducers.discodata_query = addonReducers.discodata_query;
  config.addonReducers.discodata_resources = addonReducers.discodata_resources;

  return config;
}
