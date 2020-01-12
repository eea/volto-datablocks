/**
 * View map block.
 * @module components/manage/Blocks/Maps/View
 */

import React from 'react';
import { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { connect } from 'react-redux';
import { getConnectedDataParameters } from 'volto-datablocks/helpers';

const messages = defineMessages({
  EmbededGoogleMaps: {
    id: 'Embeded Google Maps',
    defaultMessage: 'Embeded Google Maps',
  },
});

/**
 * View image block class.
 * @class View
 * @extends Component
 */

class View extends Component {
  render() {
    const data = this.props.data;
    const intl = this.props.intl;
    console.log('props in view', this.props);
    const param = this.props.connected_data_parameters
      ? this.props.connected_data_parameters[0].v[0]
      : null;
    const url =
      param && data.baseUrl
        ? data.baseUrl.replace('<<NUTS_CODE>>', param)
        : data.url;
    return (
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
    );
  }
}

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
//  */
// View.propTypes = {
//   data: PropTypes.objectOf(PropTypes.any).isRequired,
// };

// export default injectIntl(View);

export default connect(
  (state, props) => ({
    connected_data_parameters: getConnectedDataParameters(state, props),
  }),
  {},
)(injectIntl(View));
