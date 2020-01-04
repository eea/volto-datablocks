import React from 'react';
import decorateComponentWithProps from 'decorate-component-with-props';
import AddButton from './Button';
import AddInlineButton from './InlineDataEntityButton';
import DataEntity from './DataEntity';
import { inlineDataEntityDecorator } from './decorators';
import * as types from './types';

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
        // TODO: this needs to be tested
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

export function makeInlineDataEntityPlugin(config = {}) {
  // A decorator for inline data. Triggered by #data{column@/path/to/connector}

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
    AddButton: decorateComponentWithProps(AddInlineButton, {
      store,
    }),
    decorators: [inlineDataEntityDecorator],
  };
}

export default function applyConfig(config) {
  const plugin = makeDataEntityPlugin();
  const inlinePlugin = makeInlineDataEntityPlugin();

  config.settings.richTextEditorPlugins = [
    ...(config.settings.richTextEditorPlugins || []),
    inlinePlugin,
    plugin,
  ];
  config.settings.richTextEditorInlineToolbarButtons.push(plugin.AddButton);
  config.settings.richTextEditorInlineToolbarButtons.push(
    inlinePlugin.AddButton,
  );

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
