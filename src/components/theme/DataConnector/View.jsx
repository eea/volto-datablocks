import { hasBlocksData } from '@plone/volto/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import React from 'react';
import { compose } from 'redux';
import { Container } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import { Table, Menu, Loader } from 'semantic-ui-react';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';

import leftSVG from '@plone/volto/icons/left-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';

import './styles.less';

const getProviderDataLength = (provider_data) => {
  return provider_data
    ? provider_data[Object.keys(provider_data)[0]]?.length || 0
    : 0;
};

export function DataConnectorTable(props) {
  const { content, pagination = {}, updatePagination } = props;
  const prev_provider_data = pagination.data[pagination.activePage]
    ? pagination.data[pagination.activePage]
    : pagination.activePage !== pagination.prevPage
    ? pagination.data[pagination.prevPage]
    : null;
  const provider_data = props.provider_data || prev_provider_data;
  const prev_provider_data_length = getProviderDataLength(prev_provider_data);
  const provider_data_length = getProviderDataLength(provider_data);

  const row_size = !Object.keys(pagination.data).includes(pagination.activePage)
    ? prev_provider_data_length
    : Math.min(pagination.itemsPerPage, provider_data_length) || 0;

  const columns = Object.keys(provider_data || {});

  return (
    <>
      <pre>{content.sql_query}</pre>
      <pre>{content.Readme}</pre>
      <div style={{ overflow: 'auto', width: '100%' }}>
        {row_size ? (
          <Table textAlign="left" striped>
            <Table.Header>
              <Table.Row>
                {columns.map((column) => (
                  <Table.HeaderCell key={column}>{column}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Array(Math.max(0, row_size))
                .fill()
                .map((_, i) => (
                  <Table.Row key={i}>
                    {columns.map((column, j) => (
                      <Table.Cell key={`${i}-${column}}`}>
                        {provider_data[column][i]}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell
                  colSpan={columns.length}
                  style={{ textAlign: 'center' }}
                >
                  <Menu pagination>
                    <Menu.Item
                      as="a"
                      icon
                      disabled={
                        props.loadingProviderData || pagination.activePage === 1
                      }
                      onClick={() => {
                        if (pagination.activePage > 1) {
                          updatePagination({
                            activePage: pagination.activePage - 1,
                          });
                        }
                      }}
                    >
                      <Icon name={leftSVG} size="24px" />
                    </Menu.Item>
                    <Menu.Item fitted>
                      <Loader
                        disabled={!props.loadingProviderData}
                        active
                        inline
                        size="tiny"
                      />
                    </Menu.Item>
                    <Menu.Item
                      as="a"
                      icon
                      disabled={
                        props.loadingProviderData ||
                        pagination.activePage === pagination.lastPage
                      }
                      onClick={() => {
                        if (row_size === pagination.itemsPerPage) {
                          updatePagination({
                            activePage: pagination.activePage + 1,
                          });
                        }
                      }}
                    >
                      <Icon name={rightSVG} size="24px" />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        ) : (
          <p>No data</p>
        )}
      </div>
    </>
  );
}

export const ConnectedDataConnectorTable = compose(
  connectToProviderData((props) => {
    return {
      provider_url: flattenToAppURL(props.location.pathname || '').replace(
        /\/$/,
        '',
      ),
      pagination: {
        enabled: true,
        itemsPerPage: 14,
      },
    };
  }),
)(DataConnectorTable);

const DataConnectorView = (props) => {
  const { content } = props;

  return (
    <Container id="page-document" className="data-connector-view">
      {hasBlocksData(content) ? (
        <RenderBlocks {...props} />
      ) : (
        <>
          <h2>{content.title}</h2>
          <ConnectedDataConnectorTable {...props} />
        </>
      )}
    </Container>
  );
};

export default DataConnectorView;
