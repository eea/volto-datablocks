import { addAppURL } from '@plone/volto/helpers';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDataFromProvider } from '../actions';

import 'draft-js-focus-plugin/lib/plugin.css';
import './styles.css';

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

const propTypes = {
  blockProps: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  // theme: PropTypes.object.isRequired,
};

class DataEntity extends Component {
  componentDidMount() {
    const url = this.props.blockProps.url;
    if (url) this.props.getDataFromProvider(url);
  }
  componentDidUpdate(prevProps, prevState) {
    const url = this.props.blockProps.url;
    const prevUrl = prevProps.blockProps.url;
    if (url && url !== prevUrl) {
      this.props.getDataFromProvider(url);
    }
  }
  render() {
    const { blockProps } = this.props; // also has contentState
    console.log('rendering dataentity', this.props);

    const value = getValue(
      this.props.provider_data,
      blockProps.column,
      this.props.content.data_query,
    );

    return <span className="inline-data-entity">{value}</span>;
  }
}

DataEntity.propTypes = propTypes;
DataEntity.defaultProps = {
  className: null,
  entityKey: null,
  target: null,
};

function getProviderData(state, props) {
  let path = props?.blockProps?.url || null;

  if (!path) return;

  path = `${path}/@connector-data`;
  const url = `${addAppURL(path)}/@connector-data`;

  const data = state.data_providers.data || {};
  return path ? data[path] || data[url] : [];
}

export default connect(
  (state, props) => ({
    provider_data: getProviderData(state, props),
    content: state.content.data,
  }),
  {
    getDataFromProvider,
  },
)(DataEntity);
