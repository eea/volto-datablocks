import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock

import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import DataQueryFilterView from './View';

import schema from './schema';
import cloneDeep from 'lodash/cloneDeep';
import { connectBlockToProviderData } from '../../../../hocs';

const Edit = (props) => {
  const { selected, data, block, onChangeBlock, provider_data } = props;
  const tweakSchema = React.useCallback(
    (schema) => {
      const newSchema = cloneDeep(schema);
      if (provider_data) {
        newSchema.properties.select_field.choices = Object.keys(
          provider_data,
        ).map((name) => [name, name]);
      }
      return newSchema;
    },
    [provider_data],
  );

  return (
    <>
      <DataQueryFilterView {...props} mode="edit" />

      <SidebarPortal selected={selected}>
        <InlineForm
          schema={tweakSchema(schema)}
          title={schema.title}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
        />
      </SidebarPortal>
    </>
  );
};

export default connectBlockToProviderData(Edit);
