import * as addonReducers from './reducers';
import DataQueryWidget from './DataQueryWidget/Widget';

export function applyConfig(config) {
  config.widgets.id.data_query = DataQueryWidget;

  config.addonReducers = {
    ...config.addonReducers,
    ...addonReducers,
  };
  return config;
}
