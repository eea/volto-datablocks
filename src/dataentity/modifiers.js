import * as types from './types';
import { Modifier, EditorState, AtomicBlockUtils, RichUtils } from 'draft-js';
// import { inlineDataEntityDecorator } from './decorators';

export function addDataEntity(editorState, props) {
  if (RichUtils.getCurrentBlockType(editorState) === types.ATOMIC) {
    return editorState;
  }
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    types.DATAENTITY,
    'IMMUTABLE',
    props,
  );

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity,
  });

  const res = AtomicBlockUtils.insertAtomicBlock(
    newEditorState,
    entityKey,
    '☺',
  );
  return res;
}

export function addInlineDataEntity(editorState, props) {
  if (RichUtils.getCurrentBlockType(editorState) === types.ATOMIC) {
    return editorState;
  }

  let targetRange = editorState.getSelection();

  // selection is not an insert cursor, some text is selected
  const insertOrReplaceText =
    targetRange.anchorOffset === targetRange.focusOffset
      ? Modifier.insertText
      : Modifier.replaceText;

  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    types.INLINEDATAENTITY,
    'IMMUTABLE',
    props,
  );

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const contentStateWithText = insertOrReplaceText(
    contentStateWithEntity,
    targetRange,
    'data{}',
    null,
    entityKey, // applyEntity is not needed because entityKey is here
  );

  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithText,
  });

  // const res = AtomicBlockUtils.insertAtomicBlock(
  //   newEditorState,
  //   entityKey,
  //   '☺',
  // );

  return newEditorState;
}
