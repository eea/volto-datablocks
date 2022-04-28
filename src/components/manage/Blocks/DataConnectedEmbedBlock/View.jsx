/**
 * View map block.
 * @module components/manage/Blocks/Maps/View
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { connect } from 'react-redux';
import PrivacyProtection from '@eeacms/volto-embed/PrivacyProtection/PrivacyProtection';
import { getConnectedDataParametersForContext } from '@eeacms/volto-datablocks/helpers';
import './styles.less';

const messages = defineMessages({
  EmbededGoogleMaps: {
    id: 'Embeded Google Maps',
    defaultMessage: 'Embeded Google Maps',
  },
});

const getFilteredURL = (url, connected_data_parameters = []) => {
  if (!connected_data_parameters?.length) return url;
  let decodedURL = decodeURIComponent(url);
  const queries = decodedURL.match(/(<<)(.*?)*>>$/g); //safari: don't use lookbehind
  if (!queries?.length) return url;

  const filteredQueries = queries.map((query) =>
    query.replace('<<', '').replace('>>', ''),
  );

  const keys = connected_data_parameters.map((param) => param.i);
  for (let poz in filteredQueries) {
    const key = filteredQueries[poz];
    const paramPoz = keys.indexOf(key);
    if (paramPoz > -1) {
      decodedURL = decodedURL.replace(
        `<<${key}>>`,
        connected_data_parameters[paramPoz].v[0],
      );

      continue;
    }
  }
  return decodedURL;
};

/**
 * View Embed block class.
 * @class View
 * @extends Component
 */

const ViewEmbedBlock = (props) => {
  const { data, intl } = props;

  const url = getFilteredURL(data.url, props.connected_data_parameters);

  return url ? (
    <PrivacyProtection data={data} {...props}>
      <p
        className={cx(
          'map-container block maps',
          {
            center: !Boolean(data.align),
          },
          data.align,
        )}
      >
        <div
          className={cx('video-inner', {
            'full-width': data.align === 'full',
          })}
          style={{
            minHeight: `${data.height || 200}px`,
          }}
        >
          <iframe
            style={{ minHeight: '100%' }}
            title={intl.formatMessage(messages.EmbededGoogleMaps)}
            src={url}
            className="google-map"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </p>
    </PrivacyProtection>
  ) : (
    ''
  );
};

export default connect((state) => {
  return {
    connected_data_parameters: getConnectedDataParametersForContext(
      state?.connected_data_parameters,
      state.router?.location?.pathname,
    ),
  };
}, {})(injectIntl(ViewEmbedBlock));
