import React from 'react';
import { compose } from 'redux';
import { RenderBlocks } from '@plone/volto/components';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import './style.less';

const isNumber = (n) => {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
};

const evaluateCondition = (columnValue, operator, conditionValue) => {
  const values = (conditionValue || '').split(',').map((item) => {
    return item.trim();
  });
  conditionValue = conditionValue ? conditionValue : '';
  columnValue = columnValue[0];

  switch (true) {
    case operator === '=':
      if (isNumber(columnValue) && isNumber(conditionValue)) {
        return parseFloat(columnValue) === parseFloat(conditionValue);
      }
      return String(columnValue) === String(conditionValue);

    case operator === '!=':
      if (isNumber(columnValue) && isNumber(conditionValue)) {
        return parseFloat(columnValue) !== parseFloat(conditionValue);
      }
      return String(columnValue) !== String(conditionValue);

    case operator === 'in':
      return values.includes(columnValue);

    case operator === 'not in':
      return !values.includes(columnValue);

    case operator === '<':
      return parseFloat(columnValue) < parseFloat(conditionValue);

    case operator === '>':
      return parseFloat(columnValue) > parseFloat(conditionValue);

    default:
      return 'Could not evaluate!';
  }
};

const View = (props) => {
  const { data, provider_data } = props;
  const { column_data, operator, condition } = data;
  const columnValue = Array.from(new Set(provider_data?.[column_data])).sort();
  const evalResult = evaluateCondition(columnValue, operator, condition);
  const metadata = props.metadata || props.properties;
  const CustomTag = `${data.as || 'div'}`;
  const customId = data?.title
    ?.toLowerCase()
    ?.replace(/[^a-zA-Z-\s]/gi, '')
    ?.trim()
    ?.replace(/\s+/gi, '-');

  return (
    evalResult && (
      <CustomTag id={customId}>
        <RenderBlocks
          {...props}
          metadata={metadata}
          content={data?.data || {}}
        />
      </CustomTag>
    )
  );
};

export default compose(
  connectToProviderData((props) => ({
    provider_url: props.data?.provider_url,
  })),
)(View);
