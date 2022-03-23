import React from 'react';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  Sphere,
} from 'react-simple-maps';

import geoUrl from './static/world-50m-simplified.json';

const markers = [
  {
    name: 'Marker Portugalia',
    coordinates: [-8.543869257, 41.871456647],
  },
];

const PopupMap = ({ data }) => {
  const { long, lat, countryCode, pledgeName } = data;
  return (
    <div>
      <ComposableMap height={350} projection="geoMercator">
        <ZoomableGroup center={[long, lat]} zoom={13} minZoom={0} maxZoom={20}>
          <Sphere fill="#b1b1b1" />
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              return geographies
                .filter((d) => d.properties.REGION_UN === 'Europe')
                .map((geo) => {
                  const country = countryCode
                    ? geo.properties.ISO_A2 === countryCode
                    : '';
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
          {markers.map(({ name, coordinates }) => (
            <Marker key={name} coordinates={[long, lat]}>
              <circle r={0.6} fill="#F00" stroke="#616060" strokeWidth={0} />
              <text
                textAnchor="middle"
                fill="black"
                y={-1}
                style={{ fontSize: '1.5pt', fontWeight: 'bold' }}
              >
                {pledgeName}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default PopupMap;
