import paintSVG from '@plone/volto/icons/table.svg';
import CountryFlagEdit from './Edit';
import CountryFlagView from './View';

export default (config) => {
  config.blocks.blocksConfig.countryFlag = {
    id: 'countryFlag',
    title: 'Country Flag',
    icon: paintSVG,
    group: 'custom_addons',
    view: CountryFlagView,
    edit: CountryFlagEdit,
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
