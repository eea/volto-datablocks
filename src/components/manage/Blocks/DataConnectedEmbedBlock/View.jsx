/**
 * View map block.
 * @module components/manage/Blocks/Maps/View
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { connect } from 'react-redux';
import PrivacyProtection from '@eeacms/volto-embed/PrivacyProtection/PrivacyProtection';
import {
  getConnectedDataParametersForContext,
  getFilteredURL,
} from '@eeacms/volto-datablocks/helpers';
import './styles.less';

const messages = defineMessages({
  EmbededGoogleMaps: {
    id: 'Embeded Google Maps',
    defaultMessage: 'Embeded Google Maps',
  },
});

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
            style={{ height: `${data.height || 200}px` }}
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
