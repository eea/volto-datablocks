/*
 * A redraft dedicated version of the ConnectedInlineDataEntity
 */

import React from 'react';
import DataConnectedValue from 'volto-datablocks/DataConnectedValue';

const RedraftConnectedInlineDataEntity = props => {
  // console.log('redraft props', props);

  const {
    children,
    entityData: { column, url },
  } = props;

  return url && column ? (
    <span className="inline-data-entity">
      {children.map((child, index) => {
        if (!child) return '';
        // Note: this is a hack, it might not work in future react
        child.props.children[0] = (
          <DataConnectedValue url={url} column={column} />
        );
        return child;
      })}
    </span>
  ) : (
    <span className="ui tag label red">{children}</span>
  );
};

export default RedraftConnectedInlineDataEntity;
