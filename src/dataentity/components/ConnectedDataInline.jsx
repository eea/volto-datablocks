import React from 'react';
import ConnectedDataValue from './ConnectedDataValue';

const InlineDataEntity = props => {
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
      >
        <ConnectedDataValue url={url} column={column} />
      </span>
    )) || <span contentEditable={false}>{decoratedText}</span>
  );
};

export default InlineDataEntity;
