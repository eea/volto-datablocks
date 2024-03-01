import { useHistory } from 'react-router-dom';
import React from 'react';
import countryNames from './data/countries';
import './styles.less';
import { Dropdown } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';

const MaybeDropdown = ({ children, countries, value, dropdown = false }) => {
  const history = useHistory();

  if (!countries || !dropdown) {
    return children;
  }

  const options = countries.map((c) => ({ text: c.title, value: c['@id'] }));

  return (
    <Dropdown
      selection
      className="countries-dd"
      text={children}
      options={options}
      defaultValue={value}
      icon="angle down"
      onChange={(_, { value }) => {
        const url = flattenToAppURL(value);
        history.push(url);
      }}
    />
  );
};

const CountryFlagView = ({ data = {}, metadata, properties }) => {
  const {
    country_name: countryCode,
    render_as,
    show_name,
    show_flag,
    show_dropdown,
  } = data;
  const Tag = render_as ? render_as.toLowerCase() : 'h2';
  const [flag, setFlag] = React.useState();
  const contentdata = metadata || properties;
  const siblings = contentdata?.['@components']?.siblings?.items || [];

  React.useEffect(() => {
    if (countryCode) {
      const code = countryCode.toLowerCase();
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
  const countryTitles = Object.values(countryNames);

  // TODO: we might as well use the Title everywhere, since we use it for the siblings
  const countries = siblings.filter((f) => countryTitles.includes(f.title));

  const countryFlag =
    (countryCode && show_flag && flag && (
      <img alt={countryNames[countryCode]} src={flag} />
    )) ||
    'no country';

  return (
    <div className="country-flag">
      {countryFlag}
      {countryCode && show_name && (
        <Tag>
          <MaybeDropdown
            dropdown={show_dropdown}
            countries={countries}
            value={countryNames[countryCode]}
          >
            {countryNames[countryCode]}
          </MaybeDropdown>
        </Tag>
      )}
    </div>
  );
};

export default CountryFlagView;
