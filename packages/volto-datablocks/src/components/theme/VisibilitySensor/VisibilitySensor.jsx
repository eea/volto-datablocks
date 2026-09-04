import React, { useEffect } from 'react';
import qs from 'query-string';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  const location = useLocation();
  const queryParams = qs.parse(location?.search);
  const isPrint = useSelector((state) => state.print?.isPrint || false);
  const [active, setActive] = React.useState(
    useVisibilitySensor && !isPrint && queryParams?.visibility_sensor !== 'off',
  );

  useEffect(() => {
    if (isPrint) {
      setActive(!isPrint);
    }
  }, [isPrint]);

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
