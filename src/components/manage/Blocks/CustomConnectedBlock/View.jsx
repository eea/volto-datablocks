import React, { useMemo } from 'react';
import { compose } from 'redux';
import config from '@plone/volto/registry';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import './style.less';

const DefaultView = (props) => (
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

const View = (props) => {
  const type = props.data.type;

  const CustomView = useMemo(() => {
    return (
      config.blocks.blocksConfig.custom_connected_block.blocks?.[type]?.view ||
      null
    );
  }, [type]);

  const RenderCustomConnectedBlock = useMemo(() => {
    return CustomView || DefaultView;
  }, [CustomView]);

  return (
    <RenderCustomConnectedBlock
      {...props}
      mode={props.mode}
      placeholder={props.data.placeholder}
    />
  );
};

export { View };

export default compose(
  connectToProviderData((props) => ({
    provider_url: props.data?.provider_url,
  })),
)(View);
