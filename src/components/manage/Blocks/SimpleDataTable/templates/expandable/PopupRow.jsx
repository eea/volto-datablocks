import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { Icon } from '@plone/volto/components';
import expandSVG from '@plone/volto/icons/vertical.svg';

import { Button, Image, Modal } from 'semantic-ui-react';

import logoDummy from './static/logoDummy.png';

import ReadMore from './ReadMore';
import PopupMap from './PopupMap';
import PopupTable from './PopupTable';

import {
  setConnectedDataParameters,
  deleteConnectedDataParameters,
} from '@eeacms/volto-datablocks/actions';

const defaultSchema = {
  title: '', // this could/shoud come from parent row (since we would not have ind org/descriptions)
  description: '', //same ^^
  tableColumns: [],
  mapData: [],
  url: '',
  logo: '',
};

const PopupRow = ({
  rowData,
  tableData,
  provider_data,
  connected_data_parameters,
  setConnectedDataParameters,
  deleteConnectedDataParameters,
}) => {
  const [expand, setExpand] = React.useState(false);
  const [popupSchema, setPopupSchema] = React.useState(defaultSchema);
  const type = tableData['@type'];

  const {
    popup_table_provider_url,
    popup_map_provider_url,
    popup_data_query,
  } = tableData;

  const queryVal = rowData[popup_data_query];

  // console.log('tableData', tableData);
  // console.log('rowData', rowData);
  // console.log('tablecols', tableData.popupTableColumns);

  React.useEffect(() => {
    if (expand) {
      const {
        popupTitle,
        popupLogo,
        popupDescription,
        popupUrl,
        popupTableColumns,
        popupMapData,
      } = tableData;

      setPopupSchema({
        ...popupSchema,
        title: rowData[popupTitle],
        logo: popupLogo,
        description: rowData[popupDescription],
        url: rowData[popupUrl],
        tableColumns: popupTableColumns,
        mapData: popupMapData,
      });
    } else {
      setPopupSchema(defaultSchema);
    }
  }, [expand, tableData, rowData]);

  const handleSetFilterProvider = (provider_url, query, value, type) => {
    if (provider_url && popup_data_query) {
      setConnectedDataParameters(
        provider_url,
        {
          i: query,
          o: 'plone.app.querystring.operation.selection.any',
          v: [value],
        },
        `${type}_${query}`,
      );
    }
  };

  const handleRemoveFilterProvider = (provider_url, query, type) => {
    if (
      popup_map_provider_url &&
      popup_table_provider_url &&
      popup_data_query
    ) {
      deleteConnectedDataParameters(
        provider_url,
        `${type}_${popup_data_query}`,
      );
    }
  };

  const handleExpand = () => {
    setExpand(true);
    //this will filter the popup map & table data
    if (
      popup_map_provider_url &&
      popup_table_provider_url &&
      popup_data_query
    ) {
      handleSetFilterProvider(
        popup_map_provider_url,
        popup_data_query,
        queryVal,
        type,
      );
      handleSetFilterProvider(
        popup_table_provider_url,
        popup_data_query,
        queryVal,
        type,
      );
    }
  };

  const handleClose = () => {
    setExpand(false);

    //unfilter data on popup close
    if (
      popup_map_provider_url &&
      popup_table_provider_url &&
      popup_data_query
    ) {
      handleRemoveFilterProvider(
        popup_map_provider_url,
        popup_data_query,
        type,
      );
      handleRemoveFilterProvider(
        popup_table_provider_url,
        popup_data_query,
        type,
      );
    }
  };

  return (
    <Modal
      onClose={() => handleClose()}
      onOpen={() => handleExpand()}
      open={expand}
      trigger={<Icon name={expandSVG} size="2rem" className="expand-row" />}
    >
      <Modal.Header>
        {popupSchema.title}
        {/* <Image size="tiny" src={modalSchema.logo} wrapped floated="right" /> */}
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          {popupSchema.description && (
            <ReadMore maxChars={200} text={popupSchema.description} />
          )}
        </Modal.Description>
        <div style={{ display: 'flex', margin: '10px 0' }}>
          <div style={{ width: '49%', marginRight: '5px' }}>
            {rowData && (
              <PopupTable
                rowData={rowData}
                providerUrl={popup_table_provider_url}
                tableColumns={popupSchema.tableColumns}
              />
            )}
            <a
              href={popupSchema.url}
              target="_blank"
              rel="noreferrer"
              className="popup-url"
            >
              {popupSchema.url}
            </a>
          </div>
          <div style={{ width: '49%', marginLeft: '5px' }}>
            {rowData && (
              <PopupMap
                rowData={rowData}
                providerUrl={popup_map_provider_url}
              />
            )}
          </div>
        </div>
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={() => handleClose()}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default compose(
  connect(
    (state) => {
      return {
        connected_data_parameters: state.connected_data_parameters,
      };
    },
    { setConnectedDataParameters, deleteConnectedDataParameters },
  ),
)(PopupRow);
