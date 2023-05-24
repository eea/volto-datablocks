import React, { useRef } from 'react';
import isObject from 'lodash/isObject';
import loadable from '@loadable/component';
import cx from 'classnames';
import sanitizeHtml from 'sanitize-html';
import CountUp from 'react-countup';
import { UniversalLink } from '@plone/volto/components';
import { isUrl } from '@plone/volto/helpers';

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
  linkTemplate,
  textTemplate,
  specifier,
  value,
  linkValue,
  collapsed,
  wrapped = true,
  animatedCounter,
  link = null,
}) => {
  const originalValue = value;
  const animateValue = typeof value === 'number' && animatedCounter;
<<<<<<< HEAD
  const sanitizeHtmlResult = sanitizeHtml(value, {
    allowedAttributes: {
      span: ['id'],
    },
  });
=======

>>>>>>> develop
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
          if (linkTemplate) {
            linkValue = linkTemplate.replace('{}', linkValue || value);
          }
          if (textTemplate && !animateValue) {
            value = textTemplate.replace('{}', value);
          }
          if (textTemplate && !linkTemplate && !linkValue) {
            linkValue = value;
          }

          const isLink = link && isUrl(linkValue);

          const Link = isLink ? UniversalLink : React.Fragment;
          const linkProps = isLink
            ? {
                href: linkValue,
              }
            : {};

          const html =
            isLink && isObject(link) && link.title
              ? link.title
              : sanitizeHtml(value, {
                  allowedAttributes: {
                    span: ['id'],
                  },
                }) || '';

<<<<<<< HEAD
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
=======
          return wrapped ? (
            <Link {...linkProps}>
              {animateValue ? (
                <span
                  className={cx(
                    'formatted-value',
                    collapsed ? 'collapsed' : null,
                  )}
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
                  className={cx(
                    'formatted-value',
                    collapsed ? 'collapsed' : null,
                  )}
                  dangerouslySetInnerHTML={{
                    __html: html,
                  }}
                />
              )}
            </Link>
          ) : (
            <Link {...linkProps}>{html}</Link>
>>>>>>> develop
          );
        }}
      </D3>
    </React.Fragment>
  );
};

export default FormattedValue;
