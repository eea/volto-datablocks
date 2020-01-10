import React from 'react';
import DataConnectedValue from 'volto-datablocks/DataConnectedValue';

const ConnectedInlineDataEntity = props => {
  const { children, decoratedText, contentState, entityKey } = props;

  // contentState,
  // decoratedText,
  // dir,
  // entityKey,
  // offsetKey,
  // getEditorState,
  // setEditorState,

  // -{props.decoratedText}-

  // copy the styling from the children to the wrapper, then replace the
  // children with the simple text

  const child = children[0];
  // ui tag label red
  if (!(child && child.props))
    return (
      <span contentEditable={false} className="inline-data-entity">
        data {decoratedText}
      </span>
    );

  // console.log('ongoing');
  const {
    customStyleMap,
    customStyleFn,
    offsetKey,
    styleSet,
    block,
  } = child.props;

  // code lifted from draft-js/DraftEditorLeaf.js
  let styleObj = styleSet.reduce((map, styleName) => {
    const mergedStyles = {};
    const style = customStyleMap[styleName];
    if (style !== undefined && map.textDecoration !== style.textDecoration) {
      // .trim() is necessary for IE9/10/11 and Edge
      mergedStyles.textDecoration = [map.textDecoration, style.textDecoration]
        .join(' ')
        .trim();
    }
    return Object.assign(map, style, mergedStyles);
  }, {});
  if (customStyleFn) {
    const newStyles = customStyleFn(styleSet, block);
    styleObj = Object.assign(styleObj, newStyles);
  }

  let url, column;
  if (entityKey) {
    const entity = contentState.getEntity(entityKey);
    url = entity.data.url;
    column = entity.data.column;
  }

  // className="inline-entity"
  return (
    (child && (
      <span
        data-offset-key={offsetKey}
        style={styleObj}
        contentEditable={false}
        className="inline-data-entity"
      >
        <DataConnectedValue url={url} column={column} />
      </span>
    )) || (
      <span contentEditable={false} className="inline-data-entity">
        {decoratedText}
      </span>
    )
  );
};

export default ConnectedInlineDataEntity;
