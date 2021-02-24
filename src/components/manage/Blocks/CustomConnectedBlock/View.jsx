import React from 'react';
import { blocks } from '~/config';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import './style.less';

const View = (props) => {
  const chartType = props.data.chartType;
  const DefaultView = () => (
    <>
      {props.mode === 'edit' && !props.data.chartType ? (
        <p>Please select a chart from sidebar</p>
      ) : props.mode === 'edit' && props.data.chartType ? (
        <p>Chart selected: {props.data.chartType}</p>
      ) : (
        ''
      )}
    </>
  );
  const CustomView =
    blocks.blocksConfig.custom_connected_block.blocks?.[chartType]?.view ||
    null;

  const RenderChartView = CustomView || DefaultView;

  return <RenderChartView {...props} mode={props.mode} />;
};

export default connectBlockToProviderData(View);
