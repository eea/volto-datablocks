import React from 'react';
import Text from './Text/Text';
import Link from './Link/Link';

export const components = {
  text: Text,
  link: Link,
};

const ComponentWrapper = (props) => {
  const { colDef = {} } = props;
  const RenderComponent = components[colDef.component] || Text;

  return <RenderComponent {...props} />;
};

export default ComponentWrapper;
