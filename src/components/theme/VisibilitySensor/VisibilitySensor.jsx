import React from 'react';
import ReactVisibilitySensor from 'react-visibility-sensor';

const VisibilitySensor = ({
  children,
  scrollCheck = true,
  resizeCheck = true,
  partialVisibility = true,
  delayedCall = true,
  offset = { top: -50, bottom: -50 },
  useVisibilitySensor = true,
  Placeholder = () => <div>&nbsp;</div>,
  ...rest
}) => {
  const [active, setActive] = React.useState(useVisibilitySensor);

  return (
    <ReactVisibilitySensor
      scrollCheck={scrollCheck}
      resizeCheck={resizeCheck}
      partialVisibility={partialVisibility}
      delayedCall={delayedCall}
      onChange={(visible) => {
        if (visible && active) {
          setActive(false);
        }
      }}
      active={active}
      getDOMElement={(val) => {
        return val?.el;
      }}
      offset={offset}
      {...rest}
    >
      {({ isVisible }) => {
        if (isVisible || !active) {
          return children;
        }

        return <Placeholder {...rest} />;
      }}
    </ReactVisibilitySensor>
  );
};

export default VisibilitySensor;
