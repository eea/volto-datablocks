import React from 'react';
import decorateComponentWithProps from 'decorate-component-with-props';
import {
  ConnectedDataBlock,
  ConnectedDataInlineSource,
  ConnectedDataBlockSource,
  RedraftConnectedDataInline,
} from './components';
import { inlineDataEntityDecorator } from './decorators';
import * as types from './types';

export function makeBlockDataEntityPlugin(config = {}) {
  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
    getEditorRef: undefined,
  };

  return {
    initialize: ({ getEditorState, setEditorState, getEditorRef }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
      store.getEditorRef = getEditorRef;
    },
    AddButton: decorateComponentWithProps(ConnectedDataBlockSource, {
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
            component: ConnectedDataBlock,
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
    getEditorRef: undefined,
  };

  return {
    initialize: ({ getEditorState, setEditorState, getEditorRef }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
      store.getEditorRef = getEditorRef;
    },
    AddButton: decorateComponentWithProps(ConnectedDataInlineSource, {
      store,
    }),
    decorators: [inlineDataEntityDecorator],
  };
}

export default function applyConfig(config) {
  // const blockPlugin = makeBlockDataEntityPlugin();
  const inlinePlugin = makeInlineDataEntityPlugin();

  config.settings.richTextEditorPlugins = [
    ...(config.settings.richTextEditorPlugins || []),
    // blockPlugin,
    inlinePlugin,
  ];

  config.settings.richTextEditorInlineToolbarButtons = [
    ...(config.settings.richTextEditorInlineToolbarButtons || []),
    // blockPlugin.AddButton,
    inlinePlugin.AddButton,
  ];

  // redraft final rendering for View.jsx
  config.settings.ToHTMLRenderers.entities = {
    ...config.settings.ToHTMLRenderers.entities,
    // [types.DATAENTITY]: (children, blockProps, { key }) => {
    //   return (
    //     <ConnectedDataBlock blockProps={blockProps} key={key}>
    //       {children}
    //     </ConnectedDataBlock>
    //   );
    // },
    [types.INLINEDATAENTITY]: (children, blockProps, { key }) => {
      return (
        <RedraftConnectedDataInline entityData={blockProps} key={key}>
          {children}
        </RedraftConnectedDataInline>
      );
    },
  };

  return config;
}
