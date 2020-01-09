import * as types from './types';
import {
  Modifier,
  EditorState,
  SelectionState,
  AtomicBlockUtils,
  RichUtils,
} from 'draft-js';
// import { inlineDataEntityDecorator } from './decorators';

export function addDataEntity(editorState, props) {
  if (RichUtils.getCurrentBlockType(editorState) === types.ATOMIC) {
    return editorState;
  }
  const currentContent = editorState.getCurrentContent();
  const contentStateWithEntity = currentContent.createEntity(
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

  const anchorKey = targetRange.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const blockKey = currentContentBlock.getKey();

  const start = targetRange.getStartOffset();
  const end = targetRange.getEndOffset();
  // targetRange.anchorOffset === targetRange.focusOffset

  // selection is not an insert cursor, some text is selected
  const insertOrReplaceText =
    start === end ? Modifier.insertText : Modifier.replaceText;

  const contentStateWithEntity = currentContent.createEntity(
    types.INLINEDATAENTITY,
    'IMMUTABLE',
    props,
  );

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const text = '#data{}';

  const contentStateWithText = insertOrReplaceText(
    contentStateWithEntity,
    targetRange,
    text,
    null,
    entityKey, // applyEntity is not needed because entityKey is here
  );

  const editorStateWithText = EditorState.set(editorState, {
    currentContent: contentStateWithText,
  });

  const selection = SelectionState.createEmpty(blockKey);
  const textSelection = selection.merge({
    focusKey: targetRange.getFocusKey(),
    anchorOffset: start,
    focusOffset: start, // + text.length,
  });
  // console.log('textselection', start, textSelection.toJS());

  const editorStateWithFocus = EditorState.forceSelection(
    editorStateWithText,
    textSelection,
  );

  return editorStateWithFocus;
}
