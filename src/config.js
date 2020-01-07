import * as addonReducers from './reducers';

import DataQueryWidget from './DataQueryWidget/Widget';
import DataBlockView from './DataConnectedBlock/View';
import DataBlockEdit from './DataConnectedBlock/Edit';
import DataConnectorView from './DataConnector/View';
import installDraftEditorDataEntity from './dataentity';

import chartIcon from '@plone/volto/icons/world.svg';
import addonRoutes from './routes';

function addCustomGroup(config) {
  const hasCustomGroup = config.blocks.groupBlocksOrder.filter(
    el => el.id === 'custom_addons',
  );
  if (hasCustomGroup.length === 0) {
    config.blocks.groupBlocksOrder.push({
      id: 'custom_addons',
      title: 'Custom addons',
    });
  }
}

export function applyConfig(config) {
  addCustomGroup(config);

  config.views.contentTypesViews.discodataconnector = DataConnectorView;

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

  config.settings.nonContentRoutes.push('/data-providers-view');
  config.addonRoutes = [...(config.addonRoutes || []), ...addonRoutes];

  installDraftEditorDataEntity(config);

  return config;
}
