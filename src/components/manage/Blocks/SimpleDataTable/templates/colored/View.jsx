import React from 'react';
import { Icon } from '@plone/volto/components';
import { Table, Menu, Loader } from 'semantic-ui-react';
import RenderComponent from '../../components';
import cx from 'classnames';

import leftSVG from '@plone/volto/icons/left-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';

import './style.less';

const View = (props) => {
  const {
    data = {},
    getAlignmentOfColumn,
    getNameOfColumn,
    getTitleOfColumn,
    has_pagination,
    pagination = {},
    placeholder,
    provider_data,
    row_size,
    selectedColumns,
    show_header,
    tableData,
    updatePagination = () => {},
  } = props;

  const { th_color, td_color } = data;

  const getColorOfTableCell = (i) => {
    return selectedColumns
      .map((col) => {
        const column = col.column;
        const cell = td_color?.find(
          (c) => c.label === provider_data[column][i],
        );
        return cell?.color;
      })
      .filter((v) => v);
  };

  return (
    <div
      className={cx('colored-table', {
        'with-pagination': data.has_pagination,
      })}
    >
      {row_size ? (
        <Table
          textAlign="left"
          striped={data.striped}
          className={`unstackable ${data.bordered ? 'no-borders' : ''}
          ${data.compact_table ? 'compact-table' : ''}`}
        >
          {show_header && (
            <Table.Header style={{ backgroundColor: th_color }}>
              <Table.Row>
                {td_color && td_color.length > 0 && <Table.HeaderCell />}
                {selectedColumns.map((colDef, j) => (
                  <Table.HeaderCell
                    key={getNameOfColumn(colDef)}
                    className={getAlignmentOfColumn(colDef, j)}
                  >
                    {getTitleOfColumn(colDef)}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
          )}
          <Table.Body>
            {Array(Math.max(0, row_size))
              .fill()
              .map((_, i) => (
                <Table.Row key={i}>
                  {td_color && td_color.length > 0 && (
                    <Table.Cell className="colored-cell">
                      <span
                        style={{
                          backgroundColor: td_color
                            ? getColorOfTableCell(i)
                            : '',
                        }}
                      />
                    </Table.Cell>
                  )}
                  {selectedColumns.map((colDef, j) => (
                    <Table.Cell
                      key={`${i}-${getNameOfColumn(colDef)}`}
                      textAlign={getAlignmentOfColumn(colDef, j)}
                    >
                      {typeof colDef !== 'string' ? (
                        <RenderComponent
                          tableData={tableData}
                          colDef={colDef}
                          row={i}
                          {...props}
                        />
                      ) : (
                        tableData[colDef][i]
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
          </Table.Body>
          {has_pagination && (
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell
                  colSpan={selectedColumns.length}
                  style={{ textAlign: 'center' }}
                >
                  <Menu pagination>
                    <Menu.Item
                      as="a"
                      icon
                      disabled={
                        props.loadingProviderData || pagination.activePage === 1
                      }
                      onClick={() => {
                        if (pagination.activePage > 1) {
                          updatePagination({
                            activePage: pagination.activePage - 1,
                          });
                        }
                      }}
                    >
                      <Icon name={leftSVG} size="24px" />
                    </Menu.Item>
                    <Menu.Item fitted>
                      <Loader
                        disabled={!props.loadingProviderData}
                        active
                        inline
                        size="tiny"
                      />
                    </Menu.Item>
                    <Menu.Item
                      as="a"
                      icon
                      disabled={
                        props.loadingProviderData ||
                        pagination.activePage === pagination.lastPage
                      }
                      onClick={() => {
                        if (row_size === pagination.itemsPerPage) {
                          updatePagination({
                            activePage: pagination.activePage + 1,
                          });
                        }
                      }}
                    >
                      <Icon name={rightSVG} size="24px" />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          )}
        </Table>
      ) : (
        // TODO: find a better solution to keep headers
        <Table
          textAlign="left"
          striped={data.striped}
          className={`unstackable ${data.bordered ? 'no-borders' : ''}
          ${data.compact_table ? 'compact-table' : ''}`}
        >
          {show_header && (
            <Table.Header style={{ backgroundColor: th_color }}>
              <Table.Row>
                <Table.HeaderCell />
                {data?.columns?.map((header) => (
                  <Table.HeaderCell
                    key={header.column}
                    className={header.textAlign || 'left'}
                  >
                    <p>{header.title}</p>
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
          )}
          <Table.Body>
            <Table.Row>
              <Table.Cell className="colored-cell">
                <span />
              </Table.Cell>
              <Table.Cell colSpan={data?.columns?.length || 1}>
                <p>{placeholder}</p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default View;
