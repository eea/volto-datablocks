import React from 'react';
import { compose } from 'redux';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';

import { FormattedValue } from '../';
import './styles.css';

const EMPTY = '-';

const getRow = (row = 0) => {
  if (typeof row === 'string' && row.includes('row-')) {
    return (row.split('row-')[1] || 1) - 1;
  }
  return row;
};

const getValue = (provider_data, column, placeholder = EMPTY, row) => {
  if (!column) return 'Select a column';
  if (!provider_data) return placeholder;
  if (!provider_data[column]) return placeholder;
  return provider_data[column][getRow(row)] || placeholder;
};

const DataConnectedValue = (props) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const {
    collapseLimit = null,
    column,
    placeholder = EMPTY,
    provider_data = {},
    row = 0,
    specifier,
    textTemplate,
    loadingProviderData,
    animatedCounter,
  } = props;

  const value = React.useMemo(
    () => getValue(provider_data, column, placeholder, row),
    [provider_data, column, placeholder, row],
  );

  const collapsable = props.collapsable && value.length > collapseLimit;

  return value ? (
    <>
      <FormattedValue
        textTemplate={textTemplate}
        value={value}
        animatedCounter={animatedCounter}
        specifier={specifier}
        collapsed={collapsable && collapsed}
      />
      {collapsable ? (
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
      ) : (
        ''
      )}
    </>
  ) : !loadingProviderData ? (
    placeholder
  ) : (
    ''
  );
};

export default compose(
  connectToProviderData((props) => ({
    provider_url: props.url,
  })),
)(DataConnectedValue);
