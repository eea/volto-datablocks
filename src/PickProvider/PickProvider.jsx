// import PickObject from 'volto-addons/PickObject';
import React, { Component } from 'react';
import { addAppURL } from '@plone/volto/helpers';
import { connect } from 'react-redux';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { ObjectBrowserWidget } from '@plone/volto/components';

function getId(url) {
  const split = url.split('/');
  return split[split.length - 1];
}

function getUrl(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length) return value[0]['@id'];
  if (typeof value === 'object') return value['@id'];

  return value; // dumb fallback
}

class PickProvider extends Component {
  componentDidMount() {
    if (this.props.value) {
      this.props.getDataFromProvider(this.props.value);
    }
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (value && getUrl(value) !== getUrl(prevProps.value)) {
      this.props.getDataFromProvider(value);
    }

    // Optimization to help land the proper providerData to the chart

    // NOTE: see comments in PickVisualization.jsx, the same applies here
    const { onLoadProviderData, providerData } = this.props;
    if (
      JSON.stringify(providerData) !== JSON.stringify(prevProps.providerData) &&
      onLoadProviderData
    )
      onLoadProviderData(this.props.providerData);

    // This is a hack to pass loaded providerData. It should not be needed
    // this.props.onChange('providerData', this.props.providerData);
  }

  refresh = () => {
    const { value } = this.props;
    value && value.length && this.props.getDataFromProvider(value);
  };

  render() {
    let { value, onChange } = this.props;
    if (typeof value === 'string') {
      value = [{ '@id': value, title: getId(value) }];
    }
    return (
      <ObjectBrowserWidget
        {...this.props}
        value={value}
        onChange={(id, value) => {
          if (value && value.length) {
            onChange(id, value[0]['@id']);
          } else if (value) {
            onChange(id, value['@id']);
          } else {
            onChange(id, null);
          }
        }}
      />
    );
  }
}
//
// return (
//   <PickObject
//     id={this.props.id || 'provider'}
//     title={this.props.title || 'Provider'}
//     value={this.props.value}
//     onChange={(v1, v2) => {
//       // console.log('v1,v2', v1, v2);
//       this.props.onChange(v1, v2);
//     }}
//   />
// );

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
