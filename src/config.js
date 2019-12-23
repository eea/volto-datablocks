import * as addonReducers from './reducers';

import DataQueryWidget from './DataQueryWidget/Widget';
import DataBlockView from './DataConnectedBlock/View';
import DataBlockEdit from './DataConnectedBlock/Edit';

import chartIcon from '@plone/volto/icons/world.svg';

export function applyConfig(config) {
  config.widgets.id.data_query = DataQueryWidget;

  config.addonReducers = {
    ...config.addonReducers,
    ...addonReducers,
  };

  config.blocks.blocksConfig.data_connected_block = {
    id: 'data_connected_block',
    title: 'Simple Data Connected Block',
    view: DataBlockView,
    edit: DataBlockEdit,
    icon: chartIcon,
    group: 'custom_addons',
  };

  return config;
}
