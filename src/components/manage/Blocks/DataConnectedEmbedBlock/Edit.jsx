/**
 * Edit map block.
 * @module components/manage/Blocks/Maps/Edit
 */

import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import PrivacyProtection from '@eeacms/volto-embed/PrivacyProtection/PrivacyProtection';

import { SidebarPortal } from '@plone/volto/components';
import mapsBlockSVG from '@plone/volto/components/manage/Blocks/Maps/block-maps.svg';
import schema from './schema';
import { addPrivacyProtectionToSchema } from '@eeacms/volto-embed/PrivacyProtection';

const messages = defineMessages({
  MapsBlockInputPlaceholder: {
    id: 'Enter map Embed Code',
    defaultMessage: 'Enter map Embed Code',
  },
  left: {
    id: 'Left',
    defaultMessage: 'Left',
  },
  right: {
    id: 'Right',
    defaultMessage: 'Right',
  },
  center: {
    id: 'Center',
    defaultMessage: 'Center',
  },
  full: {
    id: 'Full',
    defaultMessage: 'Full',
  },
  GoogleMapsEmbeddedBlock: {
    id: 'Google Maps Embedded Block',
    defaultMessage: 'Google Maps Embedded Block',
  },
});

/**
 * Edit image block class.
 * @class Edit
 * @extends Component
 */
class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    pathname: PropTypes.string.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.getSrc = this.getSrc.bind(this);
    this.state = {
      url: '',
      error: null,
    };
    this.onSubmitUrl = this.onSubmitUrl.bind(this);
  }

  /**
   * Submit url handler
   * @method onSubmitUrl
   * @param {string} e event
   * @returns {undefined}
   */
  onSubmitUrl() {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      url: this.getSrc(this.props.data.url),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { data } = this.props;
    if (data.url !== prevProps.data.url) {
      this.onSubmitUrl();
    }
  }
  /**
   * get getSrc handler
   * @method getSrc
   * @param {string} embed Embed HTML code from Google Maps share option
   * @returns {string} Source URL
   */
  // getSrc(embed) {
  //   // Optimization, don't need the src
  //   if (!embed.trim().startsWith('<iframe')) {
  //     return embed;
  //   }
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(embed, 'text/html');
  //   const iframe = doc.getElementsByTagName('iframe');
  //   if (iframe.length === 0) {
  //     this.setState({ error: true });
  //     return '';
  //   }
  //   this.setState({ error: false });
  //   return iframe[0].src;
  // }
  getSrc(embed) {
    if (embed) {
      const nuts_code =
        this.props.properties?.data_query?.[0]?.v[0] || '<<NUTS_CODE>>';
      return embed.replace('<<NUTS_CODE>>', nuts_code);
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div
        className={cx(
          'block maps align',
          {
            center: !Boolean(this.props.data.align),
          },
          this.props.data.align,
        )}
      >
        {this.props.data.url ? (
          <PrivacyProtection data={this.props.data} isEditMode {...this.props}>
            <div
              className={cx('maps-inner', {
                'full-width': this.props.data.align === 'full',
              })}
            >
              {this.props.selected ? null : (
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    width: '100%',
                    height: '100%',
                  }}
                  className="embed-chart-overlay"
                />
              )}
              <iframe
                title={this.props.intl.formatMessage(
                  messages.GoogleMapsEmbeddedBlock,
                )}
                src={this.props.data.url}
                className="google-map"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </PrivacyProtection>
        ) : (
          <Message>
            <center>
              <img src={mapsBlockSVG} alt="" />
              <div className="message-text">
                <FormattedMessage
                  id="Please use the sidebar to add Embed URL"
                  defaultMessage="Please use the sidebar to add Embed URL."
                />
                {this.state.error && (
                  <div style={{ color: 'red' }}>
                    <FormattedMessage
                      id="Embed code error, please follow the instructions and try again."
                      defaultMessage="Embed code error, please follow the instructions and try again."
                    />
                  </div>
                )}
              </div>
            </center>
          </Message>
        )}
        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={addPrivacyProtectionToSchema(schema)}
            title={schema.title}
            onChangeField={(id, value) => {
              this.props.onChangeBlock(this.props.block, {
                ...this.props.data,
                [id]: value,
              });
            }}
            formData={this.props.data}
          />
        </SidebarPortal>
      </div>
    );
  }
}

export default injectIntl(Edit);
