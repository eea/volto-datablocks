import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Menu } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import { getDataFromProvider } from '../../../actions';
import { getConnector } from '../../../helpers';

import leftSVG from '@plone/volto/icons/left-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';

import './styles.css';

const DataConnectorView = (props) => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    activePage: 1,
    itemsPerPage: 20,
    totalItems: 0,
  });
  const { content = {} } = props;

  const provider_url = flattenToAppURL(props.location.pathname || '').replace(
    /\/$/,
    '',
  );

  const state = useSelector((state) => {
    return {
      data_providers: state.data_providers,
    };
  });

  const row_size =
    Math.min(pagination.itemsPerPage, pagination.totalItems) || 0;

  const connector = getConnector(
    provider_url,
    props.location,
    state.route_parameters,
  );

  const isPending = provider_url
    ? state.data_providers?.pendingConnectors?.[connector.url]
    : false;

  const isFailed = provider_url
    ? state.data_providers?.failedConnectors?.[connector.url]
    : false;

  const provider_data = provider_url
    ? state.data_providers?.data?.[connector.urlConnector]
    : null;

  React.useEffect(() => {
    if (provider_url && !provider_data && !isPending && !isFailed) {
      dispatch(getDataFromProvider(provider_url, null, connector.params));
    }
  });

  React.useEffect(() => {
    if (provider_data) {
      setPagination({
        ...pagination,
        totalItems: provider_data[Object.keys(provider_data)[0]]?.length,
      });
    }
    /* eslint-disable-next-line */
  }, [JSON.stringify(provider_data)]);

  return (
    <Container className="data-connector-view">
      <h2>{content.title}</h2>
      <pre>{content.sql_query}</pre>
      <div style={{ overflow: 'auto', width: '100%' }}>
        {provider_data && (
          <Table compact striped>
            <Table.Header>
              <Table.Row>
                {Object.keys(provider_data).map((k) => (
                  <Table.HeaderCell key={k}>{k}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Array(row_size)
                .fill()
                .map((_, i) => (
                  <Table.Row key={i}>
                    {Object.keys(provider_data).map((k) => (
                      <Table.Cell
                        key={`${i}-${k}`}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {provider_data[k][i]}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        )}
        {row_size > 0 ? (
          <Menu pagination>
            <Menu.Item
              as="a"
              icon
              disabled={pagination.activePage === 1}
              onClick={() => {
                if (pagination.activePage > 1) {
                  setPagination({
                    ...pagination,
                    activePage: pagination.activePage - 1,
                  });
                }
              }}
            >
              <Icon name={leftSVG} size="24px" />
            </Menu.Item>
            <Menu.Item
              as="a"
              icon
              disabled={row_size < pagination.itemsPerPage}
              onClick={() => {
                if (row_size === pagination.itemsPerPage) {
                  setPagination({
                    ...pagination,
                    activePage: pagination.activePage + 1,
                  });
                }
              }}
            >
              <Icon name={rightSVG} size="24px" />
            </Menu.Item>
          </Menu>
        ) : (
          ''
        )}
      </div>
    </Container>
  );
};

export default connect((state, props) => ({
  route_parameters: state.route_parameters,
}))(withRouter(DataConnectorView));
