import React from 'react';
import { compose } from 'redux';
import { isNil } from 'lodash';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';

import { FormattedValue } from '../';
import './styles.css';
import { formatValue } from '../../format';

const EMPTY = '-';

const Placeholder = (props) => {
  const placeholder = props.placeholder.trim();
  const isComponent = React.useMemo(
    () => typeof props.placeholder === 'function',
    [props.placeholder],
  );

  const PlaceholderElement = placeholder || EMPTY;

  return isComponent ? <PlaceholderElement {...props} /> : PlaceholderElement;
};

const getRow = (row = 0) => {
  if (typeof row === 'string' && row.includes('row-')) {
    return (row.split('row-')[1] || 1) - 1;
  }
  return row;
};

const getValue = (provider_data, column, row) => {
  if (!column) return 'Select a column';
  return provider_data?.[column]?.[getRow(row)];
};

const DataConnectedValue = (props) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const {
    collapseLimit = null,
    column,
    provider_data = {},
    row = 0,
    specifier,
    textTemplate,
    animatedCounter,
    link,
  } = props;

  const value = React.useMemo(
    () => formatValue(getValue(provider_data, column, row)),
    [provider_data, column, row],
  );

  const collapsable = props.collapsable && value?.length > collapseLimit;

  return !isNil(value) ? (
    <>
      <FormattedValue
        textTemplate={textTemplate}
        value={value}
        animatedCounter={animatedCounter}
        specifier={specifier}
        collapsed={collapsable && collapsed}
        link={link}
      />
      {collapsable && (
        <div>
          <button
            className="readmore-button"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            {collapsed ? 'READ MORE' : 'COLLAPSE'}
          </button>
        </div>
      )}
    </>
  ) : (
    <Placeholder {...props} />
  );
};

export default compose(
  connectToProviderData((props) => ({
    provider_url: props.url,
  })),
)(DataConnectedValue);
