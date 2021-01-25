import React from 'react';
import { FormattedValue } from 'volto-datablocks/Utils';

export const getValue = (tableData, column, rowIndex) => {
  return tableData[column]?.[rowIndex];
};

export const getCellValue = (tableData, colDef, rowIndex) => {
  return typeof colDef === 'string' ? (
    <span>{tableData[colDef]?.[rowIndex]}</span>
  ) : (
    <FormattedValue
      textTemplate={colDef.textTemplate}
      value={tableData[colDef.column]?.[rowIndex]}
      specifier={colDef.specifier}
    />
  );
};

const serializeData = (node) => {
  return JSON.stringify({ type: node.type, data: node.data });
};

export const serializeNodes = (nodes, getAttributes) => {
  const editor = { children: nodes || [] };

  const _serializeNodes = (nodes) => {
    return (nodes || []).map(([node, path], i) => {
      return Text.isText(node) ? (
        <Leaf path={path} leaf={node} text={node} mode="view" key={path}>
          {node.text}
        </Leaf>
      ) : (
        <Element
          path={path}
          element={node}
          mode="view"
          key={path}
          data-slate-data={node.data ? serializeData(node) : null}
          attributes={
            isEqual(path, [0])
              ? getAttributes
                ? getAttributes(node, path)
                : null
              : null
          }
        >
          {_serializeNodes(Array.from(Node.children(editor, path)))}
        </Element>
      );
    });
  };

  return _serializeNodes(Array.from(Node.children(editor, [])));
};
