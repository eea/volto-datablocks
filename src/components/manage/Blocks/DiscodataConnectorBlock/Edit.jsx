import React from 'react';
import { compose } from 'redux';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { connectToMultipleProviders } from '@eeacms/volto-datablocks/hocs';
import getSchema from './schema';
import View from './View';

const Edit = (props) => {
  const schema = React.useMemo(() => getSchema(props), [props]);

  return (
    <>
      <View {...props} mode="edit" />

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
};

export default compose(
  connectToMultipleProviders((props) => ({
    providers: props.data?.providers,
  })),
)(Edit);
