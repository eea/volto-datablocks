import React, { Component } from 'react';
import { compose } from 'redux';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import config from '@plone/volto/registry';

import { connectBlockToProviderData } from '../../../../hocs';
import { connectToDataParameters } from '../../../../helpers';

import { SimpleDataTableSchema } from './schema';
import { SimpleDataTableView } from './View';

class Edit extends Component {
  getSchema = () => {
    const template = this.props.data.template || 'default';
    const templateSchema =
      config.blocks.blocksConfig.simpleDataConnectedTable?.templates?.[template]
        ?.schema || {};

    const schema = SimpleDataTableSchema(config, templateSchema(config));

    // TODO: create picker for columns to include
    const { provider_data } = this.props;

    if (!provider_data) return schema;

    const choices = Array.from(Object.keys(provider_data).sort()).map((n) => [
      n,
      n,
    ]);

    schema.properties.columns.schema.properties.column.choices = choices;
    schema.properties.columns.schema.properties.column_link.choices = choices;

    return schema;
  };

  render() {
    const schema = this.getSchema();

    return (
      <>
        <SimpleDataTableView {...this.props} />

        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={this.getSchema()}
            title={schema.title}
            onChangeField={(id, value) => {
              this.props.onChangeBlock(this.props.block, {
                ...this.props.data,
                [id]: value,
              });
            }}
            formData={this.props.data}
          />
        </SidebarPortal>
      </>
    );
  }
}

export default compose(connectToDataParameters, (Edit) => {
  return connectBlockToProviderData(Edit, {
    pagination: {
      getEnabled: (props) => props.data.has_pagination,
      getItemsPerPage: (props) => {
        const { max_count = 5 } = props.data;
        return typeof max_count !== 'number' ? parseInt(max_count) : max_count;
      },
    },
  });
})(Edit);
