/**
 * View map block.
 * @module components/manage/Blocks/Maps/View
 */

import React, { useState } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { connect } from 'react-redux';
import { getConnectedDataParametersForContext } from 'volto-datablocks/helpers';
import VisibilitySensor from 'react-visibility-sensor';
import PrivacyProtection from 'volto-embed/PrivacyProtection/PrivacyProtection';

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

const ViewEmbedBlock = props => {
  const [visible, setVisibility] = useState(false);
  const { data, intl } = props;
  console.log('data in embed', props);
  // console.log('DataConnectedEmbed props in view', this.props);
  const param = props.connected_data_parameters
    ? props.connected_data_parameters[0].v[0]
    : null;

  // TODO: automatically discover parameters
  const url =
    param && data.baseUrl
      ? decodeURIComponent(data.baseUrl).replace('<<NUTS_CODE>>', param)
      : data.baseUrl;

  console.log('param in view', param, url);
  return url ? (
    <PrivacyProtection data={data}>
      <p
        className={cx(
          'block maps align',
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
        >
          <iframe
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

export default connect(
  (state, props) => {
    return {
      connected_data_parameters: getConnectedDataParametersForContext(
        state?.connected_data_parameters,
        state.router?.location?.pathname,
      ),
    };
  },
  {},
)(injectIntl(ViewEmbedBlock));
