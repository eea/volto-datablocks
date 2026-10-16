import React from 'react';
import { compose } from 'redux';
import { useDispatch } from 'react-redux';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import { setBlockTocVisibility } from '@eeacms/volto-datablocks/actions';
import { getTocVisibilityKey } from './tocVisibility';
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

    case operator === 'exists':
      return !!columnValue;

    default:
      return 'Could not evaluate!';
  }
};

const View = (props) => {
  const { data, provider_data, id, loadingProviderData } = props;
  const dispatch = useDispatch();
  const { column_data, operator, condition } = data;
  const columnValue = Array.from(new Set(provider_data?.[column_data])).sort(
    (a, b) => (a > b ? 1 : a < b ? -1 : 0),
  );
  const evalResult = evaluateCondition(columnValue, operator, condition);
  const metadata = props.metadata || props.properties;
  const CustomTag = `${data.as || 'div'}`;
  const customId = data?.title
    ?.toLowerCase()
    ?.replace(/[^a-zA-Z-\s]/gi, '')
    ?.trim()
    ?.replace(/\s+/gi, '-');

  // Report the runtime visibility to the table of contents. The ToC cannot
  // evaluate the condition on its own, so it consumes this value to decide
  // whether to include the entries of the blocks nested here. While the
  // provider data is still being fetched we keep the value unknown, so the
  // ToC keeps its optimistic default instead of hiding entries prematurely.
  const visible = !!evalResult;
  const tocKey = getTocVisibilityKey(metadata, id);
  React.useEffect(() => {
    if (!tocKey || loadingProviderData) return;
    dispatch(setBlockTocVisibility(tocKey, visible));
  }, [dispatch, tocKey, visible, loadingProviderData]);

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
