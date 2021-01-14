import { settings } from '~/config';
import { getBaseUrl } from '@plone/volto/helpers';

export function addCustomGroup(config, group) {
  const hasCustomGroup = config.blocks.groupBlocksOrder.filter(
    (el) => el.id === group.id,
  );
  if (hasCustomGroup.length === 0) {
    config.blocks.groupBlocksOrder.push(group);
  }
  return config.blocks.groupBlocksOrder;
}

export function getBasePath(url) {
  return getBaseUrl(url)
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');
}

export function getConnectedDataParametersForPath(
  connected_data_parameters,
  url,
  filter,
) {
  let path = getBasePath(url || '');
  const { byPath = {} } = connected_data_parameters;
  if (
    (filter && byPath[path]?.override?.[filter]) ||
    (filter && byPath[path]?.default?.[filter])
  )
    return byPath[path]
      ? byPath[path]?.override || byPath[path]?.default
      : byPath['']?.override || byPath['']?.default;
  return null;
}

export function getConnectedDataParametersForContext(
  connected_data_parameters,
  url,
) {
  let path = getBasePath(url || '');

  const { byContextPath = {} } = connected_data_parameters;

  const res = byContextPath[path]
    ? byContextPath[path]?.override || byContextPath[path]?.default
    : byContextPath['']?.override || byContextPath['']?.default;

  return res;
}

export function getConnectedDataParametersForProvider(
  connected_data_parameters,
  url,
) {
  let path = getBasePath(url || '');

  const { byProviderPath = {} } = connected_data_parameters;
  const res = byProviderPath[path]
    ? byProviderPath[path]?.override || byProviderPath[path]?.default
    : byProviderPath['']?.override || byProviderPath['']?.default;

  return res;
}

/*
 * refreshes chart data using data from provider
 * this is similar to mixProviderData from ConnectedChart, but it doesn't apply
 * transformation
 */
export function updateChartDataFromProvider(chartData, providerData) {
  if (!providerData) return chartData;

  const providerDataColumns = Object.keys(providerData);

  const res = chartData.map((trace) => {
    Object.keys(trace).forEach((tk) => {
      const originalColumn = tk.replace(/src$/, '');
      if (
        tk.endsWith('src') &&
        Object.keys(trace).includes(originalColumn) &&
        typeof trace[tk] === 'string' &&
        providerDataColumns.includes(trace[tk])
      ) {
        let values = providerData[trace[tk]];

        trace[originalColumn] = values;
      }
    });

    return trace;
  });
  return res;
}
