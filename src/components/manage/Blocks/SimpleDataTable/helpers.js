import React from 'react';
import _ from 'lodash';
import { FormattedValue } from '../../../../Utils';

export const getValue = (tableData, column, rowIndex, textTemplate) => {
  let value = _.isArray(tableData)
    ? tableData[rowIndex]?.[column]
    : tableData[column]?.[rowIndex];
  if (textTemplate) {
    value = textTemplate.replace('{}', value);
  }
  return value;
};

export const getCellValue = (tableData, colDef, rowIndex) => {
  let value;

  if (colDef === 'string') {
    value = _.isArray(tableData)
      ? tableData[rowIndex]?.[colDef]
      : tableData[colDef]?.[rowIndex];
  } else {
    value = _.isArray(tableData)
      ? tableData[rowIndex]?.[colDef.column]
      : tableData[colDef.column]?.[rowIndex];
  }

  return typeof colDef === 'string' ? (
    <span>{value}</span>
  ) : (
    <FormattedValue
      textTemplate={colDef.textTemplate}
      value={value}
      specifier={colDef.specifier}
    />
  );
};
