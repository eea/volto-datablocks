import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import Image from '@plone/volto/components/theme/Image/Image';
import PreviewImage from '@eeacms/volto-listing-block/PreviewImage';

import countryNames from './data/countries';
import withQuerystringResults from './withQuerystringResults';

import './styles.less';

const MaybeDropdown = ({ children, countries, value, dropdown = false }) => {
  const history = useHistory();

  const options = React.useMemo(() => {
    return countries.map((c, index) => ({
      key: c['@id'] || c.url || c.UID || index,
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
    exclude,
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
        `./data/svg/${code}.svg`
      ).then((module) => {
        setFlag(module.default);
      });
    }
  }, [countryCode]);

  const { listingItems, hasLoaded } = props;

  const excludedUIDs = React.useMemo(
    () =>
      new Set(
        (exclude || []).map((item) => item.UID || flattenToAppURL(item['@id'])),
      ),
    [exclude],
  );

  const countries = React.useMemo(() => {
    const items =
      listingItems && listingItems.length > 0
        ? listingItems
        : hasLoaded
          ? siblings.filter((s) => s.title !== pageTitle)
          : [];
    return excludedUIDs.size > 0
      ? items.filter(
          (item) => !excludedUIDs.has(item.UID || flattenToAppURL(item['@id'])),
        )
      : items;
  }, [listingItems, hasLoaded, siblings, pageTitle, excludedUIDs]);

  const countryFlag =
    (countryCode && show_flag && flag && (
      <Image alt={countryNames[countryCode]} src={flag} />
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
