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

  console.log('children', children);
  return url && column ? (
    <span className="inline-data-entity">
      {children.map((child, index) => {
        if (!child) return '';
        // Note: this is a hack, it might not work in future react
        if (child.props) {
          child.props.children[0] = (
            <DataConnectedValue url={url} column={column} key={index} />
          );
          if (child.props.children.length > 1) {
            const range = new Array(child.props.children.length).fill(true);
            range.forEach((_, i) => {
              child.props.children[i + 1] = '';
            });
          }
          return child;
        } else {
          return <DataConnectedValue url={url} column={column} key={index} />;
        }
      })}
    </span>
  ) : (
    <span className="ui tag label red">{children}</span>
  );
};

export default RedraftConnectedInlineDataEntity;
