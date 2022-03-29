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
  const type = tableData['@type'];

  const {
    popup_table_provider_url,
    popup_map_provider_url,
    popup_data_query,
  } = tableData;

  const queryVal = rowData[popup_data_query];

  // React.useEffect(() => {
  //   //do stuff with new data, maybe loader etc
  //   if (provider_data) {
  //     const {
  //       popupTitle,
  //       popupLogo,
  //       popupDescription,
  //       popupUrl,
  //       popupTableColumns,
  //       popupMapData,
  //     } = tableData;

  //     setPopupSchema({
  //       ...schema,
  //       title: rowData[popupTitle],
  //       logo: popupLogo,
  //       description: popupDescription,
  //       url: rowData[popupUrl],
  //       tableColumns: popupTableColumns,
  //       mapData: popupMapData,
  //     });
  //   }
  // }, [provider_data, tableData, rowData]);

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
        <Image size="tiny" src={modalSchema.logo} wrapped floated="right" />
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <ReadMore maxChars={200} text={modalSchema.description} />
        </Modal.Description>
        <div style={{ display: 'flex', margin: '10px 0' }}>
          <div style={{ width: '49%', marginRight: '5px' }}>
            {rowData && (
              <PopupTable
                rowData={rowData}
                providerUrl={popup_table_provider_url}
                type={type}
                query={popup_data_query}
                queryVal={queryVal}
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
                type={type}
                query={popup_data_query}
                queryVal={queryVal}
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
  // connectToProviderData((props) => {
  //   return {
  //     provider_url: props.tableData?.popup_table_provider_url,
  //   };
  // }),
  connect(
    (state) => {
      return {
        connected_data_parameters: state.connected_data_parameters,
      };
    },
    { setConnectedDataParameters, deleteConnectedDataParameters },
  ),
)(PopupRow);
