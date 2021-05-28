import React from 'react';
import { Popup, Table } from 'semantic-ui-react';
import { connectBlockToProviderData } from '../../../../hocs';
import { DEFAULT_MAX_DOT_COUNT } from './constants';
import {
  filterDataByParameters,
  connectToDataParameters,
} from '../../../../helpers';
import { compose } from 'redux';
import { serializeNodes } from '../../../../serialize';
import { FormattedValue } from '../../../../Utils';

import './styles.less';

const DottedTableChartView = (props) => {
  const { data, provider_data, connected_data_parameters } = props;

  const filteredData =
    filterDataByParameters(provider_data, connected_data_parameters) || {};

  const {
    description,
    column_data,
    row_data,
    size_data,
    row_colors = {},
    max_dot_count = DEFAULT_MAX_DOT_COUNT,
    text_template,
    specifier,
  } = data;

  const possible_columns = Array.from(
    new Set(filteredData?.[column_data]),
  ).sort();
  const possible_rows = Array.from(new Set(filteredData?.[row_data])).sort();

  const data_tree = React.useMemo(() => {
    const res = {};
    (filteredData?.[column_data] || []).forEach((cv, i) => {
      res[cv] = {
        ...res[cv],
        [filteredData?.[row_data]?.[i]]: filteredData?.[size_data]?.[i],
      };
    });
    return res;
  }, [column_data, filteredData, row_data, size_data]);

  const size_column_data = filteredData?.[size_data] || [];
  // TODO: use sums to find the biggest value for a column?
  const maxValue = React.useMemo(() => {
    const numbers = size_column_data.map((s) =>
      typeof s === 'string' ? parseFloat(s) : s,
    );
    return Math.max(...numbers);
  }, [size_column_data]);

  const dotSize = Math.ceil(maxValue / max_dot_count);

  const renderDots = (value, color) => {
    const arraySize = Math.floor(value / dotSize);
    return (
      <div className="dot-cells">
        {arraySize && dotSize
          ? new Array(arraySize)
              .fill(1)
              .map((_, i) => (
                <div key={i} style={{ backgroundColor: color }}></div>
              ))
          : ''}
      </div>
    );
  };

  return (
    <div className="dotted-table-chart">
      <div className={`${data.underline ? 'with-border' : ''}`}>
        {description ? serializeNodes(description) : ''}
      </div>
      <div className="inner">
        {!!filteredData && column_data && row_data && size_data ? (
          <Table
            textAlign="left"
            striped={data.striped}
            className={`unstackable ${data.bordered ? 'no-borders' : ''}
    ${data.compact_table ? 'compact-table' : ''}`}
          >
            <Table.Header>
              <Table.Row>
                <Table.Cell key="first-cell"></Table.Cell>
                {possible_columns.map((v, y) => (
                  <Table.HeaderCell key={`${v}-${y}`}>{v}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {possible_rows.map((row, i) => (
                <Table.Row key={`${row}-${i}`}>
                  <Table.HeaderCell
                    key="first-cell"
                    style={{ color: row_colors?.[row] }}
                  >
                    {row}
                  </Table.HeaderCell>
                  {possible_columns.map((col, y) => (
                    <Table.Cell
                      verticalAlign="top"
                      key={`${col}-${y}`}
                      style={{
                        // hack from https://stackoverflow.com/a/3542470/258462
                        height: '1px',

                        padding: '0',
                      }}
                    >
                      <Popup
                        content={
                          // it might happen that the FormattedValue component returns empty string because of the input data
                          <>
                            Value:{' '}
                            <FormattedValue
                              textTemplate={text_template}
                              value={data_tree[col][row]}
                              specifier={specifier}
                            />
                          </>
                        }
                        trigger={
                          <div
                            style={{
                              // hack from https://stackoverflow.com/a/3542470/258462
                              height: '100%',

                              padding: '0.78571429em', // value taken from SUIR's collections/table.less (possibly needs to be changed if compact table style is implemented in DottedTableChartView)
                            }}
                          >
                            {renderDots(data_tree[col][row], row_colors?.[row])}
                          </div>
                        }
                      />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default compose(
  connectBlockToProviderData,
  connectToDataParameters,
)(React.memo(DottedTableChartView));
