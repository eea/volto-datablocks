import React, { Component } from 'react';
import { SidebarPortal, TextWidget } from '@plone/volto/components';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { Button, Input, Message, Segment } from 'semantic-ui-react';
import { settings } from '~/config';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';

import aheadSVG from '@plone/volto/icons/ahead.svg';

class EditForm extends Component {
  render() {
    const { data, entityKey } = this.props;
    // const { data } = this.props;
    return (
      <SidebarPortal selected={true}>
        <Segment.Group raised>
          <header className="header pulled">
            <h2> Data connected block ${entityKey}</h2>
          </header>

          {!(data && data.url) && (
            <>
              <Segment className="sidebar-metadata-container" secondary>
                <FormattedMessage
                  id="No data provider"
                  defaultMessage="No data provider specified"
                />
                <img src={aheadSVG} alt="" />
              </Segment>
            </>
          )}

          <Segment className="form sidebar-image-data">
            <TextWidget
              id="data-provider"
              title="Data provider"
              required={false}
              value={data.url ? data.url.split('/').slice(-1)[0] : ''}
              icon={aheadSVG}
              iconAction={() =>
                this.props.openObjectBrowser({
                  mode: 'link',
                  onSelectItem: url => {
                    this.props.onChangeEntityData(entityKey, { url });
                  },
                  ...this.props,
                })
              }
              onChange={() => this.props.onChangeEntityData(entityKey, {})}
            />
          </Segment>
        </Segment.Group>
      </SidebarPortal>
    );
  }
}
export default withObjectBrowser(EditForm);
