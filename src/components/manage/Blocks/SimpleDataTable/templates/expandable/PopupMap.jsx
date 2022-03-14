import React from 'react';
import Map from '@eeacms/volto-openlayers-map/Map';

import { Interactions } from '@eeacms/volto-openlayers-map/Interactions';
import { Controls } from '@eeacms/volto-openlayers-map/Controls';
import { Layers, Layer } from '@eeacms/volto-openlayers-map/Layers';
import { Overlays } from '@eeacms/volto-openlayers-map/Overlays';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';

import geoUrl from './static/world-50m-simplified.json';

const markers = [
  {
    markerOffset: -30,
    name: 'Chikalaka marker Portugalia',
    coordinates: [-8.543869257, 41.871456647],
  },
];

// <Map view={{ center: [-8.543869257, 41.871456647], zoom: 2 }}>
//   <Layers>
//     <Layer.Tile />
//     {/* <Layer.Vector options={} /> */}
//   </Layers>
//   <Controls />
//   <Interactions />
//   <Overlays />
// </Map>

const PopupMap = ({}) => {
  return (
    <div>
      <ComposableMap projection="geoMercator">
        <ZoomableGroup
          center={[-8.543869257, 41.871456647]}
          zoom={3}
          minZoom={0}
          maxZoom={8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#dcdcdc"
                  stroke="#9595da"
                />
              ))
            }
          </Geographies>
          {markers.map(({ name, coordinates, markerOffset }) => (
            <Marker key={name} coordinates={coordinates}>
              <circle r={2} fill="#F00" stroke="#616060" strokeWidth={1} />
              <text
                textAnchor="middle"
                y={markerOffset}
                style={{ fontFamily: 'system-ui', fill: '#5D5A6D' }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default PopupMap;
