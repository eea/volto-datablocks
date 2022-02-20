/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { getBaseUrl, flattenToAppURL } from '@plone/volto/helpers';
import qs from 'querystring';

export * from './components/manage/Blocks/RouteParameter';

export function getBasePath(url) {
  return flattenToAppURL(getBaseUrl(url));
}

export function getConnectorPath(provider_url, hashValue) {
  return `${provider_url}${hashValue ? `#${hashValue}` : '#_default'}`;
}

export function getForm({ data = {}, location, pagination, extraQuery = {} }) {
  const params = {
    ...(qs.parse(location?.search?.replace('?', '')) || {}),
    ...(data.form || {}),
    ...extraQuery,
  };
  const allowedParams = data.allowedParams;
  let allowedParamsObj = null;
  if (Object.keys(allowedParams || {}).length) {
    allowedParamsObj = {};
    allowedParams.forEach((param) => {
      if (params[param]) {
        allowedParamsObj[param] = params[param];
      }
    });
  }

  return {
    ...(allowedParamsObj || params),
    ...(pagination?.enabled
      ? { p: pagination.activePage, nrOfHits: pagination.itemsPerPage }
      : {}),
  };
}

export function getDataQuery({
  connected_data_parameters,
  data = {},
  location,
  // pagination,
  provider_url,
}) {
  const path = location.pathname.replace('/edit', '');
  const has_data_query_by_context = data.has_data_query_by_context ?? true;
  const has_data_query_by_provider = data.has_data_query_by_provider ?? true;
  const byContextPath = has_data_query_by_context
    ? connected_data_parameters?.byContextPath?.[path] || []
    : [];
  const byProviderPath = has_data_query_by_provider
    ? connected_data_parameters?.byProviderPath?.[provider_url] || {}
    : {};
  const filters =
    Object.keys(byProviderPath).map((key) => byProviderPath[key]) || [];
  // if (pagination.enabled) {
  //   return [...(data?.data_query || []), ...byContextPath, ...filters];
  // }
  return [...(data?.data_query || []), ...byContextPath, ...filters];
  // return [...(data?.data_query || []), ...byContextPath];
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
    const newTrace = { ...(trace || {}) };
    Object.keys(trace).forEach((tk) => {
      const originalColumn = tk.replace(/src$/, '');
      if (
        tk.endsWith('src') &&
        Object.keys(trace).includes(originalColumn) &&
        typeof trace[tk] === 'string' &&
        providerDataColumns.includes(trace[tk])
      ) {
        let values = providerData[trace[tk]];

        newTrace[originalColumn] = values;
      }
    });
    newTrace.transforms = (trace.transforms || []).map((transform) => ({
      ...transform,
      target: providerData[transform.targetsrc],
    }));
    return newTrace;
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
export function mixProviderData(
  chartData,
  providerData,
  parameters,
  connectedDataTemplateString,
) {
  const providerDataColumns = Object.keys(providerData);
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

        // tweak transformation filters using data parameters
        (trace.transforms || []).forEach((transform) => {
          if (transform.targetsrc === real_index && filterValue) {
            // console.log('connectedDataTemplateString', connectedDataTemplateString);

            if (!connectedDataTemplateString) {
              transform.value = filterValue;
              transform.target = providerData[transform.targetsrc];
            } else {
              let transformValue = transform.value;
              const tValueIsArray = Array.isArray(transformValue);
              transformValue = tValueIsArray
                ? transformValue.join()
                : transformValue;

              connectedDataTemplateString.split(',').forEach((templString) => {
                transformValue = transformValue.replace(
                  templString,
                  filterValue,
                );
              });

              transform.value = tValueIsArray
                ? transformValue.split(',')
                : transformValue;
              transform.target = providerData[transform.targetsrc];
            }
          }
        });
      }
    });

    return trace;
  });
  return res;
}

/* Connected data parameters */

export function getConnectedDataParametersForContext(
  connected_data_parameters,
  url,
) {
  let path = getBasePath(url || '');

  const { byContextPath = {} } = connected_data_parameters;

  return byContextPath[path] || null;
}

export function getConnectedDataParametersForProvider(
  connected_data_parameters,
  provider_url,
) {
  let path = getBasePath(provider_url || '');

  const { byProviderPath = {} } = connected_data_parameters;
  const res = Object.keys(byProviderPath[path] || {}).map(
    (filter) => byProviderPath[path][filter],
  );

  return res;
}

// hook when component is in visible viewport, rootMargin is how much of the element should be visible before loading up
// Example"-300px" for In this case it would only be considered onScreen if more ... 300px is visible
export function useOnScreen(ref, rootMargin = '0px') {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);
  const [entryCount, setEntryCount] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    var curRef = ref.current;
    return () => {
      observer.unobserve(ref.current ? ref.current : curRef);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  useEffect(() => {
    if (isIntersecting) {
      setEntryCount(entryCount + 1);
    }
  }, [isIntersecting]);
  return { entryCount, isIntersecting };
}
