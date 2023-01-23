import React, { useRef } from 'react';
import loadable from '@loadable/component';
import cx from 'classnames';
import sanitizeHtml from 'sanitize-html';
import CountUp from 'react-countup';

import { useOnScreen } from '../helpers';

const D3 = loadable.lib(() => import('d3'));

const AnimatedCounter = ({ originalValue }) => {
  const ref = useRef();
  const { entryCount, isIntersecting } = useOnScreen(ref);

  return (
    <span ref={ref}>
      {isIntersecting && entryCount === 1 && (
        <CountUp
          start={0}
          formattingFn={(num) => num.toLocaleString()}
          duration={3}
          end={originalValue}
        />
      )}
      {isIntersecting && entryCount > 1 && (
        <span>
          {originalValue.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </span>
      )}
    </span>
  );
};

const FormattedValue = ({
  textTemplate,
  specifier,
  value,
  collapsed,
  wrapped = true,
  animatedCounter,
}) => {
  const originalValue = value;
  const animateValue = typeof value === 'number' && animatedCounter;
  const sanitizeHtmlResult = sanitizeHtml(value, {
    allowedAttributes: {
      span: ['id'],
    },
  });
  return (
    <React.Fragment>
      <D3 fallback={null}>
        {({ format }) => {
          if (specifier) {
            try {
              const formatter = format ? format(specifier) : (v) => v;
              value = formatter(value);
            } catch {}
          }
          if (textTemplate && !animateValue) {
            value = textTemplate.replace('{}', value);
          }

          if (!wrapped) {
            return sanitizeHtmlResult || '';
          }

          return animateValue ? (
            <span
              className={cx('formatted-value', collapsed ? 'collapsed' : null)}
            >
              {textTemplate && textTemplate.split('{}').length > 0
                ? textTemplate.split('{}')[0]
                : ''}
              <AnimatedCounter originalValue={originalValue} />
              {textTemplate && textTemplate.split('{}').length > 0
                ? textTemplate.split('{}')[1]
                : ''}
            </span>
          ) : (
            <span
              className={cx('formatted-value', collapsed ? 'collapsed' : null)}
              dangerouslySetInnerHTML={{
                __html:
                  sanitizeHtml(value, {
                    allowedAttributes: {
                      span: ['id'],
                    },
                  }) || '',
              }}
            />
          );
        }}
      </D3>
    </React.Fragment>
  );
};

export default FormattedValue;
