import { Component } from 'react';
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

function getValue(data, column, filters, placeholder = EMPTY) {
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
  if (!(filters && filters.length))
    console.log(
      'This DataConnectedValue is used in a context without parameters',
    );

  if (!data || (!filters || !filters.length)) return placeholder;

  const filter = filters[0];
  const { i: index, v: values } = filter; // o: op,

  if (!values || values.length === 0) return placeholder;

  // asuming that op is "plone.app.querystring.operation.selection.any"
  const value = values[0];
  if (!data[index]) {
    console.log('NOT_AN_INDEX_IN_DATA:', index, data);
    return placeholder;
  }
  const pos = data[index].indexOf(value);

  if (pos === -1) {
    console.log(`No value found in data for "${value}" in column "${index}"`);
    return placeholder;
  }
  return (data[column] && data[column][pos]) || placeholder;
}

class DataEntity extends Component {
  componentDidMount() {
    const url = this.props.url;
    if (url) this.props.getDataFromProvider(url);
  }

  componentDidUpdate(prevProps, prevState) {
    const url = this.props.url;
    const prevUrl = prevProps.url;
    if (url && url !== prevUrl) {
      this.props.getDataFromProvider(url);
    }
  }

  render() {
    const { column, provider_data, format, placeholder } = this.props;
    const value = getValue(
      provider_data,
      column,
      // this.props.content.data_query,
      this.props.connected_data_parameters,
      placeholder,
    );

    return formatValue(value, format);
  }
}

function getProviderData(state, props) {
  if (!props.url) return;

  const data = state.data_providers.data || {};
  return props.url
    ? data[`${props.url}/@connector-data`] ||
        data[`${addAppURL(props.url)}/@connector-data`]
    : [];
}

export default connect(
  (state, props) => {
    const { url } = props; // this is the provider url
    return {
      provider_data: getProviderData(state, props),
      content: state.content.data,
      connected_data_parameters:
        getConnectedDataParametersForProvider(state, url) ||
        getConnectedDataParametersForContext(
          state,
          state.router.location.pathname,
        ) ||
        getConnectedDataParametersForPath(
          state,
          state.router.location.pathname
        ),
    };
  },
  {
    getDataFromProvider,
  },
)(DataEntity);
