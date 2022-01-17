import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

export const Placeholder = ({ children, getDOMElement, onChange, ...rest }) => {
  const [active, setActive] = React.useState(true);

  return (
    <VisibilitySensor
      scrollCheck={true}
      resizeCheck={true}
      onChange={(visible) => {
        if (visible && active) {
          setActive(false);
        }
      }}
      active={active}
      {...rest}
    >
      {({ isVisible }) => {
        if (isVisible) {
          return children();
        }

        // Without the character inside the div (non-breaking white space)
        // the size of the <div> is wrong.
        return <div className="connected-chart-placeholder">&nbsp;</div>;
      }}
    </VisibilitySensor>
  );
};

export default Placeholder;
