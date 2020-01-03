import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '@plone/volto/components/theme/Icon/Icon';

import checkSVG from '@plone/volto/icons/checkbox-unchecked.svg';
import uncheckSVG from '@plone/volto/icons/checkbox-checked.svg';
import { addInlineDataEntity } from './modifiers';
import cx from 'classnames';

import EditorUtils from 'draft-js-plugins-utils';
import { EditorState } from 'draft-js';

import EditForm from './EditForm';
import * as types from './types';

// import { removeEntityOfSelection } from 'volto-addons/drafteditor/utils';
// import { convertToRaw } from 'draft-js';

class DataButton extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    store: PropTypes.shape({}).isRequired,
    onOverrideContent: PropTypes.func.isRequired,
  };

  onMouseDown = event => {
    event.preventDefault();
  };

  onButtonClick = e => {
    e.preventDefault();
    e.stopPropagation();

    // TODO: this needs to be fixed, to be a toggle

    const { getEditorState, setEditorState } = this.props.store;
    const editorState = getEditorState();
    const newState = addInlineDataEntity(editorState, {});

    setEditorState(newState);
  };

  onChangeEntityData = (entityKey, data) => {
    const { getEditorState, setEditorState } = this.props.store;
    const editorState = getEditorState();
    const contentState = editorState.getCurrentContent();
    const newContentState = contentState.mergeEntityData(entityKey, data);
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'change-dataentity',
    );

    // this is needed to force redraw of entity component, should rewrite
    // TODO: use EditorState.forceSelection
    const focusedState = EditorState.moveFocusToEnd(newEditorState);
    setEditorState(focusedState);
  };

  render() {
    const { theme, getEditorState } = this.props;

    const isSelected = EditorUtils.hasEntity(
      getEditorState(),
      types.DATAENTITY,
    );

    const editorState = getEditorState();
    const currentEntityKey = EditorUtils.getCurrentEntityKey(editorState);
    const currentEntity = EditorUtils.getCurrentEntity(editorState);

    const className = cx(theme.button, { [theme.active]: isSelected });

    return (
      <div
        className={theme.buttonWrapper}
        onMouseDown={this.onMouseDown}
        role="presentation"
      >
        <button
          className={className}
          onClick={
            isSelected ? this.onRemoveBlockAtSelection : this.onButtonClick
          }
          type="button"
        >
          {!isSelected ? (
            <Icon name={checkSVG} size="24px" />
          ) : (
            <Icon name={uncheckSVG} size="24px" />
          )}
        </button>

        {isSelected ? (
          <EditForm
            onChangeBlock={this.onChangeBlock}
            onChangeEntityData={this.onChangeEntityData}
            block="data-entity"
            entityKey={currentEntityKey}
            data={currentEntity.data}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default DataButton;
