import React from 'react';
import loadable from '@loadable/component';
import cx from 'classnames';
import sanitizeHtml from 'sanitize-html';
const D3 = loadable.lib(() => import('d3'));

const FormattedValue = ({
  textTemplate,
  specifier,
  value,
  collapsed,
  wrapped = true,
}) => {
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

        return wrapped ? (
          <span
            className={cx('formatted-value', collapsed ? 'collapsed' : null)}
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(value) || '',
            }}
          />
        ) : (
          sanitizeHtml(value) || ''
        );
      }}
    </D3>
  );
};

export default FormattedValue;
