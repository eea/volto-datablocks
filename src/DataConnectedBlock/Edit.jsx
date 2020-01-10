/*
 * Generic example of how an edit would look like for a data connected block
 * the example is incomplete and old, and not used.
 */
import React, { Component } from 'react';
import { Icon, SidebarPortal, TextWidget } from '@plone/volto/components';
import { Button, Input, Message, Segment } from 'semantic-ui-react';
import navTreeSVG from '@plone/volto/icons/nav.svg';

export default class BlockEdit extends Component {
  render() {
    return (
      <>
        <div>composite block edit</div>

        <SidebarPortal selected={this.props.selected}>
          <Segment.Group raised>
            <header className="header pulled">
              <h2>Data connected block</h2>
            </header>
            {!this.props.data.connector_path && (
              <Segment className="sidebar-metadata-container" secondary>
                No datasource selected
                <img src={navTreeSVG} alt="" />
              </Segment>
            )}
            <Segment className="form sidebar-image-data">
              <TextWidget
                id="Origin"
                title="Data connector"
                required={false}
                value={
                  (this.props.data.connector_path || '').split('/').slice(-1)[0]
                }
                icon={navTreeSVG}
                iconAction={() =>
                  this.props.openObjectBrowser({
                    mode: 'link',
                    dataName: 'connector_path',
                  })
                }
                onChange={() => {}}
              />
            </Segment>
          </Segment.Group>
        </SidebarPortal>
      </>
    );
  }
}
