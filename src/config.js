import * as addonReducers from './reducers';

import chartIcon from '@plone/volto/icons/world.svg';

import PickProvider from './PickProvider';
import DataQueryWidget from './DataQueryWidget/Widget';
import DataBlockView from './DataConnectedBlock/View';
import DataBlockEdit from './DataConnectedBlock/Edit';
import DataConnectorView from './DataConnector/View';
import installDraftEditorDataEntity from './dataentity';
import { ViewSelect, AutoSelectFromContext } from './ContextParameter';

import DataConnectedEmbedView from './DataConnectedEmbedBlock/View';
import DataConnectedEmbedEdit from './DataConnectedEmbedBlock/DataConnectedEmbedEdit';

import DiscodataConnectorBlockEdit from './DiscodataConnectorBlock/Edit';
import DiscodataConnectorBlockView from './DiscodataConnectorBlock/View';

import DiscodataComponentsBlockEdit from './DiscodataComponentsBlock/Edit';
import DiscodataComponentsBlockView from './DiscodataComponentsBlock/View';

import DataProviderWidget from './DataProviders/DataProviderWidget';

import addonRoutes from './routes';

// import { ConnectedDataParameterWatcher } from './Viewlets';

function addCustomGroup(config, group) {
  const hasCustomGroup = config.blocks.groupBlocksOrder.filter(
    el => el.id === group.id,
  );
  if (hasCustomGroup.length === 0) {
    config.blocks.groupBlocksOrder.push(group);
  }
}

export function applyConfig(config) {
  addCustomGroup(config, { id: 'custom_addons', title: 'Custom addons' });
  addCustomGroup(config, { id: 'data_blocks', title: 'Data blocks' });

  config.views.contentTypesViews.discodataconnector = DataConnectorView;

  config.widgets.id.data_query = DataQueryWidget;
  config.widgets.widget.pick_provider = PickProvider;

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
    group: 'data_blocks',
  };

  config.blocks.blocksConfig.auto_select_parameter = {
    id: 'auto_select_parameter',
    title: 'Auto select parameter',
    view: ViewSelect,
    edit: AutoSelectFromContext,
    icon: chartIcon,
    group: 'data_blocks',
  };

  config.blocks.blocksConfig.data_connected_embed = {
    id: 'data_connected_embed',
    title: 'Data connected embed',
    view: DataConnectedEmbedView,
    edit: DataConnectedEmbedEdit,
    icon: chartIcon,
    group: 'custom_addons',
  };

  config.blocks.blocksConfig.discodata_connector_block = {
    id: 'discodata_connector_block',
    title: 'Discodata connector block',
    view: DiscodataConnectorBlockView,
    edit: DiscodataConnectorBlockEdit,
    icon: chartIcon,
    group: 'data_blocks',
  };

  config.blocks.blocksConfig.discodata_components_block = {
    id: 'discodata_components_block',
    title: 'Discodata components block',
    view: DiscodataComponentsBlockView,
    edit: DiscodataComponentsBlockEdit,
    icon: chartIcon,
    group: 'data_blocks',
  };

  config.settings.nonContentRoutes.push('/data-providers-view');
  config.addonRoutes = [...(config.addonRoutes || []), ...addonRoutes];

  config.widgets.type.dataProvider = DataProviderWidget;
  // config.viewlets = [
  //   { path: '/', component: ConnectedDataParameterWatcher },
  //   ...(config.viewlets || []),
  // ];

  // installDraftEditorDataEntity(config);

  return config;
}
