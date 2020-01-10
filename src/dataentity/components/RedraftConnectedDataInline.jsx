/*
 * A redraft dedicated version of the ConnectedInlineDataEntity
 */

import React from 'react';
import DataConnectedValue from 'volto-datablocks/DataConnectedValue';

function insertConnectedData(children, url, column) {
  if (typeof children === 'string')
    return <DataConnectedValue url={url} column={column} />;

  if (Array.isArray(children)) {
    return children.map((child, index) => {
      if (typeof child === 'string') {
        return <DataConnectedValue url={url} column={column} key={index} />;
      } else {
        return React.cloneElement(
          child,
          child.props,
          insertConnectedData(child.props.children, url, column),
        );
      }
    });
  } else {
    return React.cloneElement(
      children,
      children.props,
      insertConnectedData(children.props.children, url, column),
    );
  }
}

const RedraftConnectedInlineDataEntity = props => {
  const {
    children,
    entityData: { column, url },
  } = props;

  // console.log('children', children);

  return url && column ? (
    <span className="inline-data-entity">
      {insertConnectedData(children, url, column)}
    </span>
  ) : (
    <span className="ui tag label red">{children}</span>
  );
};

export default RedraftConnectedInlineDataEntity;
