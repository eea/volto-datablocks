import React from 'react';
import { getValue, getCellValue, isValidUrl } from '../../helpers';
import { Link } from 'react-router-dom';

const LinkView = (props) => {
  const { tableData = {}, colDef = {}, row = 0, placeholder } = props;
  const Tag = colDef.render_as ? colDef.render_as.toLowerCase() : 'p';

  const linkValue = getValue(
    tableData,
    colDef.column_link,
    row,
    colDef.linkTemplate,
  );

  const checkedLink = isValidUrl(linkValue);

  return (
    <>
      <Tag>
        {colDef.external ? (
          <a href={checkedLink} target={colDef.target}>
            {getCellValue(tableData, colDef, row, placeholder)}
          </a>
        ) : (
          <Link to={linkValue} target={colDef.target}>
            {getCellValue(tableData, colDef, row, placeholder)}
          </Link>
        )}
      </Tag>
    </>
  );
};

export default LinkView;
