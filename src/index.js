import installDataQueryFilter from './components/manage/Blocks/DataQueryFilter';
import installDataConnectedEmbedBlock from './components/manage/Blocks/DataConnectedEmbedBlock';
import installDiscodataConnectorBlock from './components/manage/Blocks/DiscodataConnectorBlock';
import installDataTable from './components/manage/Blocks/SimpleDataTable';
import installDottedTableChart from './components/manage/Blocks/DottedTableChart';
import installCountryFlag from './components/manage/Blocks/CountryFlag';
import installTreemap from './components/manage/Blocks/Treemap';
import installRouteParameter from './components/manage/Blocks/RouteParameter';
import installCustomConnectedBlock from './components/manage/Blocks/CustomConnectedBlock';

import { DataConnectorView } from './components';
import {
  PickObjectWidget,
  DataQueryWidget,
  PickProviderWidget,
} from './components';
import { dataProvider } from './middlewares';
import * as addonReducers from './reducers';
export * from './config';

export default (config) => {
  config.blocks.groupBlocksOrder = [
    ...config.blocks.groupBlocksOrder,
    {
      id: 'data_blocks',
      title: 'Data blocks',
    },
    {
      id: 'custom_addons',
      title: 'Custom addons',
    },
  ];

  config.views.contentTypesViews.discodataconnector = DataConnectorView;

  config.widgets.id.data_query = DataQueryWidget;
  config.widgets.widget.object_by_path = PickObjectWidget;
  config.widgets.widget.data_provider = PickProviderWidget;
  config.widgets.widget.pick_provider = PickProviderWidget;

  // config.settings.dbVersion = 'latest';

  config.settings.storeExtenders = [
    ...(config.settings.storeExtenders || []),
    dataProvider,
  ];

  config.addonReducers = {
    ...config.addonReducers,
    ...addonReducers,
  };

  delete config.addonReducers.discodata_query;
  delete config.addonReducers.discodata_resources;

  return [
    installDataQueryFilter,
    installDataConnectedEmbedBlock,
    installDiscodataConnectorBlock,
    installDataTable,
    installDottedTableChart,
    installCountryFlag,
    installTreemap,
    installRouteParameter,
    installCustomConnectedBlock,
  ].reduce((acc, apply) => apply(acc), config);
};
