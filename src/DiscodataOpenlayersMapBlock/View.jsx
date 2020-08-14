/* REACT */
import React, { useState, useRef, useEffect } from 'react';
import { Grid, Dropdown, Radio } from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
// HELPERS
import qs from 'query-string';
import jsonp from 'jsonp';
// VOLTO
import { Icon as VoltoIcon } from '@plone/volto/components';
// VOLTO-DATABLOCKS
import { setQueryParam } from 'volto-datablocks/actions';
// SVGs
import clearSVG from '@plone/volto/icons/clear.svg';
import pinSVG from '~/icons/pin.svg';
// STYLES
import 'ol/ol.css';
import './style.css';

const getHtmlAttributes = obj => {
  return Object.entries(obj)
    .map(([key, value]) => {
      return `${key}="${value}"`;
    })
    .join(' ');
};

const encodedPinSVG = encodeURIComponent(
  `<svg ${getHtmlAttributes(pinSVG.attributes)}>${pinSVG.content}</svg>`,
);

let Map,
  View,
  Overlay,
  EsriJSON,
  VectorSource,
  XYZ,
  fromLonLat,
  createXYZ,
  CircleStyle,
  Fill,
  Stroke,
  Style,
  Icon,
  TileLayer,
  VectorLayer,
  Group,
  tile;
