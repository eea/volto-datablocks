/* REACT */
import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// HELPERS
import qs from 'query-string';
import jsonp from 'jsonp';
// VOLTO
import { Icon as VoltoIcon } from '@plone/volto/components';
// VOLTO-DATABLOCKS
import { setQueryParam } from 'volto-datablocks/actions';
// SEMANTIC REACT UI
import { Grid, Dropdown, Radio, Header } from 'semantic-ui-react';
// SVGs
import clearSVG from '@plone/volto/icons/clear.svg';
import pinSVG from '~/icons/pin.svg';
import bluePinSVG from '~/icons/blue_pin.svg';
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

const encodedBluePinSVG = encodeURIComponent(
  `<svg ${getHtmlAttributes(bluePinSVG.attributes)}>${
    bluePinSVG.content
  }</svg>`,
);

let Map,
  View,
  Overlay,
  EsriJSON,
  VectorSource,
  XYZ,
  fromLonLat,
  toLonLat,
  toStringHDMS,
  createXYZ,
  CircleStyle,
  Fill,
  Stroke,
  Style,
  Icon,
  TileLayer,
  VectorLayer,
  Group,
  tile,
  Control,
  defaultsControls;
let OL_LOADED = false;
const OpenlayersMapView = props => {
  const stateRef = useRef({
    map: { element: null },
    popup: { element: null, properties: {} },
    popupDetails: { element: null, properties: {} },
  });
  const [state, setState] = useState({
    map: { element: null },
    popup: { element: null, properties: {} },
    popupDetails: { element: null, properties: {} },
  });
  const [mapRendered, setMapRendered] = useState(false);
  const ToggleSidebarControl = useRef(null);
  // const [ToggleSidebarControl, setToggleSidebarControl] = useState(null);
  const history = useHistory();
  const { query } = qs.parse(props.query);
  const { search } = props.discodata_query;
  const globalQuery = { ...query, ...search };
  const draggable = props.data?.draggable?.value;
  const queryParameters = props.data?.query_parameters?.value
    ? JSON.parse(props.data.query_parameters.value).properties
    : {};
  const zoomSwitch = 8;
  const currentMapZoom = state.map.element
    ? state.map.element.getView().getZoom()
    : null;
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
        toLonLat = require('ol/proj').toLonLat;
        toStringHDMS = require('ol/coordinate').toStringHDMS;
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
        Control = require('ol/control/Control.js').default;
        defaultsControls = require('ol/control.js').defaults;
        OL_LOADED = true;
      }
      if (OL_LOADED && !ToggleSidebarControl.current) {
        ToggleSidebarControl.current = /*@__PURE__*/ (function(Control) {
          function ToggleSidebarControl(opt_options) {
            const options = opt_options || {};
            const buttonContainer = document.getElementById(
              'dynamic-filter-toggle',
            );
            Control.call(this, {
              element: buttonContainer,
              target: options.target,
            });
          }
          if (Control) ToggleSidebarControl.__proto__ = Control;
          ToggleSidebarControl.prototype = Object.create(
            Control && Control.prototype,
          );
          ToggleSidebarControl.prototype.constructor = ToggleSidebarControl;

          return ToggleSidebarControl;
        })(Control);
      }
      renderMap({ draggable, queryParameters });
      setMapRendered(true);
    }
    return () => {
      // UNMOUNT
    };
    /* eslint-disable-next-line */
  }, [])

  useEffect(() => {
    if (mapRendered) {
      console.log('UPDATE MAP');


      //
      // // Filter logic
      //
      // document.getElementById("filterBtn").addEventListener('click', function () {
      //   filterIEDSiteMapWM['where'] = "";
      //
      //   //reporting year
      //   var year = document.getElementById("years").value;
      //   if (year) {
      //     filterIEDSiteMapWM['where'] += "(rep_yr = '" + year + "')";
      //   }
      //
      //   //industries
      //   var industry = document.getElementById("industries").value;
      //   if (industry) {
      //     if (filterIEDSiteMapWM['where']) {
      //       filterIEDSiteMapWM['where'] += " AND (industries = '" + industry + "')";
      //     } else {
      //       filterIEDSiteMapWM['where'] += "(industries = '" + industry + "')";
      //     }
      //   }
      //
      //   //countries
      //   var country = document.getElementById("countries").value;
      //   if (country) {
      //     if (filterIEDSiteMapWM['where']) {
      //       filterIEDSiteMapWM['where'] += " AND (country = '" + country + "')";
      //     } else {
      //       filterIEDSiteMapWM['where'] += "(country = '" + country + "')";
      //     }
      //   }
      //
      //   //regions
      //   var region = document.getElementById("regions").value;
      //   if (region) {
      //     if (filterIEDSiteMapWM['where']) {
      //       filterIEDSiteMapWM['where'] += " AND (region = '" + region + "')";
      //     } else {
      //       filterIEDSiteMapWM['where'] += "(region = '" + region + "')";
      //     }
      //   }
      //
      //   //river basin districts
      //   var riverBasinDistrict = document.getElementById("riverBasinDistricts").value;
      //   if (riverBasinDistrict) {
      //     if (filterIEDSiteMapWM['where']) {
      //       filterIEDSiteMapWM['where'] += " AND (riverBasinDistrict = '" + riverBasinDistrict + "')";
      //     } else {
      //       filterIEDSiteMapWM['where'] += "(riverBasinDistrict = '" + riverBasinDistrict + "')";
      //     }
      //   }
      //
      //   //Towns/Villages
      //   var townVillage = document.getElementById("townsVillages").value;
      //   if (townVillage) {
      //     if (filterIEDSiteMapWM['where']) {
      //       filterIEDSiteMapWM['where'] += " AND (townVillage = '" + townVillage + "')";
      //     } else {
      //       filterIEDSiteMapWM['where'] += "(townVillage = '" + townVillage + "')";
      //     }
      //   }
      //
      //   //Pollutant groups
      //   var pollutantGroup = document.getElementById("pollutantGroups").value;
      //   if (pollutantGroup) {
      //     if (filterIEDSiteMapWM['where']) {
      //       filterIEDSiteMapWM['where'] += "AND (pollutantGroup = '" + pollutantGroup + "')";
      //     } else {
      //       filterIEDSiteMapWM['where'] += "(pollutantGroup = '" + pollutantGroup + "')";
      //     }
      //   }
      //
      //   //Pollutants
      //   var pollutant = document.getElementById("pollutants").value;
      //   if (pollutant) {
      //     if (filterIEDSiteMapWM['where']) {
      //       filterIEDSiteMapWM['where'] += " AND (pollutants = '" + pollutant + "')";
      //     } else {
      //       filterIEDSiteMapWM['where'] += "(pollutants = '" + pollutant + "')";
      //     }
      //   }
      //
      //   //BAT Conclusions
      //   var batConclusion = document.getElementById("batConclusions").value;
      //   if (batConclusion) {
      //     if (filterIEDSiteMapWM['where']) {
      //       filterIEDSiteMapWM['where'] += " AND (batConclusion = '" + batConclusion + "')";
      //     } else {
      //       filterIEDSiteMapWM['where'] += "(batConclusion = '" + batConclusion + "')";
      //     }
      //   }
      //
      //   lyIEDSiteMapWM.getSource().refresh();
      // });



    }
    /* eslint-disable-next-line */
  }, [
    JSON.stringify(props.discodata_query.search.siteTerm),
    JSON.stringify(props.discodata_query.search.locationTerm),
    JSON.stringify(props.discodata_query.search.batConclusionCode),
    JSON.stringify(props.discodata_query.search.eprtrSectorName),
    JSON.stringify(props.discodata_query.search.pollutant),
    JSON.stringify(props.discodata_query.search.pollutantGroup),
    JSON.stringify(props.discodata_query.search.region),
    JSON.stringify(props.discodata_query.search.reportingYear),
    JSON.stringify(props.discodata_query.search.riverBasin),
    JSON.stringify(props.discodata_query.search.siteCountry),
    JSON.stringify(props.discodata_query.search.townVillage),
  ]);

  useEffect(() => {
    stateRef.current = { ...state };
    /* eslint-disable-next-line */
  }, [state])

  function renderMap() {
    if (
      document.getElementById('map') &&
      document.getElementById(`popup`) &&
      document.getElementById(`popup-details`) &&
      document.getElementById(`dynamic-filter`)
    ) {
      //  Popup element
      const popupElement = document.getElementById(`popup`);
      const popupDetailsElement = document.getElementById(`popup-details`);
      const dynamicFilterElement = document.getElementById(`dynamic-filter`);
      console.log('RENDER', ToggleSidebarControl.current);
      //  Clear map content on every cycle
      document.getElementById('map').innerHTML = '';
      // Main map
      const map = new Map({
        controls: defaultsControls().extend([
          new ToggleSidebarControl.current(),
        ]),
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
        positioning: 'center-center',
        stopEvent: false,
      });
      const popupDetails = new Overlay({
        element: popupDetailsElement,
        className: 'ol-popup-details',
        positioning: 'center-center',
        stopEvent: false,
      });
      const dynamicFilter = new Overlay({
        element: dynamicFilterElement,
        className: 'ol-dynamic-filter',
        positioning: 'center-center',
        stopEvent: false,
      });
      setState({
        map: {
          ...stateRef.current.map,
          element: map,
        },
        popup: {
          ...stateRef.current.popup,
          element: popup,
        },
        popupDetails: {
          ...stateRef.current.popupDetails,
          element: popupDetails,
        },
      });
      // Add layers to map
      map.addOverlay(popup);
      map.addOverlay(popupDetails);
      map.addOverlay(dynamicFilter);
      map.addLayer(baseLayerGroup);
      dynamicFilter.setPosition([0, 0]);

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
            src: `data:image/svg+xml;utf8,${encodedPinSVG}`,
            anchor: [0.5, 17],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
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
            src: `data:image/svg+xml;utf8,${encodedBluePinSVG}`,
            anchor: [0.5, 17],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
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
      function setFeatureInfo(pixel, coordinate, detailed) {
        let features = [];
        map.forEachFeatureAtPixel(pixel, function(feature) {
          features.push(feature);
        });
        if (features.length) {
          let hdms = toStringHDMS(
            toLonLat(features[0].getGeometry().flatCoordinates),
          );
          const featuresProperties = features[0].getProperties();
          if (
            detailed &&
            JSON.stringify(stateRef.current.popupDetails.properties) !==
              JSON.stringify(featuresProperties)
          ) {
            setState({
              ...stateRef.current,
              popupDetails: {
                ...stateRef.current.popupDetails,
                properties: { ...featuresProperties, hdms },
              },
            });
          } else if (
            !detailed &&
            JSON.stringify(stateRef.current.popup.properties) !==
              JSON.stringify(featuresProperties)
          ) {
            setState({
              ...stateRef.current,
              popup: {
                ...stateRef.current.popup,
                properties: { ...featuresProperties, hdms },
              },
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
        if (setFeatureInfo(pixel, coordinate, detailed)) {
          map.getTarget().style.cursor = 'pointer';
          popup.setPosition(coordinate);
        } else {
          map.getTarget().style.cursor = '';
          if (!detailed) {
            popup.setPosition(undefined);
          }
        }
      };

      map.on('pointermove', function(evt) {
        if (evt.dragging) {
          return;
        }
        const pixel = map.getEventPixel(evt.originalEvent);
        displayPopup(pixel, evt.coordinate, popup);
      });

      let currZoom = map.getView().getZoom();
      map.on('click', function(evt) {
        let newZoom = map.getView().getZoom();
        if (newZoom > zoomSwitch) {
          displayPopup(evt.pixel, evt.coordinate, popupDetails, true);
        }
      });
      map.on('moveend', function(e) {
        let newZoom = map.getView().getZoom();
        if (currZoom !== newZoom) {
          if (newZoom > zoomSwitch) {
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

  const setSiteQueryParams = () => {
    setQueryParam({
      queryParam: {
        siteInspireId: state.popupDetails.properties.sitename,
        reportingYear: state.popupDetails.properties.rep_yr,
      },
    });
  };

  return (
    <React.Fragment>
      <div id="map" className="map" />
      <div id="popup" className="popup">
        {state.popup.element && (
          <>
            <div className="popover-header">
              {currentMapZoom && currentMapZoom > zoomSwitch ? (
                <Header as="h3">{state.popup.properties.sitename}</Header>
              ) : (
                <Header as="h3">{`${state.popup.properties.NUTS_NAME}, ${
                  state.popup.properties.CNTR_CODE
                }, ${state.popup.properties.COUNTRY}`}</Header>
              )}
            </div>
            <div className="popover-body">
              <Grid.Column stretched>
                {currentMapZoom && currentMapZoom > zoomSwitch ? (
                  ''
                ) : (
                  <Grid.Row>
                    <p>
                      Number of sites:{' '}
                      <code>{state.popup.properties.num_sites}</code>
                    </p>
                  </Grid.Row>
                )}
                {/* HDMS */}
                <Grid.Row>
                  {state.popup.properties.hdms ? (
                    <>
                      <p className="mb-1">The location you are viewing is:</p>
                      <code>{state.popup.properties.hdms}</code>
                    </>
                  ) : (
                    ''
                  )}
                </Grid.Row>
              </Grid.Column>
            </div>
          </>
        )}
      </div>
      <div id="popup-details" className="popup">
        {state.popupDetails.element && (
          <>
            <div className="popover-header">
              <Header as="h2">
                {state.popupDetails.properties.sitename
                  ? state.popupDetails.properties.sitename
                  : ''}
              </Header>
              <VoltoIcon
                onClick={() =>
                  state.popupDetails.element.setPosition(undefined)
                }
                name={clearSVG}
                size="2em"
              />
            </div>
            <div className="popover-body">
              <Grid.Column stretched>
                {/* SITE CONTENTS */}
                <Grid.Row>
                  <Header as="h3">Site contents</Header>
                  <p>
                    <Link
                      onClick={setSiteQueryParams}
                      to={'/industrial-site/introduction'}
                    >
                      {state.popupDetails.properties.n_fac || 0} Facilities
                    </Link>
                  </p>
                  <p>
                    <Link
                      onClick={setSiteQueryParams}
                      to={'/industrial-site/introduction'}
                    >
                      {state.popupDetails.properties.n_lcp || 0} Large comustion
                      plants
                    </Link>
                  </p>
                  <p>
                    <Link
                      onClick={setSiteQueryParams}
                      to={'/industrial-site/introduction'}
                    >
                      {state.popupDetails.properties.n_inst || 0} Installations
                    </Link>
                  </p>
                </Grid.Row>
                {/* SITE POLLUTANT EMISSIONS */}
                <Grid.Row>
                  <Header as="h3">Pollutant emissions</Header>
                  {state.popupDetails.properties.pollutants ? (
                    <p>{state.popupDetails.properties.pollutants}</p>
                  ) : (
                    <p>There are no data regarding the pollutants</p>
                  )}
                </Grid.Row>
                {/* REGULATORY INFORMATION */}
                <Grid.Row>
                  <Header as="h3">Regulatory information</Header>
                  {state.popupDetails.properties.rep_yr ? (
                    <p>
                      Inspections in {state.popupDetails.properties.rep_yr}:{' '}
                      {state.popupDetails.properties.n_inspect || 0}
                    </p>
                  ) : (
                    ''
                  )}
                </Grid.Row>
              </Grid.Column>
            </div>
            <div className="popover-actions">
              <button
                onClick={() => {
                  setSiteQueryParams();
                  history.push('/industrial-site/introduction');
                }}
                className="solid dark-blue"
              >
                VIEW SITE DETAIL
              </button>
            </div>
          </>
        )}
      </div>
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
