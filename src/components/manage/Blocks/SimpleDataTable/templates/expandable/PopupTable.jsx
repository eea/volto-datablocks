import React from 'react';
import { Label, Table } from 'semantic-ui-react';
import { compose } from 'redux';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import RenderComponent from '../../components';

const getProviderDataLength = (provider_data) => {
  return provider_data
    ? provider_data[Object.keys(provider_data)[0]]?.length || 0
    : 0;
};

const PopupTable = ({ rowData, providerUrl, provider_data, tableColumns }) => {
  const [tableData, setTableData] = React.useState([]);

  React.useEffect(() => {
    const provider_data_length = getProviderDataLength(provider_data);
    const newTableData = [];
    if (provider_data_length) {
      const keys = Object.keys(provider_data);
      Array(provider_data_length)
        .fill()
        .forEach((_, i) => {
          const obj = {};
          keys.forEach((key) => {
            obj[key] = provider_data[key][i];
          });
          newTableData.push(obj);
        });
    }
    setTableData(newTableData);
    /* eslint-disable-next-line */
  }, [provider_data]);

  if (!provider_data) {
    return 'Loading..';
  }

  return (
    <div className="popup-table-container">
      <Table celled>
        <Table.Header>
          <Table.Row>
            {tableColumns &&
              tableColumns.length > 0 &&
              tableColumns.map((col) => (
                <Table.HeaderCell>
                  {col.title ? col.title : col.column}
                </Table.HeaderCell>
              ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {tableData &&
            tableData.length > 0 &&
            Array(tableData.length)
              .fill()
              .map((_, i) => {
                return (
                  <Table.Row key={i}>
                    {tableColumns.map((col, j) => (
                      <Table.Cell key={j}>
                        <RenderComponent
                          tableData={tableData}
                          colDef={col}
                          row={i}
                        />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                );
              })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default compose(
  connectToProviderData((props) => {
    return {
      provider_url: props.providerUrl,
    };
  }),
)(PopupTable);
