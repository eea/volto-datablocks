/*
 * A generic form to pick ConnectedDataValues metadata
 *
 * Pass schema for columns schema. See forests-frontend ForestCoverageBlock
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Segment } from 'semantic-ui-react';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import { SidebarPortal, TextWidget } from '@plone/volto/components';
import { changeSidebarState } from 'volto-sidebar/actions';
import MultiValuesEdit from './MultiValuesEdit';

class EditForm extends Component {
  onChangeBlock() {
    // needed by ObjectBrowser
  }

  render() {
    const { data, title, onChange, schema } = this.props;
    if (this.props.selected) this.props.changeSidebarState(true);
    /*
     * data is like:
     * { columns: { first: {title: 'Percentage', value: 'PERC_01', format: 'raw'}, }}
     */

    return (
      <SidebarPortal selected={this.props.selected}>
        <Segment.Group raised>
          <header className="header pulled">
            <h2>{title}</h2>
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
                  onSelectItem: url => onChange({ url }),
                  ...this.props,
                })
              }
              onChange={() => this.props.onChange({})}
            />
          </Segment>
          <MultiValuesEdit
            schema={schema}
            onChange={this.props.onChange}
            data={data}
          />
        </Segment.Group>
      </SidebarPortal>
    );
  }
}

// TODO: use the redux store to cache the provider data, as it doesn't change
// often

const ConnectedEditForm = connect(
  null,
  {
    changeSidebarState,
  },
)(EditForm);

export default withObjectBrowser(ConnectedEditForm);
