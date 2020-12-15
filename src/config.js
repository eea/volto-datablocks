import * as addonReducers from './reducers';

import chartIcon from '@plone/volto/icons/world.svg';

import PickProvider from './PickProvider';
import DataQueryWidget from './DataQueryWidget/Widget';
import DataBlockView from './DataConnectedBlock/View';
import DataBlockEdit from './DataConnectedBlock/Edit';
import DataConnectorView from './DataConnector/View';
import { ViewSelect, AutoSelectFromContext } from './ContextParameter';

import DataConnectedEmbedView from './DataConnectedEmbedBlock/View';
import DataConnectedEmbedEdit from './DataConnectedEmbedBlock/DataConnectedEmbedEdit';

import DiscodataConnectorBlockEdit from './DiscodataConnectorBlock/Edit';
import DiscodataConnectorBlockView from './DiscodataConnectorBlock/View';

import DiscodataTableBlockEdit from './DiscodataTableBlock/Edit';
import DiscodataTableBlockView from './DiscodataTableBlock/View';

import DiscodataSqlBuilderEdit from './DiscodataSqlBuilder/Edit';
import DiscodataSqlBuilderView from './DiscodataSqlBuilder/View';

import DataProviderWidget from './DataProviders/DataProviderWidget';

import addonRoutes from './routes';

// import installDraftEditorDataEntity from './dataentity';
// import { ConnectedDataParameterWatcher } from './Viewlets';

function addCustomGroup(config, group) {
  const hasCustomGroup = config.blocks.groupBlocksOrder.filter(
    (el) => el.id === group.id,
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

export function installDiscodataBlocks(config) {
  // Requires a customization of ModalForm. SchemaWidget and SchemaWidgetFieldset.
  // Refactor WIP
  addCustomGroup(config, { id: 'data_blocks', title: 'Data blocks' });

  config.blocks.blocksConfig.discodata_sql_builder = {
    id: 'discodata_sql_builder',
    title: 'Discodata sql builder',
    view: DiscodataSqlBuilderView,
    edit: DiscodataSqlBuilderEdit,
    icon: chartIcon,
    group: 'data_blocks',
  };

  config.blocks.blocksConfig.discodata_table_block = {
    id: 'discodata_table_block',
    title: 'Discodata table block',
    view: DiscodataTableBlockView,
    edit: DiscodataTableBlockEdit,
    icon: chartIcon,
    group: 'data_blocks',
  };

  return config;
}

export const installDemoBlocks = (config) => {
  addCustomGroup(config, { id: 'data_blocks', title: 'Data blocks' });
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

  return config;
};
