import React from 'react';
import DataConnectedValue from 'volto-datablocks/DataConnectedValue';

const ConnectedDataBlock = props => {
  const { column, url } = props.blockProps;
  return (
    <div className="connected-data-block">
      <DataConnectedValue column={column} url={url} />
    </div>
  );
};
export default ConnectedDataBlock;
