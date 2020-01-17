// import { settings } from '~/config';
import { Component } from 'react';
import { connect } from 'react-redux';

import { addAppURL } from '@plone/volto/helpers';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { getConnectedDataParameters } from 'volto-datablocks/helpers';
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
    console.warn(
      'This DataConnectedValue is used in a context without parameters',
    );

  if (!data || (!filters || !filters.length)) return placeholder;

  const filter = filters[0];
  const { i: index, v: values } = filter; // o: op,

  if (!values || values.length === 0) return placeholder;

  // asuming that op is "plone.app.querystring.operation.selection.any"
  const value = values[0];
  if (!data[index]) {
    console.warn('not index in data', index, data);
    return placeholder;
  }
  const pos = data[index].indexOf(value);

  if (pos === -1) {
    console.warn(`No value found in data for "${value}" in column "${index}"`);
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
