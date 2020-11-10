import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import { addAppURL } from '@plone/volto/helpers';
import { getDataFromProvider } from 'volto-datablocks/actions';
import {
  getConnectedDataParametersForProvider,
  getConnectedDataParametersForContext,
  getConnectedDataParametersForPath,
} from 'volto-datablocks/helpers';
import { formatValue } from 'volto-datablocks/format';

import '../css/styles.css';

const EMPTY = '^';

function isObject(item) {
  return typeof item === 'object' && !Array.isArray(item) && item !== null;
}

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

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
    console.log(
      filters,
      'This DataConnectedValue is used in a context without parameters',
    );
    return 'No context parameters';
  }
  if (
    !Array.isArray(filters) &&
    isObject(filters) &&
    Object.keys(filters).length
  ) {
    filters = Object.keys(filters).map(filter => filters[filter]);
  }

  const filter =
    filters?.find(f => {
      let { i: index } = f;
      index = index.toLowerCase().replace('taxonomy_', '');
      return Object.keys(data)
        .map(k => k.toLowerCase())
        .includes(index);
    }) || {};

  let { i: index, v: values } = filter; // o: op,
  index = index ? index.replace('taxonomy_', '') : null;

  if (!index) return ' '; // Set "key" parameter
  if (!values || values.length === 0) return ' '; // Set "for" parameter
  if (!column) return ' '; // Set data type
  // asuming that op is "plone.app.querystring.operation.selection.any"
  const value = values?.[0];

  // compatibility with collective.taxonomy, which lower-cases index names
  const real_index =
    Object.keys(data)?.find(n => n.toLowerCase() === index) || index;

  if (!data[real_index]) {
    console.log('NOT_AN_INDEX_IN_DATA:', index, data);
    return placeholder;
  }
  const pos = data[real_index].indexOf(value);

  if (pos === -1) {
    return `No value found in data provider for "${value}" in column "${index}"`;
  }
  const res = (data[column] && data[column][pos]) || placeholder;
  return res;
};

const DataEntity = props => {
  const {
    column,
    connected_data_parameters,
    filterIndex,
    format,
    placeholder,
    data_providers,
    content,
    url,
    hasQueryParammeters,
  } = props;
  // provider_data: getProviderData(state, props),
  const [state, setState] = useState({
    firstDataProviderUpdate: true,
  });
  const prevUrl = usePrevious(url);
  const data_provider = url
    ? data_providers?.data?.[`${url}/@connector-data`] ||
      data_providers?.data?.[`${addAppURL(url)}/@connector-data`]
    : {};
  if (
    __CLIENT__ &&
    !data_provider &&
    !data_providers.pendingConnectors[url] &&
    ((prevUrl && prevUrl !== url) || (url && state.firstDataProviderUpdate))
  ) {
    url &&
      state.firstDataProviderUpdate &&
      setState({
        ...state,
        firstDataProviderUpdate: false,
      });
    props.getDataFromProvider(url);
  }
  const dataParameters =
    getConnectedDataParametersForPath(
      connected_data_parameters,
      content['@id'],
      filterIndex,
    ) ||
    getConnectedDataParametersForProvider(connected_data_parameters, url) ||
    getConnectedDataParametersForContext(
      connected_data_parameters,
      content['@id'],
    );
  const value = getValue(
    data_provider,
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
    data_providers: state.data_providers,
    content: state.content.data,
    connected_data_parameters: state.connected_data_parameters,
  }),
  {
    getDataFromProvider,
  },
)(DataEntity);
