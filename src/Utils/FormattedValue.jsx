import React from 'react';
import isObject from 'lodash/isObject';
import cx from 'classnames';
import { CountUp } from '@eeacms/countup';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { isUrl } from '@plone/volto/helpers/Url/Url';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';

const AnimatedCounter = ({ originalValue, animation = {} }) => (
  <span>
    <CountUp
      as="span"
      isCounting
      start={0}
      duration={animation.duration > 0 ? animation.duration : 3}
      decimalPlaces={animation.decimals > 0 ? animation.decimals : 0}
      end={originalValue}
      formatter={
        animation.formatter || ((num) => parseInt(num).toLocaleString())
      }
    />
  </span>
);

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
  d3,
  sanitizeHtml,
  animate = false,
}) => {
  const format = d3.format;
  const sanitize = sanitizeHtml.default;

  const originalValue = value;
  const animateValue =
    typeof value === 'number' &&
    (isObject(animatedCounter) ? animatedCounter.enabled : !!animatedCounter);
  const animationConfig = isObject(animatedCounter) ? animatedCounter : {};

  if (specifier) {
    try {
      value = format(specifier)(value);
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
  const linkProps = isLink ? { href: linkValue } : {};
  const html =
    isLink && isObject(link) && link.title
      ? link.title
      : (value &&
          sanitize(value, {
            allowedAttributes: { span: ['id'] },
          })) ||
        '';

  if (!wrapped) {
    return <Link {...linkProps}>{html}</Link>;
  }

  return (
    <Link {...linkProps}>
      {animateValue ? (
        <span className={cx(
            'formatted-value',
            collapsed && 'collapsed',
            animate && 'dcv-enter',
          )}>
          {textTemplate?.split('{}')[0] ?? ''}
          <AnimatedCounter
            originalValue={originalValue}
            animation={animationConfig}
          />
          {textTemplate?.split('{}')[1] ?? ''}
        </span>
      ) : (
        <span
          className={cx(
            'formatted-value',
            collapsed && 'collapsed',
            animate && 'dcv-enter',
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </Link>
  );
};

export default injectLazyLibs(['d3', 'sanitizeHtml'])(FormattedValue);
