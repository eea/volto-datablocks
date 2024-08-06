import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { isEmpty } from 'lodash';
import { emptyBlocksForm } from '@plone/volto/helpers';
import { BlocksForm, SidebarPortal, InlineForm } from '@plone/volto/components';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import EditBlockWrapper from '@eeacms/volto-group-block/components/manage/Blocks/Group/EditBlockWrapper';
import { ConditionalDataBlockSchema } from './schema';

const tweakSchema = (schema, provider_data) => {
  const choices = Object.keys(provider_data || {})
    .sort((a, b) => a - b)
    .map((n) => [n, n]);
  ['column_data'].forEach((n) => (schema.properties[n].choices = choices));

  return schema;
};

const Edit = (props) => {
  const {
    block,
    data,
    onChangeBlock,
    onChangeField,
    pathname,
    selected,
    manage,
    provider_data = {},
  } = props;

  const schema = tweakSchema(ConditionalDataBlockSchema(), provider_data);
  const data_blocks = data?.data?.blocks;
  const metadata = props.metadata || props.properties;
  const properties = isEmpty(data_blocks) ? emptyBlocksForm() : data.data;
  const [selectedBlock, setSelectedBlock] = useState(
    properties.blocks_layout.items[0],
  );

  React.useEffect(() => {
    if (
      isEmpty(data_blocks) &&
      properties.blocks_layout.items[0] !== selectedBlock
    ) {
      setSelectedBlock(properties.blocks_layout.items[0]);
      onChangeBlock(block, {
        ...data,
        data: properties,
      });
    }
  }, [onChangeBlock, properties, selectedBlock, block, data, data_blocks]);

  const blockState = React.useRef({});

  return (
    <fieldset className="section-block">
      <legend
        onClick={() => {
          setSelectedBlock();
          props.setSidebarTab(1);
        }}
        aria-hidden="true"
      >
        {data.title || 'Conditional block'}
      </legend>
      <BlocksForm
        {...props}
        metadata={metadata}
        properties={properties}
        manage={manage}
        selectedBlock={selected ? selectedBlock : null}
        allowedBlocks={data.allowedBlocks}
        title={data.placeholder}
        onSelectBlock={setSelectedBlock}
        onChangeFormData={(newFormData) => {
          onChangeBlock(block, {
            ...data,
            data: newFormData,
          });
        }}
        onChangeField={(id, value) => {
          if (['blocks', 'blocks_layout'].indexOf(id) > -1) {
            blockState.current[id] = value;
            onChangeBlock(block, {
              ...data,
              data: {
                ...data.data,
                ...blockState.current,
              },
            });
          } else {
            onChangeField(id, value);
          }
        }}
        pathname={pathname}
      >
        {({ draginfo }, editBlock, blockProps) => (
          <EditBlockWrapper
            className="block-editor-group"
            draginfo={draginfo}
            blockProps={blockProps}
            disabled={data.disableInnerButtons}
          >
            {editBlock}
          </EditBlockWrapper>
        )}
      </BlocksForm>

      <SidebarPortal selected={selected && !selectedBlock}>
        {!data?.readOnlySettings && (
          <InlineForm
            schema={schema}
            title={schema.title}
            formData={data}
            onChangeField={(id, value) => {
              props.onChangeBlock(props.block, {
                ...props.data,
                [id]: value,
              });
            }}
          />
        )}
      </SidebarPortal>
    </fieldset>
  );
};

Edit.propTypes = {
  block: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onChangeBlock: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  manage: PropTypes.bool.isRequired,
};

export default compose(
  connectToProviderData((props) => ({
    provider_url: props.data?.provider_url,
  })),
)(Edit);
