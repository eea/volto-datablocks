import { Table, Menu } from 'semantic-ui-react';
import { compose } from 'redux';
import React, { useEffect } from 'react';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import { Icon } from '@plone/volto/components';
import { serializeNodes } from 'volto-datablocks/serialize';
import {
  filterDataByParameters,
  connectToDataParameters,
} from 'volto-datablocks/helpers';
import RenderComponent from './components';
import leftSVG from '@plone/volto/icons/left-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';

import './styles.less';

const getAlignmentOfColumn = (col, idx) => {
  return typeof col !== 'string' && col.textAlign
    ? col.textAlign
    : idx === 0
    ? 'left'
    : 'right';
};

const getNameOfColumn = (col) => {
  return typeof col === 'string' ? col : col.column;
};

const getTitleOfColumn = (col) => {
  return typeof col === 'string' ? col : col.title || getNameOfColumn(col);
};

const selectedColumnValidator = (allColDefs) => (colDef) => {
  return typeof colDef === 'string'
    ? false
    : allColDefs.includes(colDef?.column);
};

const SimpleDataTableView = (props) => {
  const {
    data = {},
    provider_data = {},
    pagination = {},
    updatePagination,
    connected_data_parameters,
  } = props;
  const { show_header, description, max_count, columns } = data;

  useEffect(() => {
    if (provider_data) {
      updatePagination({
        itemsPerPage: max_count
          ? typeof max_count !== 'number'
            ? parseInt(max_count) || 5
            : max_count
          : max_count || 5,
        totalItems: provider_data[Object.keys(provider_data)[0]]?.length,
      });
    }
  }, [JSON.stringify(provider_data)]);
  // TODO: sorting
  const row_size = Math.min(pagination.itemsPerPage, pagination.totalItems);
  const providerColumns = Object.keys(provider_data || {});
  const sureToShowAllColumns = !Array.isArray(columns) || columns.length === 0;
  const validator = selectedColumnValidator(providerColumns);
  const selectedColumns = sureToShowAllColumns
    ? providerColumns
    : columns.filter(validator);

  const tableData = connected_data_parameters
    ? filterDataByParameters(provider_data, connected_data_parameters)
    : provider_data;

  return (
    <div className="simple-data-table">
      <div className={`table-title ${data.underline ? 'title-border' : ''}`}>
        {description ? serializeNodes(description) : ''}
      </div>
      {row_size ? (
        <Table
          textAlign="left"
          striped={data.striped}
          className={`unstackable ${data.bordered ? 'no-borders' : ''}
          ${data.compact_table ? 'compact-table' : ''}`}
        >
          {show_header ? (
            <Table.Header>
              <Table.Row>
                {selectedColumns.map((colDef, j) => (
                  <Table.HeaderCell
                    key={getNameOfColumn(colDef)}
                    className={getAlignmentOfColumn(colDef, j)}
                  >
                    {getTitleOfColumn(colDef)}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
          ) : null}
          <Table.Body>
            {Array(Math.max(0, row_size))
              .fill()
              .map((_, i) => (
                <Table.Row key={i}>
                  {selectedColumns.map((colDef, j) => (
                    <Table.Cell
                      key={`${i}-${getNameOfColumn(colDef)}`}
                      textAlign={getAlignmentOfColumn(colDef, j)}
                    >
                      <RenderComponent
                        tableData={tableData}
                        colDef={colDef}
                        row={i}
                        {...props}
                      />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell
                colSpan={selectedColumns.length}
                style={{ textAlign: 'center' }}
              >
                <Menu pagination>
                  <Menu.Item
                    as="a"
                    icon
                    disabled={pagination.activePage === 1}
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
                  <Menu.Item
                    as="a"
                    icon
                    disabled={row_size < pagination.itemsPerPage}
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
        'No results'
      )}
    </div>
  );
};

export default compose(
  () =>
    connectBlockToProviderData(SimpleDataTableView, {
      hasPagination: true,
    }),
  connectToDataParameters,
)(SimpleDataTableView);
