import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDataFromProvider } from '../actions';
import { addAppURL } from '@plone/volto/helpers';
import { Table } from 'semantic-ui-react';

export class DataConnectorView extends Component {
  componentWillMount() {
    this.props.getDataFromProvider(this.props.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.props.getDataFromProvider(this.props.pathname);
    }
  }

  render() {
    const { content, provider_data } = this.props;
    const row_size =
      (provider_data && provider_data[Object.keys(provider_data)[0]].length) ||
      0;
    return (
      <div className="data-connector-view">
        <h2>{content.title}</h2>
        <pre>{content.sql_query}</pre>
        <div style={{ overflow: 'auto', width: '100%' }}>
          {provider_data && (
            <Table compact striped>
              <Table.Header>
                <Table.Row>
                  {Object.keys(provider_data).map(k => (
                    <Table.HeaderCell key={k}>{k}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Array(row_size)
                  .fill()
                  .map((_, i) => (
                    <Table.Row key={i}>
                      {Object.keys(provider_data).map(k => (
                        <Table.Cell key={`${i}-${k}`}>
                          {provider_data[k][i]}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          )}
        </div>
      </div>
    );
  }
}

function getProviderData(state, props) {
  const path = `${props.location.pathname}/@connector-data`;
  const url = `${addAppURL(props.location.pathname)}/@connector-data`;
  console.log('data providers', state.data_providers.data, url);
  const data = state.data_providers.data || {};
  return data[url] || data[path];
}

export default connect(
  (state, props) => ({
    provider_data: getProviderData(state, props),
  }),
  {
    getDataFromProvider,
  },
)(DataConnectorView);
