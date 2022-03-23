import React from 'react';
import { connect } from 'react-redux';

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
  popupProviderData,
  connected_data_parameters,
  setConnectedDataParameters,
  deleteConnectedDataParameters,
}) => {
  const [expand, setExpand] = React.useState(false);
  // console.log('popupProviderData', popupProviderData);
  const handleExpand = () => {
    setExpand(true);
    //this will filter the popup data directly from provider
    if (
      popupProviderData &&
      tableData.popup_provider_url &&
      tableData.popup_data_query
    ) {
      setConnectedDataParameters(
        tableData.popup_provider_url,
        {
          i: tableData.popup_data_query,
          o: 'plone.app.querystring.operation.selection.any',
          v: [rowData[tableData.popup_data_query]],
        },
        `dataqueryfilter_${tableData.popup_data_query}`,
      );
    } else {
      deleteConnectedDataParameters(
        tableData.popup_provider_url,
        `dataqueryfilter_${tableData.popup_data_query}`,
      );
    }
    console.log('connected_data_parameters', connected_data_parameters);
    // console.log('popupprov url', tableData.popup_provider_url);
    // console.log('selected field', tableData.popup_data_query);
    // console.log('selectfield value', rowData[tableData.popup_data_query]);
  };

  const handleClose = () => {
    setExpand(false);
  };

  return (
    <Modal
      onClose={() => handleClose()}
      onOpen={() => handleExpand()}
      open={expand}
      trigger={<Icon name={expandSVG} size="2rem" className="expand-row" />}
    >
      <Modal.Header>
        {modalSchema.title}
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
              href={modalSchema.url}
              target="_blank"
              rel="noreferrer"
              className="popup-url"
            >
              {modalSchema.url}
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

export default connect(
  (state) => {
    return {
      connected_data_parameters: state.connected_data_parameters,
    };
  },
  { setConnectedDataParameters, deleteConnectedDataParameters },
)(PopupRow);
