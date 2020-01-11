import React, { Component } from 'react';
import { addAppURL } from '@plone/volto/helpers';
import { connect } from 'react-redux';
import { DATA_PROVIDER_TYPES } from 'volto-datablocks/constants';
import { SelectWidget } from '@plone/volto/components';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { searchContent } from '@plone/volto/actions';

function getProviderData(state, props) {
  let path = props?.value || null;

  if (!path) return;

  path = `${path}/@connector-data`;
  const url = `${addAppURL(path)}/@connector-data`;

  const data = state.data_providers.data || {};
  const res = path ? data[path] || data[url] : [];
  return res;
}

class PickProvider extends Component {
  componentDidMount() {
    // TODO: this needs to use a subrequest
    this.props.searchContent(
      '',
      {
        object_provides: DATA_PROVIDER_TYPES,
      },
      'getProviders',
    );
    if (this.props.value) {
      this.props.getDataFromProvider(this.props.value);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value && this.props.value !== prevProps.value)
      this.props.getDataFromProvider(this.props.value);

    if (
      JSON.stringify(this.props.providerData) !==
      JSON.stringify(prevProps.providerData)
    )
      this.props.onLoadProviderData(this.props.providerData);
  }

  render() {
    const selectProviders = this.props.providers.map(el => {
      return [el['@id'], el.title];
    });

    return (
      <SelectWidget
        id="select-provider-url"
        placeholder="Select..."
        title="Data provider"
        fluid
        selection
        choices={selectProviders}
        value={this.props.value || ''}
        onChange={(id, value) => this.props.onChange(value)}
      />
    );
  }
}

export default connect(
  (state, props) => {
    const providerData = getProviderData(state, props);

    return {
      providers: state.search.subrequests?.getProviders?.items || [],
      providerData,
    };
  },
  { searchContent, getDataFromProvider },
)(PickProvider);
