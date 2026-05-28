import React from 'react';
import { compose } from 'redux';
import isNil from 'lodash/isNil';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import { useLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';

import { FormattedValue, Skeleton } from '@eeacms/volto-datablocks/Utils';
import './styles.css';
import { formatValue } from '@eeacms/volto-datablocks/format';

const EMPTY = '-';

const seenValues = new Set();

const getRow = (row = 0) => {
  if (typeof row === 'string' && row.includes('row-')) {
    return (row.split('row-')[1] || 1) - 1;
  }
  return row;
};

const getValue = (provider_data, column, row) => {
  if (!column) return 'Select a column';
  if (!provider_data) return undefined;
  return provider_data?.[column]?.[getRow(row)];
};

const Placeholder = ({ placeholder, ...rest }) => {
  const isComponent = typeof placeholder === 'function';

  const PlaceholderElement = placeholder || EMPTY;

  return (
    <>
      {isComponent ? <PlaceholderElement {...rest} /> : PlaceholderElement}
      &nbsp;
    </>
  );
};

const DataConnectedValue = (props) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const {
    collapseLimit = null,
    column,
    provider_data = {},
    loadingProviderData,
    failedProviderData,
    row = 0,
    specifier,
    textTemplate,
    animatedCounter,
    link,
    skeletonWidth = '100%',
    skeleton,
  } = props;

  const libs = useLazyLibs(['d3', 'sanitizeHtml'], { shouldRerender: true });
  const libsReady = libs.d3 && libs.sanitizeHtml;

  const value = React.useMemo(
    () => formatValue(getValue(provider_data, column, row)),
    [provider_data, column, row],
  );

  const collapsable = props.collapsable && value?.length > collapseLimit;

  const seenKey = `${props.url}|${column}|${row}`;
  const isFirstReveal = !seenValues.has(seenKey);

  React.useEffect(() => {
    if (!isNil(value) && libsReady) seenValues.add(seenKey);
  }, [value, libsReady, seenKey]);

  if (
    skeleton &&
    !failedProviderData &&
    value === undefined &&
    (loadingProviderData || provider_data === undefined || !libsReady)
  ) {
    return <Skeleton width={skeletonWidth} />;
  }

  if (isNil(value) || failedProviderData) {
    return <Placeholder {...props} />;
  }

  return (
    <>
      <FormattedValue
        textTemplate={textTemplate}
        value={value}
        animatedCounter={animatedCounter}
        specifier={specifier}
        collapsed={collapsable && collapsed}
        link={link}
        d3={libs.d3}
        sanitizeHtml={libs.sanitizeHtml}
        animate={isFirstReveal}
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
  );
};

export default compose(
  connectToProviderData((props) => ({
    provider_url: props.url,
  })),
)(DataConnectedValue);
