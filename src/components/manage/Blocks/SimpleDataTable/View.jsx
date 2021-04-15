import React, { useEffect } from 'react';
import { compose } from 'redux';
import config from '@plone/volto/registry';

import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import { serializeNodes } from 'volto-datablocks/serialize';
import { connectToDataParameters } from 'volto-datablocks/helpers';

import { DefaultView } from './templates/default';
import './styles.less';

const SimpleDataTableView = (props) => {
  const { data = {}, provider_data = {}, updatePagination = () => {} } = props;
  const { description, max_count, template } = data;

  const tableTemplate = template || 'default';
  const TableView =
    config.blocks.blocksConfig.simpleDataConnectedTable?.templates?.[
      tableTemplate
    ]?.view || DefaultView;

  useEffect(() => {
    updatePagination({
      itemsPerPage: max_count
        ? typeof max_count !== 'number'
          ? parseInt(max_count) || 5
          : max_count
        : max_count || 5,
      totalItems: provider_data?.[Object.keys(provider_data)?.[0]]?.length,
    });
    /* eslint-disable-next-line */
  }, [JSON.stringify(provider_data), max_count]);

  return (
    <div className={`simple-data-table ${template}`}>
      <div className={`table-title ${data.underline ? 'title-border' : ''}`}>
        {description ? serializeNodes(description) : ''}
      </div>

      <TableView {...props} />
    </div>
  );
};

export default compose(() => {
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
}, connectToDataParameters)(SimpleDataTableView);
