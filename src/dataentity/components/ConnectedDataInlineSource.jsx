import { v4 as uuid } from 'uuid';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '@plone/volto/components/theme/Icon/Icon';

import checkSVG from '@plone/volto/icons/checkbox-unchecked.svg';
import uncheckSVG from '@plone/volto/icons/checkbox-checked.svg';
import { addInlineDataEntity } from '../modifiers';
import cx from 'classnames';

import EditorUtils from 'draft-js-plugins-utils';
import { EditorState } from 'draft-js';

import EditForm from './EditForm';
import ForceEditorRefresh from './ForceEditorRefresh';
import * as types from '../types';

// import { removeEntityOfSelection } from 'volto-addons/drafteditor/utils';
// import { convertToRaw } from 'draft-js';

class DataButton extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    store: PropTypes.shape({}).isRequired,
    onOverrideContent: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      editorKey: null,
    };
  }

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

  onChangeBlock() {}

  onChangeEntityData = (entityKey, data) => {
    const { getEditorState, setEditorState } = this.props.store;
    const editorState = getEditorState();
    const contentState = editorState.getCurrentContent();
    const newContentState = contentState.mergeEntityData(entityKey, data);
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'apply-entity',
    );
    setEditorState(newEditorState);
    this.setState({ editorKey: uuid() });
  };

  render() {
    const { theme, getEditorState } = this.props;

    const isSelected = EditorUtils.hasEntity(
      getEditorState(),
      types.INLINEDATAENTITY,
    );

    const editorState = getEditorState();
    const currentEntityKey = EditorUtils.getCurrentEntityKey(editorState);
    const currentEntity = EditorUtils.getCurrentEntity(editorState);
    const className = cx(theme.button, { [theme.active]: isSelected });

    // NOTE: the ForceEditorRefresh component is needed because I couldn't
    // redux connect this component, to be able to send the forceRefresh action

    return (
      <div
        className={theme.buttonWrapper}
        onMouseDown={this.onMouseDown}
        role="presentation"
      >
        <ForceEditorRefresh editorKey={this.state.editorKey} />
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
            block="inline-data-entity"
            entityKey={currentEntityKey}
            data={currentEntity.data}
            title="Data entity parameters"
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default DataButton;
// export default connect()(DataButton);