let OL_LOADED = false;
const OpenlayersMapView = props => {
  const stateRef = useRef({
    popup: {},
    popupDetails: {},
  });
  const [state, setState] = useState({
    popup: {},
    popupDetails: {},
  });
  const { query } = qs.parse(props.query);
  const { search } = props.discodata_query;
  const globalQuery = { ...query, ...search };
  const draggable = props.data?.draggable?.value;
  const queryParameters = props.data?.query_parameters?.value
    ? JSON.parse(props.data.query_parameters.value).properties
    : {};

  useEffect(() => {
    if (__CLIENT__ && document) {
      // MOuNT
      if (!OL_LOADED) {
        Map = require('ol/Map').default;
        View = require('ol/View').default;
        Overlay = require('ol/Overlay').default;
        EsriJSON = require('ol/format/EsriJSON').default;
        VectorSource = require('ol/source/Vector').default;
        XYZ = require('ol/source/XYZ').default;
        fromLonLat = require('ol/proj').fromLonLat;
        createXYZ = require('ol/tilegrid').createXYZ;
        CircleStyle = require('ol/style/Circle.js').default;
        Fill = require('ol/style/Fill.js').default;
        Stroke = require('ol/style/Stroke.js').default;
        Style = require('ol/style/Style.js').default;
        Icon = require('ol/style/Icon.js').default;
        TileLayer = require('ol/layer/Tile.js').default;
        VectorLayer = require('ol/layer/Vector.js').default;
        Group = require('ol/layer/Group.js').default;
        tile = require('ol/loadingstrategy').tile;
        OL_LOADED = true;
      }
      renderMap({ draggable, queryParameters });
    }
    return () => {
      // UNMOUNT
    };
    /* eslint-disable-next-line */
  }, [])

  useEffect(() => {
    if (__CLIENT__ && document) {
      renderMap({ draggable, queryParameters });
    }
    /* eslint-disable-next-line */
  }, [props.discodata_query.search])

  useEffect(() => {
    stateRef.current = { ...state };
    /* eslint-disable-next-line */
  }, [JSON.stringify(state)])

  function renderMap() {
    if (
      document.getElementById('map') &&
      document.getElementById(`popup`) &&
      document.getElementById(`popup-details`)
    ) {
      //  Popup element
      const popupElement = document.getElementById(`popup`);
      const popupDetailsElement = document.getElementById(`popup-details`);
      //  Clear map content on every cycle
      document.getElementById('map').innerHTML = '';
      // Main map
      const map = new Map({
        target: document.getElementById('map'),
        view: new View({
          center: fromLonLat([20, 50]),
          zoom: 4.5,
        }),
      });
      // Basemaps Layers
      const worldLightGrayBase = new TileLayer({
        source: new XYZ({
          url:
            'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        }),
        visible: true,
        title: 'World_Light_Gray_Base',
      });
      const worldHillshade = new TileLayer({
        source: new XYZ({
          url:
            'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
        }),
        visible: false,
        title: 'World_Hillshade',
      });
      // Base Layer Group
      const baseLayerGroup = new Group({
        layers: [worldLightGrayBase, worldHillshade],
      });
      // Create an overlay to anchor the popups to the map.
      const popup = new Overlay({
        element: popupElement,
        positioning: 'bottom-center',
        stopEvent: false,
      });
      const popupDetails = new Overlay({
        element: popupDetailsElement,
        positioning: 'bottom-center',
        stopEvent: false,
      });
      // Add layers to map
      map.addOverlay(popup);
      map.addOverlay(popupDetails);
      map.addLayer(baseLayerGroup);
      // Layer Switcher logic for Basemaps
      const baseLayerElements = document.querySelectorAll(
        '.sidebar > input[type=radio]',
      );
      for (let baseLayerElement of baseLayerElements) {
        baseLayerElement.addEventListener('change', function() {
          let baseLayerElementValue = this.value;
          baseLayerGroup.getLayers().forEach(function(element, index, array) {
            let baseLayerTitle = element.get('title');
            element.setVisible(baseLayerTitle === baseLayerElementValue);
          });
        });
      }

      // Vector Layers
      var esrijsonFormat = new EsriJSON();

      // ly_IED_SiteMap_WM
      const filterIEDSiteMapWM = { where: '' };
      const vectorSourceIEDSiteMapWM = new VectorSource({
        loader: function(extent, resolution, projection) {
          var url =
            'https://services.arcgis.com/LcQjj2sL7Txk9Lag/arcgis/rest/services/ly_IED_SiteMap_WM/FeatureServer/0/query/?f=json&' +
            'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
            encodeURIComponent(
              '{"xmin":' +
                extent[0] +
                ',"ymin":' +
                extent[1] +
                ',"xmax":' +
                extent[2] +
                ',"ymax":' +
                extent[3] +
                ',"spatialReference":{"wkid":102100}}',
            ) +
            '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
            '&outSR=102100';
          jsonp(url, { ...filterIEDSiteMapWM }, (error, response) => {
            if (error) {
              console.log(error.message);
            } else {
              var features = esrijsonFormat.readFeatures(response, {
                featureProjection: projection,
              });
              if (features.length > 0) {
                vectorSourceIEDSiteMapWM.addFeatures(features);
              }
            }
          });
        },
        strategy: tile(
          createXYZ({
            tileSize: 512,
          }),
        ),
      });

      const lyIEDSiteMapWM = new VectorLayer({
        source: vectorSourceIEDSiteMapWM,
        style: new Style({
          image: new Icon({
            opacity: 1,
            src: `data:image/svg+xml;utf8,${encodedPinSVG}`,
            size: [100, 100],
            scale: 1,
          }),
        }),
        visible: true,
        title: 'ly_IED_SiteMap_WM',
      });

      // IED_SiteClusters_WM
      const vectorSourceIEDSiteClustersWM = new VectorSource({
        loader: function(extent, resolution, projection) {
          var url =
            'https://services.arcgis.com/LcQjj2sL7Txk9Lag/ArcGIS/rest/services/ly_IED_SiteClusters_WM/FeatureServer/0/query/?f=json' +
            '&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
            encodeURIComponent(
              '{"xmin":' +
                extent[0] +
                ',"ymin":' +
                extent[1] +
                ',"xmax":' +
                extent[2] +
                ',"ymax":' +
                extent[3] +
                ',"spatialReference":{"wkid":102100}}',
            ) +
            '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
            '&outSR=102100';
          jsonp(url, null, (error, response) => {
            if (error) {
              console.log(error.message);
            } else {
              var features = esrijsonFormat.readFeatures(response, {
                featureProjection: projection,
              });
              if (features.length > 0) {
                vectorSourceIEDSiteClustersWM.addFeatures(features);
              }
            }
          });
        },
        strategy: tile(
          createXYZ({
            tileSize: 512,
          }),
        ),
      });

      const lyIEDSiteClustersWM = new VectorLayer({
        source: vectorSourceIEDSiteClustersWM,
        style: new Style({
          image: new Icon({
            opacity: 1,
            src: `data:image/svg+xml;utf8,${encodedPinSVG}`,
            size: [100, 100],
            scale: 1,
          }),
        }),
        visible: true,
        title: 'ly_IED_SiteClusters_WM',
      });

      // Vector Layer Group
      const vectorLayerGroup = new Group({
        layers: [lyIEDSiteMapWM, lyIEDSiteClustersWM],
      });
      map.addLayer(vectorLayerGroup);

      // Auto center by client location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(centerPosition);
      }

      function centerPosition(position) {
        map
          .getView()
          .setCenter(
            fromLonLat([position.coords.longitude, position.coords.latitude]),
          );
        map.getView().setZoom(12);
      }

      // Identify logic
      function setFeatureInfo(pixel, detailed) {
        let features = [];
        map.forEachFeatureAtPixel(pixel, function(feature) {
          features.push(feature);
        });
        if (features.length > 0) {
          const featuresProperties = features[0].getProperties();
          if (
            detailed &&
            JSON.stringify(stateRef.current.popupDetails) !==
              JSON.stringify(featuresProperties)
          ) {
            setState({
              ...stateRef.current,
              popupDetails: { ...featuresProperties },
            });
          } else if (
            !detailed &&
            JSON.stringify(stateRef.current.popup) !==
              JSON.stringify(featuresProperties)
          ) {
            setState({
              ...stateRef.current,
              popup: { ...featuresProperties },
            });
          }
          return true;
        }
        return false;
      }

      const displayPopup = function(
        pixel,
        coordinate,
        popup,
        detailed = false,
      ) {
        if (setFeatureInfo(pixel, detailed)) {
          map.getTarget().style.cursor = 'pointer';
          popup.setPosition(coordinate);
        } else {
          map.getTarget().style.cursor = '';
          popup.setPosition(undefined);
        }
      };

      map.on('pointermove', function(evt) {
        if (evt.dragging) {
          return;
        }
        const pixel = map.getEventPixel(evt.originalEvent);
        displayPopup(pixel, evt.coordinate, popup);
      });

      map.on('click', function(evt) {
        displayPopup(evt.pixel, evt.coordinate, popupDetails, true);
      });
      // zoom-in out layer switching logic
      let currZoom = map.getView().getZoom();
      map.on('moveend', function(e) {
        let newZoom = map.getView().getZoom();
        if (currZoom !== newZoom) {
          if (newZoom > 8) {
            lyIEDSiteMapWM.setVisible(true);
            lyIEDSiteClustersWM.setVisible(false);
          } else {
            lyIEDSiteMapWM.setVisible(false);
            lyIEDSiteClustersWM.setVisible(true);
          }
          currZoom = newZoom;
        }
      });
    }
  }

  return (
    <React.Fragment>
      <div id="map" className="map" />
      <div id="popup" className="popup">
        {state.popup.sitename && (
          <div>
            <p>{state.popup.sitename}</p>
          </div>
        )}
      </div>
      <div id="popup-details" className="popup">
        {state.popupDetails.sitename && (
          <div>
            <p>{state.popupDetails.sitename}</p>
          </div>
        )}
      </div>
      {/* <div id="popup-ceva" className="popup">
        {popupState.properties && (
          <div className="map-modal">
            <div className="modal-header">
              <p className="modal-title">Parent company name</p>
              <VoltoIcon
                onClick={() => console.log('CLOSE')}
                color="red"
                name={clearSVG}
                size="2em"
              />
            </div>
            <p className="modal-label">Chemical industry</p>
            <p style={{ marginBottom: '5px', borderBottom: '1px solid grey' }}>
              Address 1, Address 2
            </p>

            <Grid.Column stretched>
              <Grid.Row>
                <p className="modal-label">Site Contents</p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {mapModal.facilityContents &&
                    mapModal.facilityContents.map(content => (
                      <a className="details-link" href={content.url}>
                        {content.title}
                      </a>
                    ))}
                </div>
              </Grid.Row>
              <Grid.Row>
                <p className="modal-label">Pollutant emissions</p>
                {mapModal.pollutantEmissions &&
                  mapModal.pollutantEmissions.map(pollutants => (
                    <p className="details-content">{pollutants}</p>
                  ))}
                <a className="details-link" href={'google.com'}>
                  15 more...
                </a>
              </Grid.Row>
              <Grid.Row>
                <p className="modal-label">Regulatory information</p>
                <p className="details-content">
                  Operating since:{' '}
                  {mapModal.regulatoryInformation.operatingSince}
                </p>
                <p className="details-content">
                  Last operating permit issued:{' '}
                  {mapModal.regulatoryInformation.lastPermit}
                </p>
                <p className="details-content">
                  Last inspection:{' '}
                  {mapModal.regulatoryInformation.lastInspection}
                </p>
                <a className="details-link" href={'google.com'}>
                  Find out more
                </a>
              </Grid.Row>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="details-button"> VIEW SITE DETAIL </button>
              </div>
            </Grid.Column>
          </div>
        )}
      </div> */}
    </React.Fragment>
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: state.router.location.search,
      content:
        state.prefetch?.[state.router.location.pathname] || state.content.data,
      discodata_query: state.discodata_query,
    }),
    {
      setQueryParam,
    },
  ),
)(OpenlayersMapView);
