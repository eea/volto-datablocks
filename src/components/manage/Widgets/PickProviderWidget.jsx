import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { getRouteParameters } from 'volto-datablocks/helpers';
import { ObjectBrowserWidget } from '@plone/volto/components';
import qs from 'querystring';

function getId(url) {
  const split = url.split('/');
  return split[split.length - 1];
}

function getUrl(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length) return value[0]['@id'];
  if (typeof value === 'object') return value['@id'];

  return value;
}

class PickProvider extends Component {
  constructor(props) {
    super(props);
    this.getParams = this.getParams.bind(this);
    this.getProviderData = this.getProviderData.bind(this);
    this.getDataFromProvider = this.getDataFromProvider.bind(this);
  }

  componentDidMount() {
    const provider_url = getUrl(this.props.value);
    this.getDataFromProvider(provider_url);
  }

  componentDidUpdate(prevProps) {
    const provider_url = getUrl(this.props.value);
    const prev_provider_url = getUrl(prevProps.value);
    const providerData = this.getProviderData(provider_url);
    const prevProviderData = this.getProviderData(prev_provider_url);
    this.getDataFromProvider(provider_url);

    // Optimization to help land the proper providerData to the chart

    // NOTE: see comments in PickVisualization.jsx, the same applies here
    const { onLoadProviderData } = this.props;
    if (
      JSON.stringify(providerData) !== JSON.stringify(prevProviderData) &&
      onLoadProviderData
    )
      onLoadProviderData(providerData);

    // This is a hack to pass loaded providerData. It should not be needed
    // this.props.onChange('providerData', providerData);
  }

  getParams = (provider_url) => {
    const params =
      '?' +
      qs.stringify({
        ...qs.parse(this.props.location.search.replace('?', '')),
        ...(getRouteParameters(
          provider_url,
          this.props.connected_data_parameters,
          this.props.match,
        ) || {}),
      });

    return params.length > 1 ? params : '';
  };

  getProviderData = (provider_url) => {
    return provider_url
      ? this.props.data_providers?.data?.[
          `${provider_url}/@connector-data${this.getParams(provider_url)}`
        ]
      : null;
  };

  getDataFromProvider = (provider_url) => {
    const params = this.getParams(provider_url);

    const isPending = provider_url
      ? this.props.data_providers?.pendingConnectors?.[
          `${provider_url}${params}`
        ]
      : false;

    const isFailed = provider_url
      ? this.props.data_providers?.failedConnectors?.[
          `${provider_url}${params}`
        ]
      : false;

    const provider_data = provider_url
      ? this.props.data_providers?.data?.[
          `${provider_url}/@connector-data${params}`
        ]
      : null;

    if (provider_url && !provider_data && !isPending && !isFailed) {
      this.props.getDataFromProvider(provider_url, null, params);
    }
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

export default connect(
  (state, props) => ({
    data_providers: state.data_providers,
    connected_data_parameters: state.connected_data_parameters,
  }),
  { getDataFromProvider },
)(withRouter(PickProvider));
