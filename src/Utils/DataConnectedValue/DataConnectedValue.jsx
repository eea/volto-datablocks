import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import qs from 'querystring';

import { getDataFromProvider } from 'volto-datablocks/actions';
import {
  getRouteParameters,
  getConnectedDataParametersForRoute,
  getConnectedDataParametersForProvider,
  getConnectedDataParametersForContext,
  getConnectedDataParametersForPath,
} from 'volto-datablocks/helpers';
import { FormattedValue } from 'volto-datablocks/Utils';
import './styles.css';

const EMPTY = '^';

function isObject(item) {
  return typeof item === 'object' && !Array.isArray(item) && item !== null;
}

const getValue = (
  data,
  column,
  filters,
  filterIndex = 0,
  placeholder = null,
  hasQueryParammeters = true,
) => {
  /*
   * Data is an object like: {
   * AV_P_SIZE: [501.78255, 849.335, 339.9433, 733.36331, 742.50659]
   * COUNTRY: ["Albania", "Austria", "Belgium", ]
   *
   * Filters is an array of objects like:
   * {
   * i: "COUNTRY"
   * o: "plone.app.querystring.operation.selection.any"
   * v: ["BG"] }
   */
  // TODO: we implement now a very simplistic filtering, with only one type of
  // filter and only one filter is taken into consideration
  if (!data || (data && !Object.keys(data).length)) return '-';
  if (!hasQueryParammeters) return data[column]?.[0];

  if (!filters || !filters?.[filterIndex]) {
    return 'No context parameters';
  }

  let filter =
    (filters?.find &&
      filters?.find((f) => {
        let { i: index } = f;
        index = index.toLowerCase().replace('taxonomy_', '');
        return Object.keys(data)
          .map((k) => k.toLowerCase())
          .includes(index);
      })) ||
    {};

  if (
    !Array.isArray(filters) &&
    isObject(filters) &&
    Object.keys(filters).length
  ) {
    filter = filters[filterIndex];
  }

  let { i: index, v: values } = filter; // o: op,
  index = index ? index.replace('taxonomy_', '') : null;

  if (!index) return ' '; // Set "key" parameter
  if (!values || values.length === 0) return ' '; // Set "for" parameter
  if (!column) return ' '; // Set data type
  // asuming that op is "plone.app.querystring.operation.selection.any"
  const value = values?.[0];

  // compatibility with collective.taxonomy, which lower-cases index names
  const real_index =
    Object.keys(data)?.find((n) => n.toLowerCase() === index) || index;

  if (!data[real_index]) {
    return placeholder;
  }
  const pos = data[real_index].indexOf(value);

  if (pos === -1) {
    return `No value found in data provider for "${value}" in column "${index}"`;
  }
  const res = (data[column] && data[column][pos]) || placeholder;
  return res;
};

const DataConnectedValue = (props) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const {
    column,
    connected_data_parameters,
    filterIndex,
    placeholder = EMPTY,
    content,
    hasQueryParammeters,
    specifier,
    textTemplate,
    collapseLimit = null,
  } = props;

  const provider_url = props.url;

  let params =
    '?' +
    qs.stringify({
      ...qs.parse(props.location.search.replace('?', '')),
      ...getRouteParameters(
        provider_url,
        connected_data_parameters,
        props.match,
      ),
    });

  params = params.length === 1 ? '' : params;

  const url = provider_url ? `${provider_url}${params}` : null;
  const urlConnector = provider_url
    ? `${provider_url}/@connector-data${params}`
    : null;

  const isPending = provider_url
    ? props.data_providers?.pendingConnectors?.[url]
    : false;

  const provider_data = provider_url
    ? props.data_providers?.data?.[urlConnector]
    : null;

  const isFailed = provider_url
    ? props.data_providers?.failedConnectors?.[url]
    : false;

  useEffect(() => {
    if (provider_url && !provider_data && !isPending && !isFailed) {
      props.getDataFromProvider(provider_url, null, params);
    }
  });

  const dataParameters =
    getConnectedDataParametersForRoute(
      connected_data_parameters,
      provider_url,
    ) ||
    getConnectedDataParametersForPath(
      connected_data_parameters,
      content['@id'],
      filterIndex,
    ) ||
    getConnectedDataParametersForProvider(
      connected_data_parameters,
      provider_url,
    ) ||
    getConnectedDataParametersForContext(
      connected_data_parameters,
      content['@id'],
    );

  const value = getValue(
    provider_data,
    column,
    dataParameters,
    filterIndex,
    placeholder,
    hasQueryParammeters,
  );

  const collapsable = props.collapsable && value.length > collapseLimit;

  return value ? (
    <>
      <FormattedValue
        textTemplate={textTemplate}
        value={value}
        specifier={specifier}
        collapsed={collapsable && collapsed}
      />
      {collapsable ? (
        <div>
          <button
            className="readmore-button"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            {collapsed ? 'READ MORE' : 'COLLAPSE'}
          </button>
        </div>
      ) : (
        ''
      )}
    </>
  ) : (
    placeholder
  );
};

export default connect(
  (state, props) => ({
    content: state.content.data,
    connected_data_parameters: state.connected_data_parameters,
    data_providers: state.data_providers,
  }),
  {
    getDataFromProvider,
  },
)(withRouter(DataConnectedValue));
