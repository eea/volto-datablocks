import React from 'react';
import { compose } from 'redux';
import config from '@plone/volto/registry';
import { DefaultView } from './templates/default';
import { VisibilitySensor } from '@eeacms/volto-datablocks/components';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import { serializeNodes } from '@eeacms/volto-datablocks/serialize';

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

const getProviderDataLength = (provider_data) => {
  return provider_data
    ? provider_data[Object.keys(provider_data)[0]]?.length || 0
    : 0;
};

const SimpleDataTableView = (props) => {
  const { data = {}, pagination = {} } = props;
  const {
    columns,
    description,
    has_pagination = false,
    max_count = 5,
    placeholder = 'No results',
    show_header = false,
    template = 'default',
  } = data;

  const provider_data =
    (pagination.data[pagination.activePage]
      ? pagination.data[pagination.activePage]
      : pagination.activePage !== pagination.prevPage
      ? pagination.data[pagination.prevPage]
      : null) || props.provider_data;
  const provider_data_length = getProviderDataLength(provider_data);

  const TableView =
    config.blocks.blocksConfig.simpleDataConnectedTable?.templates?.[template]
      ?.view || DefaultView;

  // TODO: sorting
  const row_size = has_pagination
    ? !Object.keys(pagination.data).includes(pagination.activePage)
      ? provider_data_length
      : Math.min(pagination.itemsPerPage, provider_data_length) || 0
    : max_count > 0
    ? Math.min(max_count, provider_data_length)
    : provider_data_length;

  const providerColumns = Object.keys(provider_data || {});
  const showAllColumns = !Array.isArray(columns) || columns.length === 0;
  const validator = selectedColumnValidator(providerColumns);
  const selectedColumns = showAllColumns
    ? providerColumns
    : columns.filter(validator);

  const tableData = provider_data;

  return (
    <div className="simple-data-table">
      <div className={`table-title ${data.underline ? 'title-border' : ''}`}>
        {description ? serializeNodes(description) : ''}
      </div>
      <TableView
        {...props}
        has_pagination={has_pagination}
        placeholder={placeholder}
        provider_data={provider_data}
        provider_data_length={provider_data_length}
        row_size={row_size}
        selectedColumns={selectedColumns}
        show_header={show_header}
        tableData={tableData}
        getAlignmentOfColumn={getAlignmentOfColumn}
        getNameOfColumn={getNameOfColumn}
        getTitleOfColumn={getTitleOfColumn}
      />
    </div>
  );
};

export { SimpleDataTableView };

const SimpleDataTableViewWrapper = compose(
  connectToProviderData((props) => {
    const { max_count = 5 } = props.data;
    return {
      provider_url: props.data?.provider_url,
      pagination: {
        enabled: props.data.has_pagination,
        itemsPerPage:
          typeof max_count !== 'number' ? parseInt(max_count) : max_count,
      },
    };
  }),
)(SimpleDataTableView);

export default (props) => {
  return (
    <VisibilitySensor offset={{ top: -150, bottom: -150 }}>
      <SimpleDataTableViewWrapper {...props} />
    </VisibilitySensor>
  );
};
