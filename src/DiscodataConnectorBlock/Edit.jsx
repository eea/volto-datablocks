import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _uniqueId from 'lodash/uniqueId';
import { v4 as uuid } from 'uuid';
import View from './View';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import { getSchema } from './schema';

const Edit = (props) => {
  const [state, setState] = useState({
    id: _uniqueId('block_'),
    schema: getSchema(props),
  });

  useEffect(() => {
    const newData = { ...props.data };
    if (props.data.data_providers) {
      if (
        typeof props.data?.data_providers === 'object' &&
        props.data?.data_providers?.value
      ) {
        try {
          newData.data_providers = [];
          const dataProvidersSchema = JSON.parse(
            props.data?.data_providers?.value,
          );
          dataProvidersSchema?.fieldsets?.[0]?.fields &&
            dataProvidersSchema.fieldsets[0].fields.forEach((dataProvider) => {
              newData.data_providers.push({
                ...dataProvidersSchema.properties[dataProvider],
                '@id': uuid(),
                id: dataProvider,
              });
            });
        } catch {}
      }
    }
    if (JSON.stringify(newData) !== JSON.stringify(props.data)) {
      props.onChangeBlock(props.block, {
        ...newData,
      });
    }
  }, []);

  useEffect(() => {
    setState({
      ...state,
      schema: getSchema(props),
    });
    /* eslint-disable-next-line */
  }, [props.data_providers, props.data.data_providers_new]);

  return (
    <div>
      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={state.schema}
          title={state.schema.title}
          onChangeField={(field, data) => {
            props.onChangeBlock(props.block, {
              ...(props.data || {}),
              [field]: data,
            });
          }}
          formData={props.data || {}}
          block={props.block}
        />
      </SidebarPortal>
      <View {...props} id={state.id} />
    </div>
  );
};

export default connect((state, props) => ({
  content: state.content.data,
  connected_data_parameters: state.connected_data_parameters,
  data_providers: state.data_providers,
}))(Edit);
