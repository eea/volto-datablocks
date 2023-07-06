import React from 'react';
import isObject from 'lodash/isObject';
import loadable from '@loadable/component';
import cx from 'classnames';
import sanitizeHtml from 'sanitize-html';
import { CountUp } from '@eeacms/countup';
import { UniversalLink } from '@plone/volto/components';
import { isUrl } from '@plone/volto/helpers';

const D3 = loadable.lib(() => import('d3'));

const AnimatedCounter = ({ originalValue }) => {
  return (
    <span>
      <CountUp isCounting start={0} duration={3} end={originalValue} />
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
          );
        }}
      </D3>
    </React.Fragment>
  );
};

export default FormattedValue;
