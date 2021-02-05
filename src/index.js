import installDataQueryFilter from './components/manage/Blocks/DataQueryFilter';
import installDataConnectedEmbedBlock from './components/manage/Blocks/DataConnectedEmbedBlock';
import installDiscodataConnectorBlock from './components/manage/Blocks/DiscodataConnectorBlock';
import installDataTable from './components/manage/Blocks/SimpleDataTable';
import installBubbleChart from './components/manage/Blocks/BubbleChart';
import installDottedTableChart from './components/manage/Blocks/DottedTableChart';
import installCountryFlag from './components/manage/Blocks/CountryFlag';
import installTreemap from './components/manage/Blocks/Treemap';
import installRouterDataParameter from './components/manage/Blocks/RouterDataParameter';

import { DataConnectorView } from './components';
import { DataQueryWidget, PickProviderWidget } from './components';
import { addCustomGroup } from './helpers';
import * as addonReducers from './reducers';
export * from './config';

export default (config) => {
  addCustomGroup(config, {
    id: 'data_blocks',
    title: 'Data blocks',
  });
  addCustomGroup(config, {
    id: 'custom_addons',
    title: 'Custom addons',
  });

  config.views.contentTypesViews.discodataconnector = DataConnectorView;

  config.widgets.id.data_query = DataQueryWidget;
  config.widgets.widget.data_provider = PickProviderWidget;
  config.widgets.widget.pick_provider = PickProviderWidget;

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
    installBubbleChart,
    installDottedTableChart,
    installCountryFlag,
    installTreemap,
    installRouterDataParameter,
  ].reduce((acc, apply) => apply(acc), config);
};
