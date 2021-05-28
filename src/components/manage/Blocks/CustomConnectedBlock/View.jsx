import React from 'react';
import config from '@plone/volto/registry';
import { connectBlockToProviderData } from '../../../../hocs';
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

  const RenderChartView = CustomView || DefaultView;

  return <RenderChartView {...props} mode={props.mode} />;
};

export default connectBlockToProviderData(View);
