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
    const { long, lat } = mapData;
    const allLong =
      selectedData.length > 0 ? selectedData.map((i) => i[long]) : '';
    const allLat =
      selectedData.length > 0 ? selectedData.map((i) => i[lat]) : '';
    const minLong = allLong && allLong.length > 0 ? Math.min(...allLong) : '';
    const maxLong = allLong && allLong.length > 0 ? Math.max(...allLong) : '';
    const minLat = allLong && allLong.length > 0 ? Math.min(...allLat) : '';
    const maxLat = allLong && allLong.length > 0 ? Math.max(...allLat) : '';

    const centerLat = minLat && maxLat ? (minLat + maxLat) / 2 : '';
    const centerLong = minLong && maxLong ? (minLong + maxLong) / 2 : '';

    if (centerLat && centerLong) {
      setMapCenter([centerLat, centerLong]);
    }
  }, [selectedData, mapData]);

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

  // const countries =
  //   provider_data && provider_data[mapData.country]
  //     ? provider_data[mapData.country]
  //     : '';

  //const uniqueCountries = [...new Set(countries)];

  if (!provider_data) {
    return 'Loading..';
  }
  return (
    <div>
      {selectedData.length > 0 ? (
        <Map height={500} center={mapCenter} defaultZoom={5}>
          {selectedData.map((item, i) => {
            const long = item[mapData.long] ? item[mapData.long] : '';
            const lat = item[mapData.lat] ? item[mapData.lat] : '';
            /* const label = item[mapData.label] ? item[mapData.label] : ''; */
            return <Marker width={30} color={'#00519d'} anchor={[lat, long]} />;
          })}
        </Map>
      ) : (
        <p>No data available for map.</p>
      )}
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
