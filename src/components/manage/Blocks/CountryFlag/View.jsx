import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

import { flattenToAppURL } from '@plone/volto/helpers';
import PreviewImage from '@eeacms/volto-listing-block/PreviewImage';

import countryNames from './data/countries';
import withQuerystringResults from './withQuerystringResults';

import './styles.less';

const MaybeDropdown = ({ children, countries, value, dropdown = false }) => {
  const history = useHistory();

  const options = React.useMemo(() => {
    return countries.map((c) => ({
      text: c.title || c.name,
      value: c['@id'] || c.url,
    }));
  }, [countries]);
  // const defaultValue = countries.filter((c) => c.title === value);

  if (!countries || !dropdown) {
    return children ?? null;
  }

  // because the value is not actually passed down to the dropdown component, it behaves in strange way. The solution is to only handle click events

  return (
    <Dropdown
      fluid
      selection
      className="countries-dd"
      text={children}
      options={options}
      // defaultValue={defaultValue.length > 0 ? defaultValue[0]['@id'] : null}
      icon="angle down"
      onChange={(event, data) => {
        if (event.type !== 'click') return;
        const { value } = data;
        const url = flattenToAppURL(value);
        history.push(url);
      }}
    />
  );
};

export const CountryFlagView = (props) => {
  const {
    country_name: countryCode,
    render_as,
    show_name,
    show_flag,
    show_dropdown,
  } = props.data;

  const Tag = render_as ? render_as.toLowerCase() : 'h2';
  const contentData = props.metadata || props.properties;
  const siblingItems = contentData?.['@components']?.siblings?.items;

  const siblings = React.useMemo(() => siblingItems || [], [siblingItems]);
  const pageTitle = contentData?.title;
  const previewImageUrl = contentData
    ? `${contentData['@id']}/@@images/preview_image/thumb`
    : '';

  const [flag, setFlag] = React.useState();

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
  }, [countryCode]);

  // TODO: we might as well use the Title everywhere, since we use it for the siblings
  // const countries = siblings.filter((f) => countryTitles.includes(f.title));
  const { listingItems } = props;

  const countries = React.useMemo(() => {
    return listingItems && listingItems.length > 0
      ? listingItems
      : siblings.filter((s) => s.title !== pageTitle);
  }, [listingItems, pageTitle, siblings]);

  const countryFlag =
    (countryCode && show_flag && flag && (
      <img alt={countryNames[countryCode]} src={flag} />
    )) ||
    (contentData?.preview_image ? (
      <PreviewImage item={contentData} preview_image_url={previewImageUrl} />
    ) : (
      ''
    ));

  const displayName =
    (countryCode && show_name && countryNames[countryCode]) || pageTitle;

  return (
    <div className="country-flag">
      {countryFlag}

      <Tag>
        <MaybeDropdown
          dropdown={show_dropdown}
          countries={countries}
          value={displayName}
        >
          {displayName}
        </MaybeDropdown>
      </Tag>
    </div>
  );
};

export default withQuerystringResults(CountryFlagView);
