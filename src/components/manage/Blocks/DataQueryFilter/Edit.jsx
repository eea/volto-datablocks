import React from 'react';
import { compose } from 'redux';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock

import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import View from './View';

import schema from './schema';
import cloneDeep from 'lodash/cloneDeep';
import { connectToProviderDataUnfiltered } from '@eeacms/volto-datablocks/hocs';

const Edit = (props) => {
  const { selected, data, block, onChangeBlock, provider_data } = props;
  const { provider_url, select_field } = data;

  const getSchema = React.useCallback(
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

  React.useEffect(() => {
    onChangeBlock(block, {
      ...data,
      options:
        provider_url && select_field && provider_data
          ? [...new Set(provider_data[select_field])].map((value) => ({
              value,
              label: value,
            }))
          : null,
    });

    /* eslint-disable-next-line */
  }, [provider_data, provider_url, select_field]);

  return (
    <>
      <View {...props} mode="edit" />

      <SidebarPortal selected={selected}>
        <InlineForm
          schema={getSchema(schema(props.intl))}
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

export default compose(
  connectToProviderDataUnfiltered((props) => ({
    provider_url: props.data.provider_url,
  })),
)(Edit);
