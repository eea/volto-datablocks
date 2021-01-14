import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

export const Placeholder = ({ children, getDOMElement, onChange, ...rest }) => {
  const nodeRef = React.useRef();
  const sizeRef = React.useRef({});

  React.useLayoutEffect(() => {
    if (nodeRef.current) {
      setTimeout(() => {
        const de = getDOMElement
          ? getDOMElement(nodeRef.current)
          : nodeRef.current;

        const height = de?.clientHeight;
        const width = de?.clientWidth;

        if (height && width) {
          const size = {
            height: `${height}px`,
            width: `${width}px`,
          };
          sizeRef.current = size;
        }
      }, 500);
    }
  });

  const [update, setUpdate] = React.useState(true);

  return (
    <VisibilitySensor
      scrollCheck={true}
      resizeCheck={true}
      onChange={(args) => {
        setUpdate(!update);
        if (typeof onChange === 'function') {
          onChange(...args);
        }
      }}
      {...rest}
    >
      {({ isVisible }) => {
        if (isVisible) {
          return children?.({ nodeRef });
        }

        // Without the character inside the div (non-breaking white space)
        // the size of the <div> is wrong.
        return <div style={sizeRef?.current}>&nbsp;</div>;
      }}
    </VisibilitySensor>
  );
};

export default Placeholder;
