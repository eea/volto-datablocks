import React from 'react';
import { compose } from 'redux';
import config from '@plone/volto/registry';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import './style.less';

const View = (props) => {
  const type = props.data.type;

  const DefaultView = () => (
    <>
      {props.mode === 'edit' && !props.data.type ? (
        <p>Please select a block type from sidebar</p>
      ) : props.mode === 'edit' && props.data.type ? (
        <p>Block type selected: {props.data.type}</p>
      ) : (
        ''
      )}
    </>
  );
  const CustomView =
    config.blocks.blocksConfig.custom_connected_block.blocks?.[type]?.view ||
    null;

  const RenderCustomConnectedBlock = CustomView || DefaultView;

  return (
    <RenderCustomConnectedBlock
      {...props}
      mode={props.mode}
      placeholder={props.data.placeholder}
    />
  );
};

export default compose(
  connectToProviderData((props) => ({
    provider_url: props.data?.provider_url,
  })),
)(View);
