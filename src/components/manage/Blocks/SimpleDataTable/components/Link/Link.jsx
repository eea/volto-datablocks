import React from 'react';
import { getValue, getCellValue } from '../../helpers';
import { Link } from 'react-router-dom';

const LinkView = (props) => {
  const { tableData = {}, colDef = {}, row = 0 } = props;
  const Tag = colDef.render_as ? colDef.render_as.toLowerCase() : 'p';
  return (
    <>
      <Tag>
        {colDef.external ? (
          <a
            href={getValue(
              tableData,
              colDef.column_link,
              row,
              colDef.linkTemplate,
            )}
            target={colDef.target}
          >
            {getCellValue(tableData, colDef, row)}
          </a>
        ) : (
          <Link
            to={getValue(
              tableData,
              colDef.column_link,
              row,
              colDef.linkTemplate,
            )}
            target={colDef.target}
          >
            {getCellValue(tableData, colDef, row)}
          </Link>
        )}
      </Tag>
    </>
  );
};

export default LinkView;
