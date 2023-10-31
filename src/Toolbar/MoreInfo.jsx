import React from 'react';
import { UniversalLink } from '@plone/volto/components';

const Link = ({ children, ...props }) => {
  if (props.href) {
    return <UniversalLink {...props}>{children}</UniversalLink>;
  }
  return <span {...props}>{children}</span>;
};

export default function MoreInfo({ href }) {
  return (
    <div className="more-info">
      <Link href={href} className="trigger-button">
        <span>More info</span>
        <i class="ri-external-link-line" />
      </Link>
    </div>
  );
}
