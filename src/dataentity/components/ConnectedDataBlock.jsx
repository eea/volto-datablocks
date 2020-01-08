import React from 'react';
import ConnectedDataValue from 'volto-datablocks/ConnectedDataValue';

const ConnectedDataBlock = props => {
  const { column, url } = props.blockProps;
  return (
    <div className="connected-data-block">
      <ConnectedDataValue column={column} url={url} />
    </div>
  );
};
export default ConnectedDataBlock;
