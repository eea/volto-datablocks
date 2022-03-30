import React from 'react';
import { compose } from 'redux';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  Sphere,
} from 'react-simple-maps';
import geoUrl from './static/world-50m-simplified.json';

const getProviderDataLength = (provider_data) => {
  return provider_data
    ? provider_data[Object.keys(provider_data)[0]]?.length || 0
    : 0;
};

const PopupMap = ({ rowData, provider_data, mapData }) => {
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
      <ComposableMap height={350} projection="geoMercator">
        <ZoomableGroup zoom={13} maxZoom={20}>
          <Sphere fill="#b1b1b1" />
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              return geographies
                .filter((d) => d.properties.REGION_UN === 'Europe')
                .map((geo) => {
                  const country = uniqueCountries.includes(
                    geo.properties.ISO_A2,
                  );
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={country ? '#6bb16b' : '#ebebeb'}
                      stroke="#525252"
                      strokeWidth={0.3}
                    />
                  );
                });
            }}
          </Geographies>
          {selectedData.map((item, i) => {
            const long = item[mapData.long] ? item[mapData.long] : '';
            const lat = item[mapData.lat] ? item[mapData.lat] : '';
            const label = item[mapData.label] ? item[mapData.label] : '';
            return (
              <Marker key={i} coordinates={[long, lat]}>
                <circle r={0.6} fill="#F00" stroke="#616060" strokeWidth={0} />
                <text
                  textAnchor="middle"
                  fill="black"
                  y={-1}
                  style={{ fontSize: '1.5pt', fontWeight: 'bold' }}
                >
                  {label}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
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
