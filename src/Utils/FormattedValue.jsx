import React, { useRef } from 'react';
import loadable from '@loadable/component';
import cx from 'classnames';
import sanitizeHtml from 'sanitize-html';
import { Portal } from 'react-portal';
import CountUp from 'react-countup';

import { useOnScreen } from '../helpers';

const D3 = loadable.lib(() => import('d3'));

const AnimatedCounterPortal = ({ originalValue }) => {
  const portalNode = document.getElementById(
    `animated-counter-${originalValue}`,
  );
  const ref = useRef();
  const { entryCount, isIntersecting } = useOnScreen(ref);

  return (
    <span ref={ref}>
      <Portal node={portalNode}>
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
      </Portal>
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
  const uid = animateValue ? `animated-counter-${originalValue}` : '';

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
          if (textTemplate) {
            value = textTemplate.replaceAll('{}', value);
          }
          if (textTemplate && animateValue) {
            value = textTemplate.replaceAll(
              '{}',
              animateValue ? `<span id="${uid}"></span>` : value,
            );
          }
          if (animateValue && !textTemplate) {
            value = `<span id="${uid}"></span>`;
          }
          return wrapped ? (
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
          ) : (
            sanitizeHtml(value, {
              allowedAttributes: {
                span: ['id'],
              },
            }) || ''
          );
        }}
      </D3>
      {animateValue && <AnimatedCounterPortal originalValue={originalValue} />}
    </React.Fragment>
  );
};

export default FormattedValue;
