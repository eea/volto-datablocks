import React from 'react';
import PropTypes from 'prop-types';
import 'draft-js-focus-plugin/lib/plugin.css';

const propTypes = {
  blockProps: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  // theme: PropTypes.object.isRequired,
};

const DataEntity = props => {
  const { blockProps, className } = props;
  console.log('rendering dataentity', props);

  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: 'red',
        height: '30px',
        width: '300px',
      }}
      className={className}
    >
      {props.children}
      {blockProps.url}
    </span>
  );
};

DataEntity.propTypes = propTypes;
DataEntity.defaultProps = {
  className: null,
  entityKey: null,
  target: null,
};

export default DataEntity;
