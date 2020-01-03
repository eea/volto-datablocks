import * as types from './types';
import { Modifier, EditorState, AtomicBlockUtils, RichUtils } from 'draft-js';

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
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    types.INLINEDATAENTITY,
    'IMMUTABLE',
    props,
  );

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  let targetRange = editorState.getSelection();

  const contentStateWithText = Modifier.insertText(
    contentStateWithEntity,
    targetRange,
    'data{}',
    null,
    entityKey,
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
