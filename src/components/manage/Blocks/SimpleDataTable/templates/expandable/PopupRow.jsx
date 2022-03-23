import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { Icon } from '@plone/volto/components';
import expandSVG from '@plone/volto/icons/vertical.svg';

import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';

import { Button, Image, Modal } from 'semantic-ui-react';

import logoDummy from './static/logoDummy.png';

import ReadMore from './ReadMore';
import PopupMap from './PopupMap';
import PopupTable from './PopupTable';

import {
  setConnectedDataParameters,
  deleteConnectedDataParameters,
} from '@eeacms/volto-datablocks/actions';
import schema from './schema';

const modalSchema = {
  title: 'Modal title',
  logo: logoDummy,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  mapData: [],
  tableData: {},
  url: 'https://google.com',
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
  const [popupSchema, setPopupSchema] = React.useState({
    title: '', // this could/shoud come from parent row (since we would not have ind org/descriptions)
    description: '', //same ^^
    tableColumns: [],
    mapData: [],
    url: '',
    logo: '',
  });

  React.useEffect(() => {
    //console.log('looks like popup data changed', provider_data);
    //do stuff with new data, maybe loader etc
    if (provider_data) {
      const {
        popupTitle,
        popupLogo,
        popupDescription,
        popupUrl,
        popupTableData,
        popupMapData,
      } = tableData;

      setPopupSchema({
        ...schema,
        title: rowData[popupTitle],
        logo: popupLogo,
        description: popupDescription,
        url: rowData[popupUrl],
        tableColumns: popupTableData,
        mapData: popupMapData,
      });
    }
  }, [provider_data, tableData, rowData]);

  const handleSetFilterProvider = (provider_data, tableData) => {
    // console.log('popup provider', tableData.popup_provider_url);
    // console.log('query table by', tableData.popup_data_query);
    // console.log(
    //   'in this table that param is',
    //   rowData[tableData.popup_data_query],
    // );

    const { popup_provider_url, popup_data_query } = tableData;
    const type = tableData['@type'];

    if (provider_data && popup_provider_url && popup_data_query) {
      setConnectedDataParameters(
        tableData.popup_provider_url,
        {
          i: tableData.popup_data_query,
          o: 'plone.app.querystring.operation.selection.any',
          v: [rowData[tableData.popup_data_query]],
        },
        `${type}_${tableData.popup_data_query}`,
      );
    }
  };

  const handleRemoveFilterProvider = (provider_data, tableData) => {
    const { popup_provider_url, popup_data_query } = tableData;
    const type = tableData['@type'];

    if (provider_data && popup_provider_url && popup_data_query) {
      deleteConnectedDataParameters(
        tableData.popup_provider_url,
        `${type}_${tableData.popup_data_query}`,
      );
    }
  };

  const handleExpand = () => {
    setExpand(true);
    //this will filter the popup data directly from provider
    if (
      provider_data &&
      tableData.popup_provider_url &&
      tableData.popup_data_query
    ) {
      handleSetFilterProvider(provider_data, tableData);
    }
  };

  const handleClose = () => {
    setExpand(false);

    //just to be sure unfilter data on popup close
    if (
      provider_data &&
      tableData.popup_provider_url &&
      tableData.popup_data_query
    ) {
      handleRemoveFilterProvider(provider_data, tableData);
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
        <Image size="tiny" src={modalSchema.logo} wrapped floated="right" />
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <ReadMore maxChars={200} text={modalSchema.description} />
        </Modal.Description>
        <div style={{ display: 'flex', margin: '10px 0' }}>
          <div style={{ width: '49%', marginRight: '5px' }}>
            {rowData && <PopupTable data={rowData} />}
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
            {rowData && <PopupMap data={rowData} />}
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
  connectToProviderData((props) => {
    return {
      provider_url: props.tableData?.popup_provider_url,
    };
  }),
  connect(
    (state) => {
      return {
        connected_data_parameters: state.connected_data_parameters,
      };
    },
    { setConnectedDataParameters, deleteConnectedDataParameters },
  ),
)(PopupRow);
