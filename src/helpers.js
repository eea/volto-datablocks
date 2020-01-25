import { settings } from '~/config';
import { getBaseUrl } from '@plone/volto/helpers';

export function getBasePath(url) {
  return getBaseUrl(url)
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');
}

export function getConnectedDataParametersForContext(state, url) {
  let path = getBasePath(url || '');

  const { byContextPath = {} } = state.connected_data_parameters;
  const res = byContextPath[path]
    ? byContextPath[path]?.override || byContextPath[path]?.default
    : byContextPath['']?.override || byContextPath['']?.default;

  return res;
}

export function getConnectedDataParametersForProvider(state, url) {
  let path = getBasePath(url || '');

  const { byProviderPath = {} } = state.connected_data_parameters;
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
  // console.log('chart data', data);
  // console.log('provider_data', provider_data);

  if (!providerData) return chartData;

  const providerDataColumns = Object.keys(providerData);

  const res = chartData.map(trace => {
    Object.keys(trace).forEach(tk => {
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

// function getConnectedDataParameters(state, props) {
//   let path = props?.url || '';
//
//   path = path
//     .replace(settings.apiPath, '')
//     .replace(settings.internalApiPath, '');
//
//   // NOTE: we fetch first the general parameter. This is temporary, it should
//   // be handled for more cases. Doing it this way means that there's no way to
//   // have multiple data selectors on the page, because the first one overrides
//   // the second. There's multiple things that need to be improved here.
//   // The whole volto-datablocks, volto-plotlycharts need to be updated if this
//   // code and cases change.
//   const res =
//     state.connected_data_parameters.byPath?.[''] ||
//     state.connected_data_parameters.byPath?.[path] ||
//     null;
//   console.log('DCV conn data res', res, state, path);
//   return res;
// }
// NOTE: we fetch first the general parameter. This is temporary, it should
// be handled for more cases. Doing it this way means that there's no way to
// have multiple data selectors on the page, because the first one overrides
// the second. There's multiple things that need to be improved here.
// The whole volto-datablocks, volto-plotlycharts need to be updated if this
// code and cases change.
// const res =
//   state.connected_data_parameters.byPath?.[''] ||
//   state.connected_data_parameters.byPath?.[path] ||
//   null;
// console.log('state connected', state.connected_data_parameters);
// console.log('state connected path', path);
// console.log('parameters returned', res);
