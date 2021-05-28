import React from 'react';
import { FormattedValue } from '@eeacms/volto-datablocks/Utils';

export const getValue = (tableData, column, rowIndex, textTemplate) => {
  let value = tableData[column]?.[rowIndex];
  if (textTemplate) {
    value = textTemplate.replace('{}', value);
  }
  return value;
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
