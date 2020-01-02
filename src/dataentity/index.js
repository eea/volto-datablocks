import React from 'react';
import decorateComponentWithProps from 'decorate-component-with-props';
import AddButton from './Button';
import DataEntity from './DataEntity';
import * as types from './types';

import './styles.css';

export function makeDataEntityPlugin(config = {}) {
  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
  };

  return {
    initialize: ({ getEditorState, setEditorState, getEditorRef }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
      store.getEditorRef = getEditorRef;
    },
    AddButton: decorateComponentWithProps(AddButton, {
      store,
    }),

    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === types.ATOMIC) {
        // TODO subject to change for draft-js next release
        const contentState = getEditorState().getCurrentContent();
        const entity = contentState.getEntity(block.getEntityAt(0));
        const type = entity.getType();
        const props = entity.getData();

        if (type === types.DATAENTITY) {
          return {
            component: DataEntity,
            editable: false,
            props,
          };
        }
      }
    },
  };
}

export default function applyConfig(config) {
  const plugin = makeDataEntityPlugin();

  config.settings.richTextEditorPlugins = [
    ...(config.settings.richTextEditorPlugins || []),
    plugin,
  ];
  config.settings.richTextEditorInlineToolbarButtons.push(plugin.AddButton);

  // redraft final rendering for View.jsx
  config.settings.ToHTMLRenderers.entities = {
    ...config.settings.ToHTMLRenderers.entities,
    [types.DATAENTITY]: (children, blockProps, { key }) => {
      return (
        <DataEntity blockProps={blockProps} key={key}>
          {children}
        </DataEntity>
      );
    },
  };

  // console.log('entity renderers', config.settings.ToHTMLRenderers.entities);

  return config;
}
