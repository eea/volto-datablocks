import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import { getRouteParameters } from 'volto-datablocks/helpers';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { Container, Table, Menu } from 'semantic-ui-react';
import qs from 'querystring';

import leftSVG from '@plone/volto/icons/left-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';

import './styles.css';

const DataConnectorView = (props) => {
  const history = useHistory();
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

  const row_size =
    Math.min(pagination.itemsPerPage, pagination.totalItems) || 0;

  const params = useSelector((state) => {
    return (
      '?' +
      qs.stringify({
        ...qs.parse(history.location.search.replace('?', '')),
        ...getRouteParameters(
          provider_url,
          state.connected_data_parameters,
          props.match,
        ),
        p: pagination.activePage,
        nrOfHits: pagination.itemsPerPage,
      })
    );
  });

  const isPending = useSelector((state) => {
    if (provider_url === null) return false;

    const url = `${provider_url}${params}`;
    const rv = provider_url
      ? state.data_providers?.pendingConnectors?.[url]
      : false;
    return rv;
  });

  const isFailed = useSelector((state) => {
    if (provider_url === null) return false;

    const url = `${provider_url}${params}`;
    const rv = provider_url
      ? state.data_providers?.failedConnectors?.[url]
      : false;
    return rv;
  });

  const provider_data = useSelector((state) => {
    if (provider_url === null) return null;
    const url = `${provider_url}/@connector-data${params}`;
    return provider_url ? state.data_providers?.data?.[url] : null;
  });

  React.useEffect(() => {
    if (provider_url && !provider_data && !isPending && !isFailed) {
      dispatch(getDataFromProvider(provider_url, null, params));
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
                      <Table.Cell key={`${i}-${k}`}>
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

export default withRouter(DataConnectorView);
