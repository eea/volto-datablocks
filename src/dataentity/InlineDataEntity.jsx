const InlineDataEntity = ({
  children,
  className,
  entityKey,
  getEditorState,
  target,
}) => {
  console.log('inline data entity render', children, entityKey, target);
  return 'hello';
};

export default InlineDataEntity;
