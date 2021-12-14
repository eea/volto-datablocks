/**
 * View map block.
 * @module components/manage/Blocks/Maps/View
 */

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { connect } from 'react-redux';
import PrivacyProtection from '@eeacms/volto-embed/PrivacyProtection/PrivacyProtection';
import { getConnectedDataParametersForContext } from '../../../../helpers';
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
  // console.log('data in embed', props);
  // console.log('DataConnectedEmbed props in view', this.props);
  const param = props.connected_data_parameters
    ? props.connected_data_parameters[0]?.query?.[0]?.v?.[0] ||
      props.connected_data_parameters[0]?.v?.[0]
    : null;

  // TODO: automatically discover parameters
  const url =
    param && data.url
      ? decodeURIComponent(data.url).replace('<<NUTS_CODE>>', param)
      : data.url;
  const styles = {
    height: `${data.height}px`,
  };
  // console.log('param in view', param, url);
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
          style={data.height ? styles : {}}
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

export default connect((state, props) => {
  return {
    connected_data_parameters: getConnectedDataParametersForContext(
      state?.connected_data_parameters,
      state.router?.location?.pathname,
    ),
  };
}, {})(injectIntl(ViewEmbedBlock));
