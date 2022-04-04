import React from 'react';
import { compose } from 'redux';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';

import { Map, Marker } from 'pigeon-maps';

const getProviderDataLength = (provider_data) => {
  return provider_data
    ? provider_data[Object.keys(provider_data)[0]]?.length || 0
    : 0;
};

const PopupMap = ({ rowData, provider_data, mapData }) => {
  const [mapCenter, setMapCenter] = React.useState([45, 9]);

  const [selectedData, setSelectedData] = React.useState([]);

  React.useEffect(() => {
    const provider_data_length = getProviderDataLength(provider_data);
    const newMapData = [];
    if (provider_data_length) {
      const keys = Object.keys(provider_data);
      Array(provider_data_length)
        .fill()
        .forEach((_, i) => {
          const obj = {};
          keys.forEach((key) => {
            obj[key] = provider_data[key][i];
          });
          newMapData.push(obj);
        });
    }
    setSelectedData(newMapData);
    /* eslint-disable-next-line */
  }, [provider_data]);

  const countries =
    provider_data && provider_data[mapData.country]
      ? provider_data[mapData.country]
      : '';

  const uniqueCountries = [...new Set(countries)];

  if (!provider_data) {
    return 'Loading..';
  }
  console.log('selected', selectedData);
  return (
    <div>
      <Map height={500} center={mapCenter} defaultZoom={11}>
        {selectedData.map((item, i) => {
          const long = item[mapData.long] ? item[mapData.long] : '';
          const lat = item[mapData.lat] ? item[mapData.lat] : '';
          const label = item[mapData.label] ? item[mapData.label] : '';
          return <Marker width={30} color={'#00519d'} anchor={[lat, long]} />;
        })}
      </Map>
    </div>
  );
};

export default compose(
  connectToProviderData((props) => {
    return {
      provider_url: props.providerUrl,
    };
  }),
)(PopupMap);
