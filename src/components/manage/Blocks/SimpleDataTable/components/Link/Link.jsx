import React from 'react';
import { getValue, getCellValue } from '../../helpers';

const Link = (props) => {
  const { tableData = {}, colDef = {}, row = 0 } = props;
  const Tag = colDef.render_as ? colDef.render_as.toLowerCase() : 'p';
  return (
    <>
      <Tag>
        <a
          href={getValue(tableData, colDef.column_link, row)}
          target={colDef.target}
        >
          {getCellValue(tableData, colDef, row)}
        </a>
      </Tag>
    </>
  );
};

export default Link;
