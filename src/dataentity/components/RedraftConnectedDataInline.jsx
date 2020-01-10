/*
 * A redraft dedicated version of the ConnectedInlineDataEntity
 */

import React from 'react';
import DataConnectedValue from 'volto-datablocks/DataConnectedValue';

/*
 * Recursively replace all text nodes in children with DataConnectedValues
 * This is a hack, might not work in future React. Fingers cross
 */
function insertConnectedData(children, url, column) {
  children.forEach((child, index) => {
    if (typeof child === 'string') {
      children[index] = (
        <DataConnectedValue url={url} column={column} key={index} />
      );
    } else {
      const innerChildren = child.props?.children || [];
      innerChildren.forEach((c, i) => {
        if (typeof c === 'string') {
          innerChildren[i] = (
            <DataConnectedValue url={url} column={column} key={index} />
          );
        } else {
          insertConnectedData(child.props?.children || [], url, column);
        }
      });
    }
  });

  return children;
}

const RedraftConnectedInlineDataEntity = props => {
  const {
    children,
    entityData: { column, url },
  } = props;

  return url && column ? (
    <span className="inline-data-entity">
      {insertConnectedData(children, url, column)}
    </span>
  ) : (
    <span className="ui tag label red">{children}</span>
  );
};

export default RedraftConnectedInlineDataEntity;
