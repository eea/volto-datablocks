import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { Segment } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import getSchema from './schema';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import CustomView from './View';
import './style.less';

const Edit = (props) => {
  const schema = getSchema();
  const type = props.data.type;
  const customSchema =
    config.blocks.blocksConfig.custom_connected_block.blocks?.[
      type
    ]?.getSchema?.(props) ||
    config.blocks.blocksConfig.custom_connected_block.blocks?.[type]?.schema ||
    null;

  return (
    <>
      <CustomView {...props} mode="edit" />

      <SidebarPortal selected={props.selected}>
        <div className="columns-tabs-sidebar no-inline-form-header">
          <Segment>
            <header className="header pulled">
              <h2>{schema.title}</h2>
            </header>
          </Segment>
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
          {customSchema ? (
            <>
              <Segment>
                <header className="header pulled">
                  <h2>{customSchema.title}</h2>
                </header>
              </Segment>
              <InlineForm
                schema={customSchema}
                title={customSchema.title}
                onChangeField={(id, value) => {
                  props.onChangeBlock(props.block, {
                    ...props.data,
                    [id]: value,
                  });
                }}
                formData={props.data}
              />
            </>
          ) : (
            ''
          )}
        </div>
      </SidebarPortal>
    </>
  );
};

export default connectBlockToProviderData(Edit);
