import React from 'react';
import loadable from '@loadable/component';
import cx from 'classnames';

const D3 = loadable.lib(() => import('d3'));

const FormattedValue = ({ textTemplate, specifier, value, collapsed }) => {
  return (
    <D3 fallback={null}>
      {({ format }) => {
        if (specifier) {
          const formatter = format ? format(specifier) : (v) => v;
          value = formatter(value);
        }
        if (textTemplate) {
          value = textTemplate.replace('{}', value);
        }

        return (
          <span
            className={cx('formatted-value', collapsed ? 'collapsed' : null)}
          >
            {value || ''}
          </span>
        );
      }}
    </D3>
  );
};

export default FormattedValue;
