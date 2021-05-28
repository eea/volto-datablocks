import React from 'react';
import { connectBlockToProviderData } from '@eeacms/volto-datablocks/hocs';
import BubbleChart from './lib/ReactBubbleChart';
import './bubble-chart.less';

var colorLegend = [
  //reds from dark to light
  { color: '#67000d', text: 'Negative', textColor: '#ffffff' },
  '#a50f15',
  '#cb181d',
  '#ef3b2c',
  '#fb6a4a',
  '#fc9272',
  '#fcbba1',
  '#fee0d2',
  //neutral grey
  { color: '#f0f0f0', text: 'Neutral' },
  // blues from light to dark
  '#deebf7',
  '#c6dbef',
  '#9ecae1',
  '#6baed6',
  '#4292c6',
  '#2171b5',
  '#08519c',
  { color: '#08306b', text: 'Positive', textColor: '#ffffff' },
];

const BubbleChartView = (props) => {
  const { data = {}, provider_data = {} } = props;
  const { size_column, label_column, height } = data;
  const points =
    size_column && label_column && provider_data
      ? provider_data[label_column]?.map((d, index) => ({
          _id: d,
          value: provider_data[size_column]?.[index],
          colorValue: provider_data[size_column]?.[index],
        }))
      : [];

  var tooltipProps = [
    {
      css: 'value',
      prop: 'value',
      display: '',
      preffix: props.data.tooltip_preffix,
      suffix: props.data.tooltip_suffix,
    },
  ];

  return (
    <BubbleChart
      className="bubble-chart"
      data={points}
      selectedColor="#737373"
      selectedTextColor="#d9d9d9"
      onClick={() => {}}
      legend={false}
      colorLegend={colorLegend}
      legendSpacing={0}
      tooltip={true}
      tooltipProps={tooltipProps}
      tooltipFunc={() => {}}
      smallDiameter={10}
      mediumDiameter={20}
      height={height}
      fontSizeFactor={0.3}
    />
  );
};
export default connectBlockToProviderData(BubbleChartView);
