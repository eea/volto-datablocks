import * as types from './types';
import { EditorState, AtomicBlockUtils, RichUtils } from 'draft-js';

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
