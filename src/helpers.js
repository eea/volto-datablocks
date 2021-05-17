import { connect } from 'react-redux';
import config from '@plone/volto/registry';
import { getBaseUrl } from '@plone/volto/helpers';
import qs from 'querystring';

export * from 'volto-datablocks/components/manage/Blocks/RouteParameter';

export function getBasePath(url) {
  return getBaseUrl(url)
    .replace(config.settings.apiPath, '')
    .replace(config.settings.internalApiPath, '');
}

export function getConnectedDataParametersForRoute(route_parameters) {
  const keys = Object.keys(route_parameters || {});
  if (!keys?.length) return null;
  return keys.map((key) => ({
    i: key,
    o: 'plone.app.querystring.operation.selection.any',
    v: [route_parameters[key]],
  }));
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

export const getConnector = (
  provider_url,
  location,
  routeParmeters = {},
  allowedParams = {},
  pagination = {},
) => {
  const params = {
    ...routeParmeters,
    ...qs.parse(location.search.replace('?', '')),
  };
  let allowedParamsObj = null;
  if (Object.keys(allowedParams || {}).length) {
    allowedParamsObj = {};
    allowedParams.forEach((param) => {
      if (params[param]) {
        allowedParamsObj[param] = params[param];
      }
    });
  }

  let paramsStr =
    '?' +
    qs.stringify({
      ...(allowedParamsObj || params),
      ...(pagination.enabled
        ? { p: pagination.activePage, nrOfHits: pagination.itemsPerPage }
        : {}),
    });

  paramsStr = paramsStr.length === 1 ? '' : paramsStr;

  return {
    url: provider_url ? `${provider_url}${paramsStr}` : null,
    urlConnector: provider_url
      ? `${provider_url}/@connector-data${paramsStr}`
      : null,
    params: paramsStr,
  };
};

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

/**
 * filterDataByParameters.
 *
 * Filters provider data by connected data parameters
 *
 * @param {} providerData
 * @param {} parameters
 */
export function filterDataByParameters(providerData, parameters) {
  if (!(parameters && parameters.length)) return providerData;

  const filter = parameters.find((f) => {
    // finds any available filter that matches the data
    let { i: index } = f;
    index = index.toLowerCase().replace('taxonomy_', '');
    return Object.keys(providerData || {})
      .map((k) => k.toLowerCase())
      .includes(index);
  });

  if (!filter) return providerData;

  let {
    i: filterName,
    v: [filterValue],
  } = filter;

  filterName = filterName.replace('taxonomy_', '');
  const fixedFilterName = Object.keys(providerData).find(
    (k) => k.toLowerCase() === filterName.toLowerCase(),
  );
  if (!fixedFilterName) {
    // console.warn(`providerData has no such column: ${filterName}`, parameters);
    // console.log(providerData);
    return providerData;
  }
  const index = providerData[fixedFilterName]
    .map((v, i) => (v === filterValue ? i : null))
    .filter((n) => n !== null);
  const res = {};
  Object.keys(providerData).forEach((k) => {
    res[k] = index.map((n) => providerData[k][n]);
  });

  return res;
}

/**
 * mixProviderData.
 *
 * Mixes provider data with saved chart data, optionally filtered by connected
 * data parameters. To be used in a plotly chart
 *
 * @param {} chartData
 * @param {} providerData
 * @param {} parameters
 */
export function mixProviderData(chartData, providerData, parameters) {
  const providerDataColumns = Object.keys(providerData);

  // console.log('mix', parameters);
  const res = (chartData || []).map((trace) => {
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

        if (!(parameters && parameters.length)) return;

        const filter = parameters.find((f) => {
          // finds any available filter that matches the data
          let { i: index } = f;
          index = index.toLowerCase().replace('taxonomy_', '');
          return Object.keys(providerData || {})
            .map((k) => k.toLowerCase())
            .includes(index);
        });
        if (!filter) return providerData;

        let {
          i: filterName,
          v: [filterValue],
        } = filter;

        filterName = filterName.replace('taxonomy_', '');

        const real_index =
          providerDataColumns.find((n) => n.toLowerCase() === filterName) ||
          filterName;

        // console.log('filter', filterName, real_index, filterValue);

        // tweak transformation filters using data parameters
        (trace.transforms || []).forEach((transform) => {
          if (transform.targetsrc === real_index && filterValue) {
            transform.value = filterValue;
            transform.target = providerData[transform.targetsrc];
          }
        });
      }
    });

    return trace;
  });
  // console.log('res', res);
  return res;
}

export const connectToDataParameters = connect((state, props) => {
  const providerUrl = props?.data?.provider_url || props?.data?.url || null;

  const connected_data_parameters =
    providerUrl !== null
      ? getConnectedDataParametersForPath(
          state.connected_data_parameters,
          state.router.location.pathname,
          false,
        ) ||
        getConnectedDataParametersForProvider(
          state.connected_data_parameters,
          providerUrl,
        ) ||
        getConnectedDataParametersForContext(
          state.connected_data_parameters,
          state.router.location.pathname,
        )
      : null;

  return {
    connected_data_parameters,
  };
}, null);
