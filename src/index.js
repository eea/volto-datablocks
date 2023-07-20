import installDataQueryFilter from './components/manage/Blocks/DataQueryFilter';
import installDataConnectedEmbedBlock from './components/manage/Blocks/DataConnectedEmbedBlock';
import installDataTable from './components/manage/Blocks/SimpleDataTable';
import installDottedTableChart from './components/manage/Blocks/DottedTableChart';
import installCountryFlag from './components/manage/Blocks/CountryFlag';
import installCustomConnectedBlock from './components/manage/Blocks/CustomConnectedBlock';
import installConditionalDataBlock from './components/manage/Blocks/ConditionalDataBlock';

import { DataConnectorView, DataConnectorTableViewWidget } from './components';
import {
  DataQueryWidget,
  PickObjectWidget,
  SelectProviderPickWidget,
} from './components';
import { dataProvider } from './middlewares';
import * as addonReducers from './reducers';

export default (config) => {
  config.blocks.groupBlocksOrder = [
    ...config.blocks.groupBlocksOrder,
    {
      id: 'data_blocks',
      title: 'Data blocks',
    },
  ];

  config.views.contentTypesViews.discodataconnector = DataConnectorView;

  config.widgets.id.data_query = DataQueryWidget;
  config.widgets.widget.data_query = DataQueryWidget;
  config.widgets.widget.object_by_path = PickObjectWidget;
  config.widgets.widget.select_provider_pick = SelectProviderPickWidget;
  config.widgets.views.id.sql_query = DataConnectorTableViewWidget;

  config.settings.storeExtenders = [
    ...(config.settings.storeExtenders || []),
    dataProvider,
  ];

  config.addonReducers = {
    ...config.addonReducers,
    ...addonReducers,
  };

  return [
    installDataQueryFilter,
    installDataConnectedEmbedBlock,
    installDataTable,
    installDottedTableChart,
    installCountryFlag,
    installCustomConnectedBlock,
    installConditionalDataBlock,
  ].reduce((acc, apply) => apply(acc), config);
};
