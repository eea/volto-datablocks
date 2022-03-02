import React from 'react';
import { compose } from 'redux';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import config from '@plone/volto/registry';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import getSchema from './schema';
import { View } from './View';
import './style.less';

const Edit = (props) => {
  const type = props.data.type;
  const blockSchema =
    config.blocks.blocksConfig.custom_connected_block.blocks?.[type]
      ?.getSchema || null;
  const schemaObject = getSchema(props, config, blockSchema?.(props, config));
  const blockTitle =
    config.blocks.blocksConfig.custom_connected_block.blocks?.[type]?.title ||
    'Custom connected block';

  return (
    <>
      <View {...props} mode="edit" blockTitle={blockTitle} />

      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={schemaObject}
          title={schemaObject.title}
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
};

export default compose(
  connectToProviderData((props) => ({
    provider_url: props.data?.provider_url,
  })),
)(Edit);
