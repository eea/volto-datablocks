import PickObject from 'volto-addons/PickObject';
import React, { Component } from 'react';
import { addAppURL } from '@plone/volto/helpers';
import { connect } from 'react-redux';
import { getDataFromProvider } from 'volto-datablocks/actions';

class PickProvider extends Component {
  componentDidMount() {
    if (this.props.value) {
      this.props.getDataFromProvider(this.props.value);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value && this.props.value !== prevProps.value) {
      this.props.getDataFromProvider(this.props.value);
    }

    // Optimization to help land the proper providerData to the chart

    // NOTE: see comments in PickVisualization.jsx, the same applies here
    if (
      JSON.stringify(this.props.providerData) !==
      JSON.stringify(prevProps.providerData)
    ) {
      this.props.onLoadProviderData &&
        this.props.onLoadProviderData(this.props.providerData);

      // This is a hack to pass loaded providerData. It should not be needed
      // this.props.onChange('providerData', this.props.providerData);
    }
  }

  refresh = () => {
    this.props.value && this.props.getDataFromProvider(this.props.value);
  };

  render() {
    return (
      <PickObject
        id="provider"
        title="Provider"
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}

function getProviderData(state, props) {
  let path = props?.value || null;

  if (!path) return;

  path = `${path}/@connector-data`;
  const url = `${addAppURL(path)}/@connector-data`;

  const data = state.data_providers.data || {};
  const res = path ? data[path] || data[url] : [];
  return res;
}

export default connect(
  (state, props) => {
    const providerData = getProviderData(state, props);

    return {
      providerData,
    };
  },
  { getDataFromProvider },
)(PickProvider);
