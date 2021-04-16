import React from 'react';
import { compose } from 'redux';
import config from '@plone/volto/registry';

import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import { serializeNodes } from 'volto-datablocks/serialize';
import { connectToDataParameters } from 'volto-datablocks/helpers';

import { DefaultView } from './templates/default';
import './styles.less';

const getProviderData = (provider_data) => {
  return provider_data &&
    Object.keys(provider_data).length &&
    provider_data[Object.keys(provider_data)[0]].length
    ? provider_data
    : null;
};

const SimpleDataTableView = (props) => {
  const { data = {} } = props;
  const { description, template, has_pagination = false } = data;

  const tableTemplate = template || 'default';
  const TableView =
    config.blocks.blocksConfig.simpleDataConnectedTable?.templates?.[
      tableTemplate
    ]?.view || DefaultView;

  const provider_data = has_pagination
    ? getProviderData(props.provider_data) ||
      getProviderData(props.prev_provider_data)
    : getProviderData(props.provider_data);

  return (
    <div className={`simple-data-table ${template}`}>
      <div className={`table-title ${data.underline ? 'title-border' : ''}`}>
        {description ? serializeNodes(description) : ''}
      </div>

      <TableView {...props} provider_data={provider_data} />
    </div>
  );
};

export default compose(connectToDataParameters, (SimpleDataTableView) => {
  return connectBlockToProviderData(SimpleDataTableView, {
    pagination: {
      getEnabled: (props) => props.data.has_pagination,
      getItemsPerPage: (props) => {
        const { max_count = 5 } = props.data;
        return max_count
          ? typeof max_count !== 'number'
            ? parseInt(max_count) || 5
            : max_count
          : max_count || 5;
      },
    },
  });
})(SimpleDataTableView);
