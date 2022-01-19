import installDataQueryFilter from './components/manage/Blocks/DataQueryFilter';
import installDataConnectedEmbedBlock from './components/manage/Blocks/DataConnectedEmbedBlock';
import installDiscodataConnectorBlock from './components/manage/Blocks/DiscodataConnectorBlock';
import installDataTable from './components/manage/Blocks/SimpleDataTable';
import installDottedTableChart from './components/manage/Blocks/DottedTableChart';
import installCountryFlag from './components/manage/Blocks/CountryFlag';
import installRouteParameter from './components/manage/Blocks/RouteParameter';
import installCustomConnectedBlock from './components/manage/Blocks/CustomConnectedBlock';

import { DataConnectorView } from './components';
import { DataQueryWidget, PickObjectWidget } from './components';
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
    installDiscodataConnectorBlock,
    installDataTable,
    installDottedTableChart,
    installCountryFlag,
    installRouteParameter,
    installCustomConnectedBlock,
  ].reduce((acc, apply) => apply(acc), config);
};
