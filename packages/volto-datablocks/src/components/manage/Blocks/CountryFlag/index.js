import paintSVG from '@plone/volto/icons/table.svg';
import CountryFlagEdit from './Edit';
import CountryFlagView from './View';

const config = (config) => {
  config.blocks.blocksConfig.countryFlag = {
    id: 'countryFlag',
    title: 'Country Flag',
    icon: paintSVG,
    group: 'common',
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

export default config;
