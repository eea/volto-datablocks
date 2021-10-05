import React from 'react';
import { getCellValue } from '../../helpers';

const TextView = (props) => {
  const { tableData = {}, colDef = {}, row = 0, placeholder } = props;
  const Tag = colDef.render_as ? colDef.render_as.toLowerCase() : 'p';
  return (
    <>
      <Tag>{getCellValue(tableData, colDef, row, placeholder)}</Tag>
    </>
  );
};

export default TextView;
