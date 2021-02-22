/* eslint-disable */
import React from 'react';
import countryNames from './data/countries';
import './styles.less';

const CountryFlagView = ({ data = {} }) => {
  const { country_name, render_as, show_name, show_flag } = data;
  const Tag = render_as ? render_as.toLowerCase() : 'h2';
  const [flag, setFlag] = React.useState();
  React.useEffect(() => {
    if (country_name) {
      const code = country_name.toLowerCase();
      import(
        /* webpackChunkName: "flags" */
        /* webpackMode: "lazy" */
        /* webpackExports: ["default", "named"] */

        `./data/svg/${code}.svg`
      ).then((module) => {
        setFlag(module.default);
      });
    }
  });
  return (
    <div className="country-flag">
      {!country_name ? (
        'no country'
      ) : show_flag && flag ? (
        <img alt={countryNames[country_name]} src={flag} />
      ) : (
        ''
      )}
      {country_name && show_name ? <Tag>{countryNames[country_name]}</Tag> : ''}
    </div>
  );
};
export default CountryFlagView;
