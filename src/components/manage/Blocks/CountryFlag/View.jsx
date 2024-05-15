import { useHistory } from 'react-router-dom';
import React from 'react';
import countryNames from './data/countries';
import './styles.less';
import { Dropdown } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import PreviewImage from '@eeacms/volto-listing-block/PreviewImage';
import withQuerystringResults from './withQuerystringResults';

const MaybeDropdown = ({ children, countries, value, dropdown = false }) => {
  const history = useHistory();
  if (!countries || !dropdown) {
    return children;
  }

  const options = countries.map((c) => ({ text: c.title, value: c['@id'] }));
  // const defaultValue = countries.filter((c) => c.title === value);

  return (
    <Dropdown
      fluid
      selection
      className="countries-dd"
      text={children}
      options={options}
      // defaultValue={defaultValue.length > 0 ? defaultValue[0]['@id'] : null}
      icon="angle down"
      onChange={(_, { value }) => {
        const url = flattenToAppURL(value);
        history.push(url);
      }}
    />
  );
};

const CountryFlagView = withQuerystringResults(
  // ({ data = {}, metadata, properties }) => {
  (props) => {
    const {
      country_name: countryCode,
      render_as,
      show_name,
      show_flag,
      show_dropdown,
    } = props.data;
    const Tag = render_as ? render_as.toLowerCase() : 'h2';
    const [flag, setFlag] = React.useState();
    const contentdata = props.metadata || props.properties;
    const siblings = contentdata?.['@components']?.siblings?.items || [];
    const pageTitle = props.metadata.title;
    const previewImageUrl =
      contentdata && contentdata['@id'] + '/@@images/preview_image/thumb';

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
    const countries =
      props?.listingItems && props.listingItems.length > 0
        ? props.listingItems
        : siblings.filter((s) => s.title !== pageTitle);

    const countryFlag =
      (countryCode && show_flag && flag && (
        <img alt={countryNames[countryCode]} src={flag} />
      )) ||
      (contentdata?.preview_image ? (
        <PreviewImage item={contentdata} preview_image_url={previewImageUrl} />
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
  },
);

export default CountryFlagView;
