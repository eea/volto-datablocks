import React from 'react';
import isArray from 'lodash/isArray';
import { FormattedValue } from '../../../../Utils';

export const getValue = (tableData, column, rowIndex, textTemplate) => {
  let value = isArray(tableData)
    ? tableData[rowIndex]?.[column]
    : tableData[column]?.[rowIndex];
  if (textTemplate) {
    value = textTemplate.replace('{}', value);
  }
  return value;
};

export const getCellValue = (tableData, colDef, rowIndex, placeholder = '') => {
  let value;

  if (colDef === 'string') {
    value = isArray(tableData)
      ? tableData[rowIndex]?.[colDef]
      : tableData[colDef]?.[rowIndex];
  } else {
    value = isArray(tableData)
      ? tableData[rowIndex]?.[colDef.column]
      : tableData[colDef.column]?.[rowIndex];
  }

  return typeof colDef === 'string' ? (
    <span>{value || placeholder}</span>
  ) : (
    <FormattedValue
      textTemplate={colDef.textTemplate}
      value={value || placeholder}
      specifier={colDef.specifier}
    />
  );
};

export const isValidUrl = (url) => {
  if (!url) return '';

  let containsProtocol = url.includes('http://') || url.includes('https://');
  let checkedUrl = containsProtocol ? url : `https://${url}`;
  return checkedUrl;
};
