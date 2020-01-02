import React from 'react';
import PropTypes from 'prop-types';
import 'draft-js-focus-plugin/lib/plugin.css';

import './styles.css';

const propTypes = {
  blockProps: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  // theme: PropTypes.object.isRequired,
};

const DataEntity = props => {
  const { blockProps, className } = props;
  // console.log('rendering dataentity', props);

  return (
    <span className="inline-data-entity">
      <div class="inline-data-entity-text">{blockProps.url}</div>
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
