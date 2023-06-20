/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { getBaseUrl, flattenToAppURL } from '@plone/volto/helpers';
import qs from 'querystring';

export function getBasePath(url) {
  return flattenToAppURL(getBaseUrl(url));
}

export function getConnectorPath(provider_url, hashValue) {
  return `${provider_url}${hashValue ? `#${hashValue}` : '#_default'}`;
}

export function getProviderUrl(url) {
  if (!url) return '';
  return flattenToAppURL(url)
    .replace('@@download/file', '')
    .replace(/\/*$/, '');
}

export function getForm({
  data = {},
  location,
  pagination,
  extraQuery = {},
  extraConditions,
}) {
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
    ...(extraConditions ? { extra_conditions: extraConditions } : {}),
    ...(pagination?.enabled
      ? { p: pagination.activePage, nrOfHits: pagination.itemsPerPage }
      : {}),
  };
}

export function getDataQuery({
  connected_data_parameters,
  content = {},
  data = {},
  location,
  params,
  provider_url,
}) {
  let byContextPath = [];
  let byRouteParameters = [];
  const path =
    flattenToAppURL(content?.['@id']) || location.pathname.replace('/edit', '');
  const has_data_query_by_provider = data.has_data_query_by_provider ?? true;
  const byProviderPath = has_data_query_by_provider
    ? connected_data_parameters?.byProviderPath?.[provider_url] || {}
    : {};

  (connected_data_parameters?.byContextPath?.[path] || []).forEach(
    (data_query) => {
      if (!params[data_query.i]) {
        byContextPath.push(data_query);
      } else {
        byRouteParameters.push({ ...data_query, v: [params[data_query.i]] });
      }
    },
  );

  const filters =
    Object.keys(byProviderPath).map((key) => byProviderPath[key]) || [];

  const has_data_query_by_context = data?.has_data_query_by_context ?? true;

  const query = [
    ...(data?.data_query || []),
    ...(has_data_query_by_context ? byContextPath : []),
    ...byRouteParameters,
    ...filters,
  ];

  return query;
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

// export function mergeSchema(schema, schemaExtend, ...args) {
//   const fieldsets = {};
//   const fieldsetsOrder = [];
//   const _schema =
//     (typeof schema === 'function' ? schema(...args) : schema) || null;
//   const _schemaExtend =
//     (typeof schemaExtend === 'function'
//       ? schemaExtend(...args)
//       : schemaExtend) || null;
//   if (!_schema || (_schema && !_schemaExtend)) return null;

//   [...(_schema.fieldsets || []), ...(_schemaExtend.fieldsets || [])].forEach(
//     (fieldset) => {
//       if (!fieldsetsOrder.includes(fieldset.id)) {
//         fieldsetsOrder.push(fieldset.id);
//       }
//       if (!fieldsets[fieldset.id]) {
//         fieldsets[fieldset.id] = {};
//       }
//       fieldsets[fieldset.id] = {
//         id: fieldset.id,
//         title: fieldset.title,
//         fields: [
//           ...new Set([
//             ...(fieldsets[fieldset.id].fields || []),
//             ...(fieldset.fields || []),
//           ]),
//         ],
//       };
//     },
//   );

//   return {
//     title: _schemaExtend.title || _schema.title,
//     fieldsets,
//     properties: {
//       ...(_schema.properties || {}),
//       ...(_schemaExtend.properties || {}),
//     },
//     required: [...(_schema.required || []), ...(_schemaExtend.required || [])],
//   };
// }

export const getFilteredURL = (url, connected_data_parameters = []) => {
  if (!connected_data_parameters?.length) return url;
  let decodedURL = decodeURIComponent(url);
  //lookahead assertion to ensure that at least one character exists between '<<' and '>>';
  const queries = decodedURL.match(/^<<(?!\s*>>)[^<>]*>>$/g); //safari: don't use lookbehind
  if (!queries?.length) return url;

  const filteredQueries = queries.map((query) =>
    query.replace('<<', '').replace('>>', ''),
  );

  const keys = connected_data_parameters.map((param) => param.i);
  for (let poz in filteredQueries) {
    const key = filteredQueries[poz];
    const paramPoz = keys.indexOf(key);
    if (paramPoz > -1) {
      decodedURL = decodedURL.replace(
        `<<${key}>>`,
        connected_data_parameters[paramPoz].v[0],
      );

      continue;
    }
  }
  return decodedURL;
};
