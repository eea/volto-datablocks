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
