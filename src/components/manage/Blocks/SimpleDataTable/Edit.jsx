import React, { Component } from 'react';
import { compose } from 'redux';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import config from '@plone/volto/registry';
import { VisibilitySensor } from '@eeacms/volto-datablocks/components';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';

import { SimpleDataTableSchema } from './schema';
import { SimpleDataTableView } from './View';

const DefaultEdit = compose(
  connectToProviderData((props) => {
    const { max_count = 5 } = props.data;
    return {
      provider_url:
        props.visualization_data?.provider_url ||
        props.data?.provider_url ||
        props.data?.url,
      pagination: {
        enabled: props.data.has_pagination,
        itemsPerPage:
          typeof max_count !== 'number' ? parseInt(max_count) : max_count,
      },
    };
  }),
)((props) => {
  const { schema = {} } = props;

  return (
    <>
      <SimpleDataTableView {...props} />
      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            props.onChangeBlock(props.block, {
              ...props.data,
              [id]: value,
            });
          }}
          formData={props.data}
        />
      </SidebarPortal>
    </>
  );
});

class Edit extends Component {
  getSchema = () => {
    const template = this.props.data.template || 'default';

    const templateSchema =
      config.blocks.blocksConfig.simpleDataConnectedTable?.templates?.[template]
        ?.schema || {};

    const schema = SimpleDataTableSchema(
      config,
      typeof templateSchema === 'function'
        ? templateSchema(config)
        : templateSchema,
    );

    // TODO: create picker for columns to include
    const { provider_data } = this.props;

    if (!provider_data) return schema;

    const choices = Array.from(
      Object.keys(provider_data).sort((a, b) => a - b),
    ).map((n) => [n, n]);
    schema.properties.columns.schema.properties.column.choices = choices;
    schema.properties.columns.schema.properties.column_link.choices = choices;

    return schema;
  };

  render() {
    const { template = 'default' } = this.props.data;
    const schema = this.getSchema();

    const TableEdit =
      config.blocks.blocksConfig.simpleDataConnectedTable?.templates?.[template]
        ?.edit || DefaultEdit;

    return <TableEdit {...this.props} schema={schema} />;
  }
}

const EditWrapper = compose(
  connectToProviderData((props) => {
    const { max_count = 5 } = props.data;
    return {
      provider_url:
        props.visualization_data?.provider_url ||
        props.data?.provider_url ||
        props.data?.url,
      pagination: {
        enabled: props.data.has_pagination,
        itemsPerPage:
          typeof max_count !== 'number' ? parseInt(max_count) : max_count,
      },
    };
  }),
)(Edit);

export default (props) => {
  return (
    <VisibilitySensor offset={{ top: -150, bottom: -150 }}>
      <EditWrapper {...props} />
    </VisibilitySensor>
  );
};
