import { addAppURL } from '@plone/volto/helpers';
import { Component } from 'react';
import { connect } from 'react-redux';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { getConnectedDataParameters } from 'volto-datablocks/helpers';

import '../css/styles.css';
import Humanize from 'humanize-plus';

function getValue(data, column, filters) {
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

  if (!data) return '';
  if (!filters || !filters.length) return '';
  const filter = filters[0];
  const { i: index, v: values } = filter; // o: op,

  if (!values || values.length === 0) return '';

  // asuming that op is "plone.app.querystring.operation.selection.any"
  const value = values[0];
  const pos = data[index].indexOf(value);

  if (pos === -1) {
    console.warn(`No value found in data for "${value}" in column "${index}"`);
    return '';
  }
  return data[column] && data[column][pos];
}

const valueFormatters = {
  raw: value => value,
  compactnumber: value => Humanize.compactInteger(value),
  percentage: value => `${value}%`,
};

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
    console.log('rendering dataentity', this.props);
    const { column, provider_data } = this.props;

    const value = getValue(
      provider_data,
      column,
      this.props.content.data_query,
    );

    if (this.props.format) {
      return valueFormatters[this.props.format](value);
    }
    return value;
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
  (state, props) => ({
    provider_data: getProviderData(state, props),
    content: state.content.data,
    connected_data_parameters: getConnectedDataParameters(state, props),
  }),
  {
    getDataFromProvider,
  },
)(DataEntity);
