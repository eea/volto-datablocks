import { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import qs from 'querystring';

import { getDataFromProvider } from 'volto-datablocks/actions';
import {
  getMatchParams,
  getConnectedDataParametersForProvider,
  getConnectedDataParametersForContext,
  getConnectedDataParametersForPath,
} from 'volto-datablocks/helpers';
import { formatValue } from 'volto-datablocks/format';
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
  placeholder = EMPTY,
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
  if (!data || (data && !Object.keys(data).length)) return 'No data provider';
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

const DataEntity = (props) => {
  const {
    column,
    connected_data_parameters,
    filterIndex,
    format,
    placeholder,
    content,
    hasQueryParammeters,
  } = props;

  let history = useHistory();
  const provider_url = props.url;
  // const contentPath = flattenToAppURL(content['@id']);
  const matchParams = getMatchParams(props.match);

  const router_parameters = useSelector((state) => {
    return { ...matchParams, ...state.router_parameters.data };
  });

  const params =
    '?' +
    qs.stringify({
      ...qs.parse(history.location.search.replace('?', '')),
      ...(router_parameters || {}),
    });

  const paramsObj = qs.parse(params.replace('?', ''));

  const paramsObjKeys = Object.keys(paramsObj);

  const isPending = useSelector((state) => {
    if (provider_url === null) return false;

    const url = `${provider_url}${params}`;
    const rv = provider_url
      ? state.data_providers?.pendingConnectors?.[url]
      : false;
    return rv;
  });

  const provider_data = useSelector((state) => {
    if (provider_url === null) return null;
    const url = `${provider_url}/@connector-data${params}`;
    return provider_url ? state.data_providers?.data?.[url] : null;
  });

  useEffect(() => {
    if (provider_url && !provider_data && !isPending) {
      props.getDataFromProvider(provider_url, null, params);
    }
  });

  const filtersByQueryParams = paramsObjKeys.length
    ? paramsObjKeys.map((key) => ({
        i: key,
        o: 'plone.app.querystring.operation.selection.any',
        v: [paramsObj[key]],
      }))
    : null;

  const dataParameters =
    filtersByQueryParams ||
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

  return formatValue(value, format);
};

export default connect(
  (state, props) => ({
    content: state.content.data,
    connected_data_parameters: state.connected_data_parameters,
    router_parameters: state.router_parameters,
  }),
  {
    getDataFromProvider,
  },
)(withRouter(DataEntity));
