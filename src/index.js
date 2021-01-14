// import { applyConfig } from './config';

import { DataConnectorView } from './components';
import {
  EditDiscodataConnectorBlock,
  EditDataConnectedEmbedBlock,
} from './components';
import {
  ViewDiscodataConnectorBlock,
  ViewDataConnectedEmbedBlock,
} from './components';
import { DataProviderWidget, DataQueryWidget } from './components';
import { addCustomGroup } from './helpers';
import * as addonReducers from './reducers';
import chartIcon from '@plone/volto/icons/world.svg';

export * from './config';

export default (config) => {
  addCustomGroup(config, {
    id: 'data_blocks',
    title: 'Data blocks',
  });

  config.views.contentTypesViews.discodataconnector = DataConnectorView;

  config.blocks.blocksConfig.data_connected_embed = {
    id: 'data_connected_embed',
    title: 'Data connected embed',
    view: ViewDataConnectedEmbedBlock,
    edit: EditDataConnectedEmbedBlock,
    icon: chartIcon,
    group: 'data_blocks',
  };

  config.blocks.blocksConfig.discodata_connector_block = {
    id: 'discodata_connector_block',
    group: 'data_blocks',
    title: 'Discodata connector block',
    view: ViewDiscodataConnectorBlock,
    edit: EditDiscodataConnectorBlock,
    icon: chartIcon,
  };

  config.widgets.id.data_query = DataQueryWidget;
  config.widgets.widget.data_provider = DataProviderWidget;

  config.addonReducers = {
    ...config.addonReducers,
    ...addonReducers,
  };

  delete config.addonReducers.discodata_query;
  delete config.addonReducers.discodata_resources;

  return config;
};
