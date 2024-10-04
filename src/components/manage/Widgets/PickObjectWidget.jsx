/*
 * A wrapper over ObjectBrowser because of API constraints
 */

import { TextWidget, UniversalLink } from '@plone/volto/components'; //CheckboxWidget, Icon,
import clearSVG from '@plone/volto/icons/clear.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import { flattenToAppURL } from '@plone/volto/helpers';
import React from 'react';

const ObjectBrowserWrapper = withObjectBrowser((props) => {
  const {
    id,
    title,
    value,
    onSelectItem,
    openObjectBrowser,
    required,
    onChangeBlock,
  } = props;
  const url = flattenToAppURL(value);

  return (
    <TextWidget
      id={id}
      title={value ? <UniversalLink href={url}>{title}</UniversalLink> : title}
      required={required}
      value={url}
      icon={value ? clearSVG : navTreeSVG}
      iconAction={
        value
          ? (id, value) => onSelectItem(null)
          : () => openObjectBrowser({ mode: 'link', onSelectItem })
      }
      onChange={(id, value) => {
        onChangeBlock(props.id, flattenToAppURL(value));
      }}
    />
  );
});

const ObjectBrowserAdapter = ({ onChange, value, ...props }) => {
  return (
    <ObjectBrowserWrapper
      {...props}
      onSelectItem={(value) => onChange(props.id, value)}
      onChangeBlock={onChange}
      data={{ url: value }}
      value={value}
    />
  );
};

export default ObjectBrowserAdapter;
