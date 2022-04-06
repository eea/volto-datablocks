import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { Icon } from '@plone/volto/components';
import expandSVG from '@plone/volto/icons/vertical.svg';

import { Button, Modal } from 'semantic-ui-react';

import ReadMore from './ReadMore';
import PopupMap from './PopupMap';
import PopupTable from './PopupTable';

import {
  setConnectedDataParameters,
  deleteConnectedDataParameters,
} from '@eeacms/volto-datablocks/actions';

const defaultSchema = {
  title: '',
  description: '', //
  tableColumns: [],
  url: '',
  logo: '',
  mapData: {},
};

const ValidImage = ({ imageUrl }) => {
  const [isValidImg, setIsValidImg] = React.useState(true);

  React.useEffect(() => {
    setIsValidImg(true);
  }, [imageUrl]);

  return imageUrl && isValidImg ? (
    <img src={imageUrl} alt={imageUrl} onError={() => setIsValidImg(false)} />
  ) : (
    <Icon name={expandSVG} size="3rem" className="expand-row" />
  );
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

  React.useEffect(() => {
    if (expand) {
      const {
        popupTitle,
        image_url,
        popupDescription,
        popupUrl,
        popupTableColumns,
        popupLong,
        popupLat,
        popupMapLabel,
        popupCountryCode,
      } = tableData;

      setPopupSchema({
        ...popupSchema,
        title: rowData[popupTitle],
        logo: rowData[image_url],
        description: rowData[popupDescription],
        url: rowData[popupUrl],
        tableColumns: popupTableColumns,
        mapData: {
          long: popupLong,
          lat: popupLat,
          label: popupMapLabel,
          country: popupCountryCode,
        },
      });
    } else {
      setPopupSchema(defaultSchema);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      trigger={
        <span>
          <ValidImage imageUrl={rowData[tableData.image_url]} />
        </span>
      }
    >
      <Modal.Header className="popup-header">{popupSchema.title}</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description style={{ display: 'flex' }}>
          {popupSchema.description && (
            <div className="description-container">
              <ReadMore maxChars={200} text={popupSchema.description} />
            </div>
          )}
          {popupSchema.logo && (
            <img
              src={popupSchema.logo}
              alt={popupSchema.logo}
              className="popup-logo"
              onError={() => setPopupSchema({ ...popupSchema, logo: '' })} // don't show it if it's not available
            />
          )}
        </Modal.Description>
        <div
          style={{
            display: 'flex',
            margin: '10px 0',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ width: '49%' }}>
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
          <div style={{ width: '49%' }}>
            {rowData && (
              <PopupMap
                rowData={rowData}
                providerUrl={popup_map_provider_url}
                mapData={popupSchema.mapData}
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
