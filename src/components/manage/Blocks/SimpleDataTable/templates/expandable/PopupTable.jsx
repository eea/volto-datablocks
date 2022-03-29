import React from 'react';
import { Label, Table } from 'semantic-ui-react';
import { compose } from 'redux';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';

const PopupTable = ({
  rowData,
  providerUrl,
  type,
  query,
  queryVal,
  provider_data,
}) => {
  // const applyFilterToProvider = () => {
  //   setConnectedDataParameters(
  //     providerUrl,
  //     {
  //       i: query,
  //       o: 'plone.app.querystring.operation.selection.any',
  //       v: [queryVal],
  //     },
  //     `${type}_${query}`,
  //   );
  // };

  // React.useEffect(() => {
  //   applyFilterToProvider();
  // }, []);
  // console.log('prvTable', provider_data);

  if (!provider_data) {
    return 'Loading..';
  }

  return (
    <div className="popup-table-container">
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Header</Table.HeaderCell>
            <Table.HeaderCell>Header</Table.HeaderCell>
            <Table.HeaderCell>Header</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
          </Table.Row>
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
