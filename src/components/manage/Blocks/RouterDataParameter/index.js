import { settings } from '~/config';
import worldSVG from '@plone/volto/icons/world.svg';
import View from './View';
import Edit from './Edit';

export function getMatchParams(match) {
  if (!match || !match.params) return {};
  return Object.keys(match.params)
    .filter((key) => isNaN(key))
    .reduce((obj, key) => {
      obj[key] = match.params[key];
      if (settings.ignoreRouterParams.includes(match.params[key])) {
        obj[key] = 'NULL';
      }
      return obj;
    }, {});
}

export function getRouterParameterValue(value, defaultValue) {
  if (settings.ignoreRouterParams.includes(value)) {
    return defaultValue || 'NULL';
  }
  return value || defaultValue || 'NULL';
}

export default (config) => {
  config.blocks.blocksConfig.routerDataParameter = {
    id: 'routerDataParameter',
    title: 'Router data parameter',
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
