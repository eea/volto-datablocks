import config from '@plone/volto/registry';
import worldSVG from '@plone/volto/icons/world.svg';
import { getConnectedDataParametersForRoute } from 'volto-datablocks/helpers';
import View from './View';
import Edit from './Edit';

export function getMatchParams(match) {
  if (!match || !match.params) return {};
  return Object.keys(match.params)
    .filter((key) => isNaN(key))
    .reduce((obj, key) => {
      obj[key] = match.params[key];
      if (config.settings.ignoreRouteParams.includes(match.params[key])) {
        obj[key] = 'NULL';
      }
      return obj;
    }, {});
}

export function getRouteParameterValue(value, defaultValue) {
  if (config.settings.ignoreRouteParams.includes(value)) {
    return defaultValue || 'NULL';
  }
  return value || defaultValue || 'NULL';
}

export function getRouteParameters(providerUrl, dataParameters, match) {
  const connectedDataParameters = getConnectedDataParametersForRoute(
    dataParameters,
    providerUrl,
  );
  const parameters = { ...getMatchParams(match) };
  if (connectedDataParameters?.length) {
    connectedDataParameters.forEach((parameter) => {
      parameters[parameter.i] = parameter.v[0];
    });
  }

  return parameters || {};
}

export default (config) => {
  config.blocks.blocksConfig.routeParameter = {
    id: 'routeParameter',
    title: 'Route parameter',
    icon: worldSVG,
    group: 'data_blocks',
    view: View,
    edit: Edit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};
